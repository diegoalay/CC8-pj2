var http = require('http');
var url = require('url');
var fs = require('fs');
// var uc = require('upper-case');
// var events = require('events');
// var eventEmitter = new events.EventEmitter();
var mailer = require('./mailer.js');

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

http.createServer(function (req, res) {
    var request = url.parse(req.url, true);
    var filename = (request.pathname == "./") ? "./index.html" : "." + request.pathname;
    var contentType = getContentType(filename);
    fs.readFile(filename, function(err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("404 Not Found");
      } 
      res.writeHead(200, {'Content-Type': contentType});
      res.write(data);
    //   mailer.sendMail();
      return res.end();
    });
}).listen(8080);

