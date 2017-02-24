//required packages for the app//
const express = require('express'),
      morgan = require('morgan'), //middle ware for console.log's in the terminal (debugging)
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      pug = require ('pug'),
      Sequelize = require ('sequelize');

//connecting to the database bulletinboard//
var app = express(),
//uses dash profile to look for username and password//
          sequelize = new Sequelize('bulletinboard', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, { dialect: 'postgres'});

//requires a file in this directory//
var noticesRouter = require('./routes/notices');

app.use(express.static('public'));

//creating a table in de bulletingboard database//
var notice = sequelize.define('notice', {
  title: Sequelize.STRING,
  body: Sequelize.TEXT
});

//tels the app to use morgan//
app.use(morgan('dev'));

//is for the input in the forms and parse it to JS//
app.use(bodyParser.urlencoded({extended: false}));

//sets the view engine to pug. pug renders the html page//
app.set('view engine', 'pug');

//use noticesRouter var//
app.use ('/notices', noticesRouter);

//redirect the home route to /notices (notices.js) //
app.get('/', (request, response) => {
	response.render('/notices');
});

//get request to/board route//
app.get('/board',(request, response) {
  //promise to findAll - native method in squeluze, findAll
  //everyting in notices table
  //'notices' is passed as a parameter
  notice.findAll().then((notices) =>{
    //render the board.pug file, in the notices folder
    // notices object is passed as a parameter (key and value)
    response.render('notices/board', {notices: notices});
  });
});

//inserts a new entry into the notices table.
app.post('/notices', (request, response) => {
  //request.body prints everyting you put into the body//
  notice.create(request.body).then(() => {
  response.redirect('/board');
});



//probebly for deleting a message in the bulletin-board//
app.use(methodOverride((req, res) =>{
  if(req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._mthod;
    return method;
  }})
);


//server is running on port 3000//
sequelize.sync().then(() => {
  app.listen(3001, function() {
    console.log('Web server started on port 3000');
  });
});
