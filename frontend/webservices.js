var http = require('http');
var url = require('url');
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

app.get('/platforms/list', async (req, res, next) => {   
    var result = await DB.listPlatform();
    res.jsonp(result);
});

app.post('/platforms/new', async (req, res, next) => {   
    var body = getParams(req);
    console.log(body);
    var result = DB.newPlatform(body);
    res.end();
});

app.listen(port);
console.log('Aplicación creada en el puerto: ' + port);
