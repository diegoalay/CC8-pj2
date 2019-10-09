var DB = require('./database.js');
const interval = require('interval-promise')
const http = require('http');
strftime = require("strftime");

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
    console.log(event);
    var obj = DB.getHeader();
    var url = url = event['url'];
    var requestUrl = '';
    var requestPort = '';
    // var end_date = new Date();
    // var start_date = new Date(end_date.getTime() - 1000);
    var start_date = new Date('2019-09-17T14:33:37-0600');
    var end_date = new Date('2019-09-19T00:06:22-0600');
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
    console.log(requestUrl);
    console.log(requestPort);
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
    console.log("OBJECT HERE"); 
    console.log(obj);
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
        console.log(`statusCode: ${res.statusCode}`)
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
    // var localIp = '1234';
    var idEvent = event.if.left.id;
    var urlEvent = event.if.left.url;
    console.log(localIp);
    if(urlEvent == localIp){// hardware mine
        var key = getKey(event.if.right);
        var val = event.if.right[key];
        var hardware = await DB.getInfoById(idEvent);
        var hardwareVal = hardware[key];
        console.log("el key es: " + key);
        console.log("el valor es: " + val);
        console.log("el valor del hardware es: " + hardwareVal);        
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
 
handler = async function(){
    // interval(async () => {
        var events = await DB.getEvents(); 
        for(key in events){
            handlerEvent(events[key]);
        }
    // }, 1000)
}

handler();