//required packages for the app//
const express = require('express'),
    morgan = require('morgan'), //middle ware for console.log's in the terminal (debugging)
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    pug = require('pug'),
    sequelize = require('sequelize'),
    session = require('express-session')

const app = express()
//database parameters
const db = new sequelize('blogapp', 'wvancooten', 'null', {
    host: 'localhost',
    dialect: 'postgres'
})

// set the public folder
app.use(express.static('public'))

//create a table in de database Users
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
app.use(bodyParser.urlencoded({
    extended: false
}))

//sets the view engine to pug. pug renders the html page//
app.set('view engine', 'pug')

//renders the pugfile allposts.pug on the root directory
app.get('/', (req, res) => {
    res.render('allposts')
})

//renders the register pug file on url /register//
app.get('/register', (req, res) => {
    res.render('register')
})

//renders the dasgboard pug file on url /dashboard//
app.get('/dashboard', (req, res) => {
    res.render('dashboard')
})

//login post for users. checks data in database and compares it to the input form the body
app.post ('/', (req, res) => {
  console.log(req.body)
})

//sending userdata to database blogapp table users
app.post('/register', (req, res) => {
    //console.log(req.body)
    //makes a varible newUser with the user data form the inputfields in HTML
    let newUser = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    }
    //console.log(newUser)
    //creats a new user in the table users.
    users.create(newUser)
    res.redirect('/')
})



//server is running on port 3000//
db.sync().then(() => {
    app.listen(3001, function() {
        console.log('Web server started on port 3001')
    })
})
