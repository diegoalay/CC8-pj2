var express = require('express'); // Utilizaremos express, aqui lo mandamos llamar
var app = express(); // definimos la app usando express
var bodyParser = require('body-parser'); //
var DB = require('./database.js');
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://192.168.0.111');
var handlerEvents = require('./handlerevents.js');
var cors = require('cors');
app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8080; // seteamos el puerto
var outputInfo = {};
const { WebClient } = require('@slack/web-api');
const token = 'xoxp-832530948422-832176886503-832537029094-ee75aba76a23106b7ae70826e384af3c';
const web = new WebClient(token);

const conversationId1 = 'CQDR74G2Y'; //General
const conversationId2 = 'CQE9VEBLG'; //Bomba
const conversationId3 = 'CQDRMB7UL'; //Luces
const conversationId4 = 'CQ2REJD19'; //Temperatura

//Mandar Mensaje Slack

function sendSlack(msg, channelId) {
    (async() => {
        // See: https://api.slack.com/methods/chat.postMessage
        const res = await web.chat.postMessage({ channel: `${channelId}`, text: `${msg}` });

        // `res` contains information about the posted message
        console.log('Message sent: ', res.ts);
    })();
}
//llamada Demo.
sendSlack("Temperatura", conversationId4);

function correctFormat(type, val) {
    try {
        if (type == `text`) {
            return val;
        } else if (type == `status`) {
            if (val == `true`) return true;
            else return false;
        } else {
            return parseFloat(val);
        }
    } catch (e) {
        return `invalid format`;
    }
}

function getParams(req) {
    if (req.headers["content-type"] == "application/json") {
        return req.body;
    } else if (req.headers["content-type"] == "application/x-www-form-urlencoded") {
        return req.params;
    }
    return new Object();
}

client.on('connect', function() {
    client.subscribe('/devices', function(err) {
        if (!err) {
            client.publish('/response', 'ERROR');
        }
    })
})

client.on('message', async function(topic, message) {
    obj = JSON.parse(message.toString());
    DB.change(obj.id, { sensor: correctFormat(`sensor`, obj.sensor) });
    events = await handlerEvents.handlerById(obj.id);
    resultSensor = await DB.getInfoById(obj.id);
    resultLed = await DB.getInfoById(`id02`);
    resultBomb = await DB.getInfoById(`id03`);
    var statusLed = false;
    var statusBomb = false;
    if (outputInfo[`id02`] === undefined) {
        outputInfo.id02 = {};
        outputInfo.id02 = resultLed;
    } else {
        if (outputInfo.id02.text != resultLed.text) {
            if (resultLed.text === `ON`) statusLed = true;
            DB.createDevice(`id02`, 0, resultSensor, statusLed, resultLed.text);
        }
    }

    if (outputInfo[`id03`] === undefined) {
        outputInfo.id03 = {};
        outputInfo.id03 = resultBomb;
    } else {
        if (outputInfo.id03.text != resultBomb.text) {
            if (resultBomb.text === `ON`) statusBomb = true;
            DB.createDevice(`id03`, 0, resultSensor, statusBomb, resultBomb.text);
        }
    }
    DB.createDevice(obj.id, obj.sensor, resultSensor.freq, true, '');
    client.publish('/response', `id01,input,0,${(resultSensor.freq).toString()}`);
    client.publish('/response', `id02,output,${(resultLed.text).toString()},${(statusLed == true)}`);
    client.publish('/response', `id03,output,${(resultBomb.text).toString()},${(statusLed == true)}`);
})

app.post('/info', async(req, res, next) => {
    var body = getParams(req);
    var body = req.body;
    DB.createLogInfo(body);
    var id = body['id'];
    var url = body['url'];
    var date = body['date'];
    var obj = DB.getHeader();
    result = await DB.getInfo();
    obj.hardware = {};
    for (var i = 0; i < result.length; i++) {
        var eachObj = {
            tag: result[i].tag,
            type: result[i].type,
        }
        obj.hardware[result[i].id] = eachObj;
    }
    res.jsonp(obj);
});

app.post('/search', async(req, res, next) => {
    var body = getParams(req);
    var body = req.body;
    // console.log(body);
    DB.createLogSearch(body);
    var id = body['id'];
    var url = body['url'];
    var date = body['date'];
    var search = body['search'];
    var obj = DB.getHeader();
    result = await DB.searchEvents(search.id_hardware, search.start_date, search.finish_date);
    info = await DB.getInfoById(search.id_hardware)
    obj.search = {
        id_hardware: search.id_hardware,
        type: info.type,
    }
    obj.data = {};
    if (result.length > 0) {
        for (var i = 0; i < result.length; i++) {
            var eachObj = {
                sensor: result[i].sensor,
                status: result[i].status,
                text: result[i].text,
                freq: result[i].freq,
            }
            obj.data[strftime('%Y-%m-%dT%H:%M:%S%z', new Date(result[i].date))] = eachObj;
        }
    }
    console.log(obj);
    res.jsonp(obj);
});

app.post('/change', async(req, res, next) => {
    var body = getParams(req);
    var body = req.body;
    DB.createLogEvent(body);
    var id = body['id'];
    var url = body['url'];
    var date = body['date'];
    var change = body['change'];
    var idHardware = '';
    for (key in change) {
        idHardware = key;
    }
    var obj = DB.getHeader();
    if (DB.change(idHardware, change[idHardware])) obj.status = "OK";
    else obj.status = "ERROR";
    res.json(obj);
});

app.post('/devices', async(req, res, next) => {
    var body = getParams(req);
    var id = body['id'];
    var sensor = body['sensor'];
    DB.createDevice(id, sensor);
    res.json({ message: sensor });
});

app.post('/create', async(req, res, next) => {
    var body = getParams(req);
    DB.createLogEvent(body);
    body.action = 'create';
    for (key in body.create) {
        body[key] = body.create[key];
    }
    body.hardware_id = body.create.if.left.id;
    if (body.create.if.left.url === DB.ip()) body.who = `mine`;
    else body.who = `notmine`;
    delete body.create;
    var obj = DB.getHeader();
    try {
        obj.idEvent = await DB.createEvent(body);
        obj.status = "OK";
    } catch (e) {
        obj.status = "ERROR";
    }
    res.jsonp(obj);
});

app.post('/update', async(req, res, next) => {
    var body = getParams(req);
    DB.createLogEvent(body);
    var idEvent = body.update.id;
    body.action = 'update';
    for (key in body.update) {
        body[key] = body.update[key];
    }
    if (body.create.if != undefined) {
        if (body.create.if.left.url === DB.ip()) body.who = `mine`;
        else body.who = `notmine`;
    }
    delete body.update.id;
    delete body.update;
    var obj = DB.getHeader();
    if (DB.updateEvent(idEvent, body)) obj.status = "OK";
    else obj.status = "ERROR";
    res.jsonp(obj);
});

app.post('/delete', async(req, res, next) => {
    var body = getParams(req);
    DB.createLogEvent(body);
    var idEvent = body.delete.id;
    var obj = DB.getHeader();
    if (DB.deleteEvent(idEvent)) obj.status = "OK";
    else obj.status = "ERROR";
    res.jsonp(obj);
});

app.listen(port);
console.log('Aplicac ión creada en el puerto: ' + port);
handlerEvents.handlerExternalEvents();