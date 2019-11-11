var Sensor = require("./sensor.js");
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
strftime = require("strftime");
const platformName = "greenhouseCC8";
const ip = "localhost:8080";
var url = "mongodb://" + ip + ":27017/";
const dbName = "greenhouse";
const myIp = `192.168.0.105:8080`;

exports.getHeader = function(){
  var obj = {}
  obj.id = platformName;
  obj.url = myIp;
  obj.date = getTimeInFormat();
  return obj;  
}

exports.ip = function(){
  return myIp;
}

exports.platformName = function(){
  return platformName;
}

function getTimeInFormat(){
  var date = new Date();
  return strftime('%Y-%m-%dT%H:%M:%S%z', date); 
}

function getTime(){
  var date = new Date();
  return date;
}

exports.getIp = function(){
  return new Promise((resolve, reject) => {
    resolve(ip);
  });  
}

exports.createLogSearch = function(obj){
  MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName); 
    dbo.collection("logs/search").insertOne(obj,function(err, res) {
      if (err) throw err;
      console.log(type + " request");
      db.close();
    });
  });
}

exports.createLogSearch = function(obj){
  MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName); 
    dbo.collection("logs/search").insertOne(obj,function(err, res) {
      if (err) throw err;
      console.log(type + " request");
      db.close();
    });
  });
}

exports.createLogSearch = function(body){
  MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName); 
    var obj = { data: body, date: new Date(getTime())};
    dbo.collection("logs/search").insertOne(obj,function(err, res) {
      if (err) throw err;
      console.log("search request");
      db.close();
    });
  });
}

exports.createLogEvent = function(body){
  MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var obj = { data: body, date: new Date(getTime())};
    var dbo = db.db(dbName); 
    dbo.collection("logs/events").insertOne(obj,function(err, res) {
      if (err) throw err;
      console.log("event created");
      db.close();
    });
  });
}

exports.createLogInfo = function(body){
  MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var obj = { data: body, date: new Date(getTime())};
    var dbo = db.db(dbName); 
    dbo.collection("logs/info").insertOne(obj,function(err, res) {
      if (err) throw err;
      console.log("info request");
      db.close();
    });
  });
}

exports.createDevice = function(id, sensor, freq, status, text){
  MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var obj = {hardware_id: id, sensor: sensor, status: status, freq: freq, text: text, date: new Date(getTime())};
    var dbo = db.db(dbName); 
    dbo.collection(id).insertOne(obj,function(err, res) {
      if (err) throw err;
      console.log(`deviceInfo ${id} inserted`);
      db.close();
    });
  });
}

exports.change = function(idHardware, fields){
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var query = { id: idHardware };
      var dbo = db.db(dbName); 
      dbo.collection("info").updateOne(query, { $set: fields }, function(err, res) {
        if (err) reject(false);
        else{
          console.log("info update " + idHardware);
          db.close();
          resolve(true);
        }
      });
    });
  });
}  

exports.createEvent = function(obj){
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db(dbName); 
      dbo.collection("events").insertOne(obj,function(err, res) {
        if (err) reject(err);
        else{
          console.log("event inserted " + res.insertedId);
          db.close();
          resolve(res.insertedId);
        }
      });
    });
  });
}

exports.updateEvent= function(idEvent, fields){
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
      var query = { _id: ObjectID(idEvent) };
      var dbo = db.db(dbName); 
      dbo.collection("events").updateOne(query, { $set: fields }, function(err, res) {
        if (err) reject(false);
        else{
          console.log("event updated " + idEvent);
          db.close();
          resolve(true);
        }
      });
    });
  });
}

exports.deleteEvent = function(idEvent){
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
      var query = { _id: ObjectID(idEvent) };
      var dbo = db.db(dbName); 
      dbo.collection("events").deleteOne(query, function(err, res) {
        if (err) reject(false);
        else{
          console.log("event deleted " + idEvent);
          db.close();
          resolve(true);
        }
      });
    });
  });
}

exports.searchEvents = function(idHardware,startDate,finishDate){
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db(dbName);
      dbo.collection(idHardware).aggregate([     
        { $lookup:
          {
            from: 'info',
            localField: 'hardware_id',
            foreignField: 'id',
            as: 'hardware'            
          }
        },
        {
          $unwind:'$hardware'
        }, 
        {
          '$match' : { 'date' : { '$gte' : new Date(startDate),  '$lte': new Date(finishDate)} }
        },              
        {
          $project: { 
            type:'$hardware.type',
            sensor: 1,
            status: 1,
            text: 1,
            freq: 1,
            date: 1,
            _id: 0,
            myDate: 1,
            url: 1,
          },
        }
      ]).toArray(function(err, data) {
          if(err)  reject(err) 
          else{
            // console.log(data);
            db.close();
            resolve(data);
          }
      });
    });
  });
}

exports.getInfoById = function(id){
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db(dbName); 
      var query = { id: id }
      dbo.collection("info").findOne(query, { projection: { _id: 0 }}, function(err, data) {
        if(err)  reject(err) 
        else{
          // console.log(data);
          db.close();
          resolve(data);
        }
      });
    });
  });
}

exports.getInfo = function(id){
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db(dbName); 
      dbo.collection("info").find({}, { projection: { _id: 0, sensor: 0, satatus: 0, freq: 0, text: 0 }}).toArray(function(err, data) {
        if(err)  reject(err) 
        else{
          // console.log(data);
          db.close();
          resolve(data);
        }
      });
    });
  });
}

exports.getEvents = function(){
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db(dbName); 
      dbo.collection("events").find({}, { projection: { _id: 0 }}).toArray(function(err, data) {
        if(err)  reject(err) 
        else{
          db.close();
          resolve(data);
        }
      });
    });
  });
}

exports.getEventsById = function(hardware_id, who){
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db(dbName); 
      var query = {hardware_id: hardware_id, who: who}
      dbo.collection("events").find(query, { projection: { _id: 1 }}).toArray(function(err, data) {
        if(err)  reject(err) 
        else{
          db.close();
          resolve(data);
        }
      });
    });
  });
}

exports.getEventByCondition = function(condition){
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db(dbName); 
      var query = condition
      console.log(query);
      dbo.collection("events").findOne(query, function(err, data) {
        if(err)  reject(err) 
        else{
          db.close();
          resolve(data);
        }
      });
    });
  });
}

exports.getEventsByCondition = function(condition){
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db(dbName); 
      var query = condition
      console.log(query);
      dbo.collection("events").find(query).toArray(function(err, data) {
        if(err)  reject(err) 
        else{
          db.close();
          resolve(data);
        }
      });
    });
  });
}