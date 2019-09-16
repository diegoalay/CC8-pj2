var express    = require('express');        // Utilizaremos express, aqui lo mandamos llamar
var app        = express();                 // definimos la app usando express
var bodyParser = require('body-parser'); //
var DB = require('./dataBase.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8080;        // seteamos el puerto

app.get('/info', async (req, res, next) => {
    // var id = req.param('id');
    // var url = req.param('url');
    // var date = req.param('date');
    // var result = "id is null";
    // if(id == null) {
        result = await DB.getInfo("greenhouseCC8");
        res.jsonp(result);
    // }else{
        // res("no id");
    // }    
});

app.get('/search', async (req, res, next) => {
    
});

app.listen(port);
console.log('Aplicación creada en el puerto: ' + port);