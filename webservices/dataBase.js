var MongoClient = require('mongodb').MongoClient;
strftime = require("strftime");
const platformName = "greenhouseCC8";
const ip = "localhost";
var url = "mongodb://" + ip + ":27017/";
const dbName = "greenhouse";

function getTime(){
  var date = new Date();
  return strftime('%Y-%m-%dT%H:%M:%S%z', date); 
}

exports.getIp = function(){
  return ip;
}

exports.searchInfo = function(id_hardware,start_date,finish_date){
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(dbName);
      var query = { address: "Park Lane 38" };
      dbo.collection("customers")
        .aggregate(
          { id: platformName},
          { url: ip },
          { date: getdAT}
        )
        .find(query).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
      });
    });
  });
}

exports.writeLogSearch = function(id,ip,date,search,info){
  MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var obj = { id: id, ip: ip, date: date, search: search, info: info};
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
    var obj = { id: id, ip: ip, date: date, info: info};
    var dbo = db.db(dbName); 
    dbo.collection("logs/request").insertOne(obj,function(err, res) {
      if (err) throw err;
      console.log("writeLogInfo inserted");
      db.close();
    });
  });
}

exports.searchInfo = function(idHardware,startDate,finishDate){
  return new Promise((resolve, reject) => {
    // MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
    //   if (err) throw err;
    //   var dbo = db.db(dbName); 
    //   dbo.collection(idHardware).aggregate(
    //     [
    //       { 
    //         $project : { _id : 0 } 
    //       }, 
    //       { 
    //         $addFields: {
    //           id: platformName,
    //           url: ip,
    //           date: getTime(), 
    //           search: {
    //             id_hardware: id,
    //             type: "Estable",
    //           }
    //         }
    //       },
    //       { 
    //         $match: { 
    //           'date' : { '$gte' : ISODate('2013-07-26T18:23:37.000Z') }
    //           'date' : { '$lt' : ISODate('2013-07-26T18:23:37.000Z') },
    //         }
    //       },          
    //     ],
    //   ).toArray(function(err, data) {
    //     if(err)  reject(err) 
    //     else{
    //       console.log(data);
    //       resolve(data);
    //       db.close();
    //     }
    //   });
    // });
  });
}

exports.getInfo = function(id){
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db(dbName); 
      var query = { id: id };
      dbo.collection("info").aggregate(
        [
          { 
            $project : { _id : 0 } 
          }, 
          { 
            $addFields: {
              url: ip,
              date: getTime(), 
            }
          },
          { 
            $match: { id: id } 
          },          
        ],
      ).toArray(function(err, data) {
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

exports.getInfo2 = function(id){
  console.log(id);
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
      var dbo = db.db(dbName); 
      var query = { id: id };
      dbo.collection('info').find(query, { projection: { _id: 0 }}).toArray(function(err, data) {
          if(err)  reject(err) 
          else{
            resolve(data);
            db.close();
          }
      });
    });
  });
}