var Sensor = require("./sensor.js");
var MongoClient = require('mongodb').MongoClient;
strftime = require("strftime");
const platformName = "greenhouseCC8";
const ip = "localhost";
var url = "mongodb://" + ip + ":27017/";
const dbName = "greenhousefront";

exports.ip = function(){
  return ip;
}

exports.platformName = function(){
  return platformName;
}

exports.getTimeInFormat = function(){
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

exports.writeLogSearchOrChange = function(id,ip,date,search,info){
  MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var obj = { id: id, ip: ip, requestDate: date, date: getTime(), search: search, info: info};
    var dbo = db.db(dbName); 
    dbo.collection("logs/request").insertOne(obj,function(err, res) {
      if (err) throw err;
      console.log("writeLogSearchOrChange inserted");
      db.close();
    });
  });
}

exports.writeLogInfo = function(id,ip,date,info){
  MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var obj = { id: id, ip: ip, requestDate: date, date: new Date(getTime()), info: info};
    var dbo = db.db(dbName); 
    dbo.collection("logs/request").insertOne(obj,function(err, res) {
      if (err) throw err;
      console.log("writeLogInfo inserted");
      db.close();
    });
  });
}

exports.writeDevice = function(id,sensor){
  MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var obj = {hardware_id: id, sensor: sensor, status: false, text: Sensor.getText(sensor), freq: "3000",  date: new Date(getTime())};
    var dbo = db.db(dbName); 
    dbo.collection(id).insertOne(obj,function(err, res) {
      if (err) throw err;
      console.log("deviceInfo inserted");
      db.close();
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

exports.newPlatform = function(obj){
  MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName); 
    dbo.collection('platforms').insertOne(obj,function(err, res) {
      if (err) throw err;
      console.log("platform inserted");
      db.close();
    });
  });
}

exports.listPlatform = function(){
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db(dbName); 
      dbo.collection("platforms").find({}, { projection: { _id: 0 }}).toArray(function(err, data) {
        if(err)  reject(err) 
        else{
          console.log(data);
          resolve(data);
          db.close();
        }
      });
    });
  });
}