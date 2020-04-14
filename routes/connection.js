var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'brokerfree'
});

connection.connect(function(err){
    if(err) throw err;
    console.log('connected!');
});

module.exports = connection;
