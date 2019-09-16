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

exports.getInfo = function(id){
  console.log(id);
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, db) {
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