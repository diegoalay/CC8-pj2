var express    = require('express');        // Utilizaremos express, aqui lo mandamos llamar
var app        = express();                 // definimos la app usando express
var bodyParser = require('body-parser'); //
var DB = require('./dataBase.js');
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
    var obj = {};
    obj.id = DB.platformName();
    obj.ip = DB.ip();
    obj.date = DB.getTimeInFormat();    
    result = await DB.getInfo();
    obj['hardware'] = result;
    res.jsonp(obj);
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
    result = await DB.searchInfo(search.id_hardware,search.start_date,search.finish_date);
    // var obj = {};
    // var data = {};
    // for(var r in result){
    //     var eachObj = {};
    //     eachObj = r.date;
    //     eachObj.value = r;
    // }
    // obj.data = data;
    res.json({ message: result}); 
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

app.post('/devices', async (req, res, next) => {
    var body;
    if(req.headers["content-type"] == "application/json"){
        body = req.body;
    }else if(req.headers["content-type"] == "application/x-www-form-urlencoded"){
        body = req.params;
    }
    var id = body['id'];
    var sensor = body['sensor'];
    DB.writeDevice(id,sensor);
    res.json({ message: sensor}); 
});

app.listen(port);
console.log('Aplicación creada en el puerto: ' + port);