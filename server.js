var express = require('express');
var routes = require('./app/routes/index.js');
var mongo = require('mongodb').MongoClient;
require('dotenv').load();
var url = process.env.MONGO_URI
var app = express();
mongo.connect(url, function(err, db){
    
    if (err){
        console.log('error');
        console.error(err);
    }
    else{
        console.log('connected to server');
    }
    var websites = db.collection('websites');
    //create a db collection here?
    //useful for testing even if uneccessary
    var counters = db.collection('counters');

    websites.drop();
    counters.drop();
    
    websites.createIndex(
        {"url":1},
        {unique:true}
    );
    websites.createIndex(
        {"shorturl":1},
        {unique:true}
    );
    
    counters.insert({
      counter: "count",
      seq: 0
    },{w:1})

    routes(app, db);
    
});


app.listen(process.env.PORT || 8080, function(){
	console.log('Listening on port 8080');
})