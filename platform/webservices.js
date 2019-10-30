var express    = require('express');        // Utilizaremos express, aqui lo mandamos llamar
var app        = express();                 // definimos la app usando express
var bodyParser = require('body-parser'); //
var DB = require('./database.js');
var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://172.20.10.3');
// var handlerEvents = require('./handlerevents.js');
var cors = require('cors');
app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8080;        // seteamos el puerto


function getParams(req){
    if(req.headers["content-type"] == "application/json"){
        return req.body;
    }else if(req.headers["content-type"] == "application/x-www-form-urlencoded"){
        return req.params;
    }
    return new Object();
}

client.on('connect', function () {
    client.subscribe('/devices', function (err) {
      if (!err) {
        client.publish('/response', 'Axel me hace su hijo');
      }
    })
  })
  
client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString());
})

app.post('/info', async (req, res, next) => {    
    var body = getParams(req);
    var body = req.body;
    var id = body['id'];
    var url = body['url'];
    var date = body['date'];
    DB.createLogInfo(id,url,date,'request to ./info');   
    var obj = DB.getHeader();
    result = await DB.getInfo();
    obj.hardware = {};
    for(var i = 0; i < result.length; i++){
        var eachObj = {
            tag: result[i].tag,
            type: result[i].type,
        }
        obj.hardware[result[i].id] = eachObj;
    }
    res.jsonp(obj);
});

app.post('/search', async (req, res, next) => {
    var body = getParams(req);
    var body = req.body;
    var id = body['id'];
    var url = body['url'];
    var date = body['date'];
    var search = body['search'];
    DB.createLogSearchOrChange(id,url,date,search,'request to ./search', 'search');
    var obj = DB.getHeader();    
    result = await DB.searchEvents(search.id_hardware,search.start_date,search.finish_date);
    info = await DB.getInfoById(search.id_hardware)
    obj.search = {
        id_hardware: search.id_hardware,
        type: info.type,
    }
    obj.data = {};
    if(result.length > 0){
        for(var i = 0; i < result.length; i++){
            var eachObj = {
                sensor: result[i].sensor,
                status: result[i].status,
                text: result[i].text,
                freq: result[i].freq,
            }
            obj.data[strftime('%Y-%m-%dT%H:%M:%S%z',new Date(result[i].date))] = eachObj;
        }
    }
    res.jsonp(obj); 
});

app.post('/change', async (req, res, next) => {
    var body = getParams(req);
    var body = req.body;
    var id = body['id'];
    var url = body['url'];
    var date = body['date'];
    var change = body['change'];
    var idHardware = '';
    for(key in change){
        idHardware = key;
    }
    DB.createLogSearchOrChange(id,url,date,change,'request to ./change','change');
    DB.change(idHardware,change[idHardware]);
    res.json({ data: change}); 
});

app.post('/devices', async (req, res, next) => {
    var body = getParams(req);
    var id = body['id'];
    var sensor = body['sensor'];
    DB.createDevice(id,sensor);
    res.json({ message: sensor}); 
});

app.post('/create', async (req, res, next) => {
    var body = getParams(req);
    body.action = 'create';
    for(key in body.create){
        body[key] = body.create[key];    
    }
    body.hardware_id = body.create.if.left.id;
    delete body.create;
    var obj = DB.getHeader();
    try{
        obj.idEvent = await DB.createEvent(body);    
        obj.status = "OK";
    }catch(e){
        obj.status = "ERROR";
    }
    res.jsonp(obj);
});

app.post('/update', async (req, res, next) => {
    var body = getParams(req);
    console.log(body);
    var idEvent = body.update.id;
    body.action = 'update';
    for(key in body.update){
        body[key] = body.update[key];    
    }    
    // if(body.create.if != undefined) body.hardware_id = body.create.if.left.id;
    delete body.update.id;
    delete body.update;
    var obj = DB.getHeader();
    if(DB.updateEvent(idEvent,body)) obj.status = "OK";
    else obj.status = "ERROR";
    res.jsonp(obj);
});

app.post('/delete', async (req, res, next) => {
    var body = getParams(req);
    var idEvent = body.delete.id;
    var obj = DB.getHeader();
    if(DB.deleteEvent(idEvent)) obj.status = "OK";
    else obj.status = "ERROR";
    res.jsonp(obj);
});
// '1883'
app.listen(port);
console.log('Aplicac ión creada en el puerto: ' + port);