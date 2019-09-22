var Sensor = require("./sensor.js");
var MongoClient = require('mongodb').MongoClient;
strftime = require("strftime");
const platformName = "greenhouseCC8";
const ip = "localhost";
var url = "mongodb://" + ip + ":27017/";
const dbName = "greenhouse";


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
          '$match' : { 'date' : { '$gte' : new Date(startDate),  '$lt': new Date(finishDate)} }
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
            console.log(data);
            resolve(data);
            db.close();
          }
      });
    });
  });
}

exports.getInfo = function(){
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db(dbName); 
      dbo.collection("info").find({}, { projection: { _id: 0 }}).toArray(function(err, data) {
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