//required packages for the app//
const express = require('express'),
      morgan = require('morgan'), //middle ware for console.log's in the terminal (debugging)
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      pug = require ('pug'),
      Sequelize = require ('sequelize'),
      session = require('express-session');

//connecting to the database bulletinboard//
var app = express(),
//uses dash profile to look for username and password//
          sequelize = new Sequelize('blogapp', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, { dialect: 'postgres'});
