var fs = require('fs');
var express    = require('express');        // Utilizaremos express, aqui lo mandamos llamar
var app        = express();                 // definimos la app usando express
var bodyParser = require('body-parser'); //
var DB = require('./database.js');
var cors = require('cors');
app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 80;        // seteamos el puerto

function getParams(req){
    if(req.headers["content-type"] == "application/json" || req.headers["content-type"] == "application/x-www-form-urlencoded"){
        return req.body;
    }else if(req.headers["content-type"] == "application/x-www-form-urlencoded"){
        return req.params;
    }
    return new Object();
}

function getContentType(file){
    var typeFile = file.substring(file.lastIndexOf(".") + 1,file.length);
    switch(typeFile){
        case "html":
        case "css":
        case "csv":
        case "htm":
        case "ics":{
            return"text/" + typeFile;
        }
        case "gif":
        case "jpeg":
        case "jpg":
        case "svg":
        case "webp":
        case "tiff":{
            return"image/" + typeFile;
        }  
        case "aac":
        case "midi":
        case "mid":
        case "oga":
        case "wav":
        case "weba":{
            return "audio/" + typeFile;
        }   
        case "js":
        case "json":
        case "ogx":
        case "pdf":{
            return "application/" + typeFile;
        }
        default: return "text/html";                                                                                    
    }
}

app.get('(/*.html|/|/*.js|/*.css)', async (req, res, next) => {  
    var path = ''; 
    if(req.url.indexOf('?') > 0)  path = req.url.substring(0,req.url.indexOf('?'));
    else path = req.url;
    var filename = (path == "/") ? "./index.html" : "." + path;
    var contentType = getContentType(filename);
    fs.readFile(filename, function(err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("404 Not Found");
      } 
      res.writeHead(200, {'Content-Type': contentType});
      res.write(data);
      return res.end();
    });
});

app.post('/events/create', async (req, res, next) => {
    var body = getParams(req);
    for(key in body.create){
        body[key] = body.create[key];    
    }
    delete body.create;    
    id = await DB.createEvent(body); 
    res.send(id);
});

app.post('/events/update', async (req, res, next) => {
    var body = getParams(req);
    var idEvent = body._id;
    body.type = 'update';
    for (key in body.update) {
        body[key] = body.update[key];
    }
    delete body.update.id;
    delete body.update;
    DB.updateEvent(idEvent, body);
    res.end();
});

app.post('/events/delete', async (req, res, next) => {
    var body = getParams(req);
    if(DB.deleteEvent(body.idEvent));
    return res.end();
});

app.post('/events/list', async (req, res, next) => {
    var result = await DB.listEvent();
    res.jsonp(result);
});

app.get('/platforms/list', async (req, res, next) => {   
    var result = await DB.listPlatform();
    res.jsonp(result);
});

app.post('/platforms/new', async (req, res, next) => {   
    var body = getParams(req);
    var result = await DB.newPlatform(body);
    res.send(result);
});

app.post('/platforms/delete', async (req, res, next) => {   
    var body = getParams(req);
    var result = DB.deletePlatform(body.idPlatform);
    res.end();
});

app.post('/platforms/update', async (req, res, next) => {   
    var body = getParams(req);
    console.log(body);
    var result = DB.updatePlatform(body.idPlatform, { name: body.name, url: body.url});
    res.end();
});

app.post('/device', async (req, res, next) => {   
    var body = getParams(req);
    console.log(body);
    var idHardware = body.search['id_hardware'];
    var type = body.search['type'];    
    for(key in body.data){
        var obj = {};
        obj = body.data[key];
        obj.date = new Date(key); 
        obj.idHardware = idHardware;
        obj.type = type;
        DB.createDevice(obj);    
    }
    res.end();
});

app.post('/search', async (req, res, next) => {   
    var body = getParams(req);
    var idHardware = body.search['id_hardware'];
    var startDate = body.search['start_date'];
    var finishDate = body.search['finish_date'];
    var result = await DB.searchEvents(idHardware,startDate,finishDate);
    var obj = {}
    obj = DB.getHeader();
    obj.from = 'cache';
    obj.search = {}
    obj.search['id_hardware'] = idHardware;
    obj.data = {};
    if(result.length > 0){
        obj.search['type'] = result[0].type;
        obj.start = (result[0].date);
        obj.finish = (result[result.length - 1].date);       
        for(var i = 0; i < result.length; i++){ 
            var eachObj = {
                sensor: result[i].sensor || "",
                status: result[i].status || "",
                text: result[i].text || "",
                freq: result[i].freq || "",
            }
            obj.data[strftime('%Y-%m-%dT%H:%M:%S%z',new Date(result[i].date))] = eachObj;
        }
    }
    res.jsonp(obj); 
});

app.listen(port);
console.log('Aplicación creada en el puerto: ' + port);
