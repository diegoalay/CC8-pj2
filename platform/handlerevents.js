var DB = require('./database.js');
const interval = require('interval-promise')
const http = require('http');
strftime = require("strftime");
let externalEvents = {};

function getKey(attributes){
    for (var key in attributes) {
        return key; 
    }
}

function lookupEvent(search,event){
    console.log(search);
    for(keyDate in search.data){
        var match = null;
        var key = getKey(event.if.right);
        var val = event.if.right[key];
        var hardware = search.data[keyDate];
        var hardwareVal = hardware[key];
        console.log("el key es: " + key);
        console.log("el valor es: " + val);
        console.log("el valor del hardware es: " + hardwareVal);        
        switch(event.if.condition.trim()){
            case '=':{
                console.log("=")
                if(hardwareVal == val){
                    if(match == null) match = true;
                }else{
                    if(match == null) match = false;
                }
                break;
            }
            case '!=':{
                console.log("!=")
                if(hardwareVal != val){
                    if(match == null) match = true;
                }else{
                    if(match == null) match = false;
                }                 
                break;
            }
            case '<':{
                console.log("<")
                if(hardwareVal < val){
                    if(match == null) match = true;
                }else{
                    if(match == null) match = false;
                }
                break;
            }
            case '>':{
                console.log(">")
                if(hardwareVal > val){
                    if(match == null) match = true;
                }else{
                    if(match == null) match = false;
                }
                break;
            }
            case '<=':{
                console.log("<=")
                if(hardwareVal <= val){
                    if(match == null) match = true;
                }else{
                    if(match == null) match = false;
                }
                break;
            }
            case '>=':{
                console.log(">=")
                if(hardwareVal >= val){
                    if(match == null) match = true;
                }else{
                    if(match == null) match = false;
                }
                break;
            }
        }        
    }
    if(match){
        change(event.then)
    }else{
        change(event.else)
    }
}

function search(event,hardwareEvent){
    var obj = DB.getHeader();
    var url = url = event['url'];
    var requestUrl = '';
    var requestPort = '';
    var end_date = new Date();
    var start_date = new Date(end_date.getTime() - 1000);
    obj.search = {
        id_hardware: event.id,
        start_date: strftime('%Y-%m-%dT%H:%M:%S%z', start_date),
        finish_date: strftime('%Y-%m-%dT%H:%M:%S%z', end_date)
    };   
    if(url.includes(':')){
        requestUrl = url.substring(0,url.indexOf(':'));
        requestPort = url.substring(url.indexOf(':') + 1,url.length);
    }else{
        requestUrl = url;
        requestPort = 80;
    }
    const options = {
        hostname: requestUrl,
        path: '/search',
        method: 'POST',
        port: requestPort,
        headers: {
            'Content-Type': 'application/json',
        }
    }
      
    const req = http.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`)
        res.on('data', function (body) {
            lookupEvent(JSON.parse(body),hardwareEvent);
        });
    })
      
    req.on('error', (error) => {
        console.error(error);
    })
    
    req.write(JSON.stringify(obj));
    req.end();
}

function change(event){
    console.log(event);
    var obj = DB.getHeader();
    var url = '';
    var requestUrl = '';
    var requestPort = '';
    obj.change = {};
    var changeObj = {}
    for(key in event){
        if(key == 'url') url = event[key];
        else{
            changeObj[key] = event[key];
        } 
    }
    obj.change[event.id] = changeObj;   
    if(url.includes(':')){
        requestUrl = url.substring(0,url.indexOf(':'));
        requestPort = url.substring(url.indexOf(':') + 1,url.length);
    }else{
        requestUrl = url;
        requestPort = 80;
    }
    const options = {
        hostname: requestUrl,
        path: '/change',
        method: 'POST',
        port: requestPort,
        headers: {
            'Content-Type': 'application/json',
        }
    }
      
    const req = http.request(options, (res) => {
        res.on('data', function (body) {
            console.log('body: ' + body);
        });
    })
      
    req.on('error', (error) => {
        console.error(error);
    })
    
    req.write(JSON.stringify(obj));
    req.end();
}


async function handlerEvent(event){
    var localIp = DB.ip();
    var idEvent = event.if.left.id;
    var urlEvent = event.if.left.url;
    console.log(event);
    if(urlEvent == localIp){// hardware mine
        var key = getKey(event.if.right);
        var val = event.if.right[key];
        var hardware = await DB.getInfoById(idEvent);
        var hardwareVal = hardware[key];  
        switch(event.if.condition.trim()){
            case '=':{
                console.log("=")
                if(hardwareVal == val){
                    change(event.then)
                }else{
                    change(event.else)
                }
                break;
            }
            case '!=':{
                console.log("!=")
                if(hardwareVal != val){
                    change(event.then)
                }else{
                    change(event.else)
                }                  
                break;
            }
            case '<':{
                console.log("<")
                if(hardwareVal < val){
                    change(event.then)
                }else{
                    change(event.else)
                }
                break;
            }
            case '>':{
                console.log(">")
                if(hardwareVal > val){
                    change(event.then)
                }else{
                    change(event.else)
                }
                break;
            }
            case '<=':{
                console.log("<=")
                if(hardwareVal <= val){
                    change(event.then)
                }else{
                    change(event.else)
                }
                break;
            }
            case '>=':{
                console.log(">=")
                if(hardwareVal >= val){
                    console.log('si');
                    change(event.then)
                }else{
                    change(event.else)
                }
                break;
            }
        }
    }else{//hardware not mine
        var searchData = search(event.if.left,event);
    }   
}
 
handlerExternalEvent = async function(event){
    interval(async () => {
        handlerEvent(event);
    }, event.freq)
}

exports.lookupNewEvents = async () => {
    var query = {who: `notmine`}
    var events = await DB.getEventsByCondition(query);
    for(key in events){
        event = events[key];
        if(!(externalEvents.includes(event._id))) {
            handlerExternalEvent(event);
            externalEvents.push(event);
        }
    }
}

exports.handlerEvents = async () => {
    var query = {who: `notmine`}
    var events = await DB.getEventsByCondition(query);         
    for(key in events){
        event = events[key];
        handlerExternalEvent(event);
        externalEvents.push(event._id);
    }
}

exports.handlerById = async function(id_hardware){
    var events = await DB.getEventsById(id_hardware); 
    for(key in events){
        handlerEvent(events[key]);
    }
}
