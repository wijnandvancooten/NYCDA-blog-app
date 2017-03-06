//required packages for the app//
const express = require('express'),
      morgan = require('morgan'), //middle ware for console.log's in the terminal (debugging)
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      pug = require ('pug'),
      sequelize = require ('sequelize'),
      session = require('express-session');

const app = express()

const db = new sequelize('blogapp', 'wvancooten', 'null', {
  host: 'localhost',
  dialect: 'postgres'
})

//connecting to the database blogapp//
// var app = express(),
// //uses dash profile to look for username and password//
//           sequelize = new Sequelize('blogapp', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, { dialect: 'postgres'});


app.use(express.static('public'));


let users = db.define('users', {
  username: sequelize.STRING,
  password: sequelize.STRING,
  firstname: sequelize.STRING,
  lastname: sequelize.STRING,
  email: sequelize.STRING
})
//tels the app to use morgan//
app.use(morgan('dev'));

//is for the input in the forms and parse it to JS//
app.use(bodyParser.urlencoded({extended: false}));

//sets the view engine to pug. pug renders the html page//
app.set('view engine', 'pug');

//use noticesRouter var//


//redirect the home route to /notices (notices.js) //
app.get('/', (request, response) => {
	response.redirect('/register');
});

//server is running on port 3000//
db.sync().then(() => {
  app.listen(3001, function() {
    console.log('Web server started on port 3001');
  });
});
