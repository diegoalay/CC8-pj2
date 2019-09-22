var express    = require('express');        // Utilizaremos express, aqui lo mandamos llamar
var app        = express();                 // definimos la app usando express
var bodyParser = require('body-parser'); //
var DB = require('./database.js');
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

app.post('/info', async (req, res, next) => {    
    var body = getParams(req);
    var body = req.body;
    var id = body['id'];
    var url = body['url'];
    var date = body['date'];
    DB.writeLogInfo(id,url,date,'request to ./info');   
    var obj = {};
    obj.id = DB.platformName();
    obj.url = DB.ip();
    obj.date = DB.getTimeInFormat();    
    result = await DB.getInfo();
    obj.hardware = {};
    for(var i = 0; i < result.length; i++){
        var eachObj = {
            tag: result[i].tag,
            text: result[i].type,
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
    DB.writeLogSearchOrChange(id,url,date,search,'request to ./search');
    var obj = {};
    obj.id = DB.platformName();
    obj.url = DB.ip();
    obj.date = DB.getTimeInFormat();       
    result = await DB.searchEvents(search.id_hardware,search.start_date,search.finish_date);
    obj.search = {
        id_hardware: search.id_hardware,
        type: result[0].type,
    }
    obj.data = {};
    for(var i = 0; i < result.length; i++){
        var eachObj = {
            sensor: result[i].sensor,
            status: result[i].status,
            text: result[i].text,
            freq: result[i].freq,
        }
        obj.data[strftime('%Y-%m-%dT%H:%M:%S%z',new Date(result[i].date))] = eachObj;
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
    DB.writeLogSearchOrChange(id,url,date,change,'request to ./change');
    res.json({ data: change}); 
});

app.post('/devices', async (req, res, next) => {
    var body = getParams(req);
    var id = body['id'];
    var sensor = body['sensor'];
    DB.writeDevice(id,sensor);
    res.json({ message: sensor}); 
});

app.listen(port);
console.log('Aplicación creada en el puerto: ' + port);