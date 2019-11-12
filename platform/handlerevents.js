var DB = require('./database.js');
const interval = require('interval-promise')
const http = require('http');
strftime = require("strftime");
let externalEvents = [];

function getKey(attributes){
    for (var key in attributes) {
        return key; 
    }
}

function lookupEvent(search,event){
    for(keyDate in search.data){
        var match = null;
        var key = getKey(event.if.right);
        var val = event.if.right[key];
        var hardware = search.data[keyDate];
        var hardwareVal = hardware[key];        
        switch(event.if.condition.trim()){
            case '=':{
                if(hardwareVal == val){
                    if(match == null) match = true;
                }else{
                    if(match == null) match = false;
                }
                break;
            }
            case '!=':{
                if(hardwareVal != val){
                    if(match == null) match = true;
                }else{
                    if(match == null) match = false;
                }                 
                break;
            }
            case '<':{
                if(hardwareVal < val){
                    if(match == null) match = true;
                }else{
                    if(match == null) match = false;
                }
                break;
            }
            case '>':{
                if(hardwareVal > val){
                    if(match == null) match = true;
                }else{
                    if(match == null) match = false;
                }
                break;
            }
            case '<=':{
                if(hardwareVal <= val){
                    if(match == null) match = true;
                }else{
                    if(match == null) match = false;
                }
                break;
            }
            case '>=':{
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

function ISODateString(d) {
    function pad(n) {return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
         + pad(d.getUTCMonth()+1)+'-'
         + pad(d.getUTCDate())+'T'
         + pad(d.getUTCHours() - 6)+':'
         + pad(d.getUTCMinutes())+':'
         + pad(d.getUTCSeconds())+'Z'
}

function search(event,hardwareEvent){
    var obj = DB.getHeader();
    var url = url = event['url'];
    var requestUrl = '';
    var requestPort = '';
    var end_date = new Date();
    var start_date = new Date(end_date.getTime() - 1*60000);
    obj.search = {
        id_hardware: event.id,
        start_date:  ISODateString(start_date),
        finish_date: ISODateString(end_date),
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
        res.on('data', function (body) {
            try{
                lookupEvent(JSON.parse(body),hardwareEvent);
            }catch(e){

            }
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
            // console.log('body: ' + body);
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
    if(event != undefined){
        var idEvent = event.if.left.id;
        var urlEvent = event.if.left.url;
        if(urlEvent == localIp){// hardware mine
            var key = getKey(event.if.right);
            var val = event.if.right[key];
            var hardware = await DB.getInfoById(idEvent);
            var hardwareVal = hardware[key];  
            switch(event.if.condition.trim()){
                case '=':{
                    if(hardwareVal == val){
                        change(event.then)
                    }else{
                        change(event.else)
                    }
                    break;
                }
                case '!=':{
                    if(hardwareVal != val){
                        change(event.then)
                    }else{
                        change(event.else)
                    }                  
                    break;
                }
                case '<':{
                    if(hardwareVal < val){
                        change(event.then)
                    }else{
                        change(event.else)
                    }
                    break;
                }
                case '>':{
                    if(hardwareVal > val){
                        change(event.then)
                    }else{
                        change(event.else)
                    }
                    break;
                }
                case '<=':{
                    if(hardwareVal <= val){
                        change(event.then)
                    }else{
                        change(event.else)
                    }
                    break;
                }
                case '>=':{
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
    return true;
}
 
// handlerExternalEvent = async function(_id){
//     var query = {_id: _id}
//     var event = await DB.getEventsByCondition(query);  
//     interval(async () => {
//         handlerEvent(event);
//     }, event.freq)
// }

handlerExternalEvent = async function(_id, time){  
    handlerEvent(event);
    while(true){
        var query = {_id: _id, who: `notmine`}
        var event = await DB.getEventByCondition(query);
        if(event == undefined) break;
        var delayInMilliseconds = event.if.left.freq;
        // var delayInMilliseconds = ;
        setTimeout(function() {
            handlerEvent(event);
        }, delayInMilliseconds);   
    }
}


lookupNewEvents = async () => {
    var query = {who: `notmine`}
    var events = await DB.getEventsByCondition(query);
    for(key in events){
        event = events[key];
        if(!(externalEvents.includes(event._id))) {
            externalEvents.push(event._id);
            handlerExternalEvent(event._id, event.if.left.freq);
        }
    }
}

exports.handlerExternalEvents = async () => {
    var query = {who: `notmine`}
    var events = await DB.getEventsByCondition(query);
    for(key in events){
        event = events[key];
        externalEvents.push(event._id);
        handlerExternalEvent(event._id, event.if.left.freq);
    }
    lookupNewEvents();
}

exports.handlerById = async function(id_hardware){
    var events = await DB.getEventsById(id_hardware, 'mine'); 
    for(key in events){
        handlerEvent(events[key]);
    }
}
