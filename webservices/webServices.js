var express    = require('express');        // Utilizaremos express, aqui lo mandamos llamar
var app        = express();                 // definimos la app usando express
var bodyParser = require('body-parser'); //
var DB = require('./dataBase.js');

// create web worker from blob url
var worker = new Worker("test.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8080;        // seteamos el puerto

app.post('/info', async (req, res, next) => {
    if(req.headers["content-type"] == "application/json"){
        body = req.body;
    }else if(req.headers["content-type"] == "application/x-www-form-urlencoded"){
        body = req.params;
    }
    var body = req.body;
    var id = body['id'];
    var url = body['url'];
    var date = body['date'];
    DB.writeLogInfo(id,url,date,'request to ./info');
    result = await DB.getInfo("greenhouseCC8");
    res.jsonp(result);
});

app.post('/search', async (req, res, next) => {
    var body;
    if(req.headers["content-type"] == "application/json"){
        body = req.body;
    }else if(req.headers["content-type"] == "application/x-www-form-urlencoded"){
        body = req.params;
    }
    var body = req.body;
    var id = body['id'];
    var url = body['url'];
    var date = body['date'];
    var search = body['search'];
    DB.writeLogSearchOrChange(id,url,date,search,'request to ./search');
    res.json({ message: search}); 
});

app.post('/change', async (req, res, next) => {
    var body;
    if(req.headers["content-type"] == "application/json"){
        body = req.body;
    }else if(req.headers["content-type"] == "application/x-www-form-urlencoded"){
        body = req.params;
    }
    var body = req.body;
    var id = body['id'];
    var url = body['url'];
    var date = body['date'];
    var change = body['change'];
    DB.writeLogSearchOrChange(id,url,date,change,'request to ./change');
    res.json({ message: change}); 
});

app.listen(port);
console.log('Aplicación creada en el puerto: ' + port);