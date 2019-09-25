var DB = require('./database.js');
const interval = require('interval-promise')
const http = require('http');
const https = require('https')
const url = require('url');

function header(){
    obj = {
            "id": DB.platformName(),
            "url": DB.ip,
            "date": DB.getTimeInFormat(),        
        }
    return obj;
}

function getKey(attributes){
    for (var key in attributes) {
        return key; 
    }
}

function change(event,idEvent,urlEvent){
    var obj = header();
    var requestUrl = '';
    obj.change = {};
    var changeObj = {}
    for(key in event){
        if(key == 'url') requestUrl = event[key];
        else{
            changeObj[key] = event[key];
        } 
    }
    obj.change[idEvent] = changeObj;    
    console.log(obj);

    const options = {
        hostname: 'http://' + requestUrl,
        path: '/change',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }
      
    const req = http.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`)
        res.on('data', function (body) {
            console.log('BODY: ' + body);
        });
    })
      
    req.on('error', (error) => {
        console.error(error)
    })
    
    req.write(data)
    req.end()
}

function requestChange(){

}

function handlerCondition(contition,idEvent,urlEvent){
    if(condition != null){
        if(contition.url == localIp){
            change(event.then,idEvent,urlEvent);//mine
        }else{
            requestChange(event.then,idEvent,urlEvent);//not mine
        }
    } 
}

async function handlerEvent(event){
    var localIp = DB.ip();
    var idEvent = event.if.left.id;
    var urlEvent = event.if.left.url;
    console.log(localIp);
    if(urlEvent == localIp){// hardware mine
        var key = getKey(event.if.right);
        var val = event.if.right[key];
        var hardware = await DB.getInfoById(event.if.left.id);
        var hardwareVal = hardware[key];
        console.log("el key es: " + key);
        console.log("el valor es: " + val);
        console.log("el valor del hardware es: " + hardwareVal);        
        switch(event.if.condition.trim()){
            case '=':{
                console.log("=")
                if(hardwareValue == val){
                    handlerCondition(event.then,idEvent,urlEvent);
                }else{
                    handlerCondition(event.else,idEvent,urlEvent);
                }
                break;
            }
            case '!=':{
                console.log("!=")
                if(hardwareValue != val){
                    handlerCondition(event.then,idEvent,urlEvent);
                }else{
                    handlerCondition(event.else,idEvent,urlEvent);
                }                  
                break;
            }
            case '<':{
                console.log("<")
                if(hardwareValue < val){
                    handlerCondition(event.then,idEvent,urlEvent);
                }else{
                    handlerCondition(event.else,idEvent,urlEvent);
                }
                break;
            }
            case '>':{
                console.log(">")
                if(hardwareValue > val){
                    handlerCondition(event.then,idEvent,urlEvent);
                }else{
                    handlerCondition(event.else,idEvent,urlEvent);
                }
                break;
            }
            case '<=':{
                console.log("<=")
                if(hardwareValue <= val){
                    handlerCondition(event.then,idEvent,urlEvent);
                }else{
                    handlerCondition(event.else,idEvent,urlEvent);
                }
                break;
            }
            case '>=':{
                console.log(">=")
                if(hardwareValue >= val){
                    handlerCondition(event.then,idEvent,urlEvent);
                }else{
                    handlerCondition(event.else,idEvent,urlEvent);
                }
                break;
            }
        }
    }else{//hardware not mine

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


// handler = async function(){
//     setInterval(function() {
//         var events = await DB.getEvents(); 
//         for(key in events){
//             handlerEvent(events[key]);
//         }
//     }, 500);
// }

handler();