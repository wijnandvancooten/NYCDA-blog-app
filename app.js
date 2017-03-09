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

// tels the app to use sessions. The session will be max 1 hour
app.use(session({
    secret: 'salad gelore',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60
    }
}))

//create a table in de database Users
let users = db.define('users', {
    username: sequelize.STRING,
    password: sequelize.STRING,
    firstname: sequelize.STRING,
    lastname: sequelize.STRING,
    email: sequelize.STRING
})

//create a table in de database posts. Posts belong to users
let posts = db.define('posts', {
    title: sequelize.STRING,
    body: sequelize.TEXT
})

//create a table in de database comments. Comments belong to posts and users
let comments = db.define('comments', {
    body: sequelize.STRING
})

//setting the relationship of the tables
posts.belongsTo(users)
posts.hasMany(comments)

comments.belongsTo(users)
comments.belongsTo(posts)

users.hasMany(posts)
users.hasMany(comments)


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
    posts.findAll().then((posts) => {
        //console.log(posts)
        //render the allposts.pug file, in the views folder
        //posts object is passed as a parameter (key and value)
        res.render('allposts', {
            posts: posts
        })
    })
})

//gets the unique id to show one post
app.get('/onepost/:id', (req, res) => {
  //find the full row of data in 'posts' table from the id
  posts.findById(req.params.id).then(post => {
    //renders the onepost.pug file
    console.log(post)
    res.render('onepost', { post: post })
  })
})

//renders the register pug file on url /register//
app.get('/register', (req, res) => {
    res.render('register')
})

//renders the register pug file on url /register//
app.get('/createpost', (req, res) => {
    res.render('createpost')
})

//renders the dasgboard pug file on url /dashboard//
app.get('/dashboard', (req, res) => {
    if (req.session.visited == true) {
        posts.findAll({
            where: {
                userId: req.session.user.id
            }
        })
        .then(posts => {
        //renders the onepost.pug file
        console.log(posts)
        res.render('dashboard', {
          posts: posts,
          results: req.session.user
        })
      })
        console.log("good job by " + req.session.user.username)
    } else {
        res.redirect('/')
        console.log("log in fucker!")
    }
})

//login post for users. checks data in database and compares it to the input form the body
app.post('/', (req, res) => {
    //console.log(req.body)
    //console.log('username: ' + username + ' password: ' + password)
    users.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (user.password == req.body.password) {
            //console.log ('loged in: ' + req.body.username)
            console.log('session before', req.session)
            //sets the session visited to true after login
            req.session.visited = true
            //stores the users data in the session after login. Data can be uses in dashboard
            req.session.user = user
            res.redirect('/dashboard')
            console.log('session after', req.session)
        } else {
            res.render('wronglogin')
        }
    })
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

//function to make posts
app.post('/createpost', (req, res) => {
    if (req.session.visited == true) {

        let newPost = {
            title: req.body.title,
            body: req.body.body,
            userId: req.session.user.id
        }
        posts.create(newPost)
        res.redirect('/')
        console.log("your post: " + newPost)
    } else {
        res.redirect('/')
        console.log("log in fucker!")
    }
})

//server is running on port 3000//
db.sync().then(() => {
    console.log('Database synced')
}).catch(console.log.bind(console))
app.listen(3001, function() {
    console.log('Web server started on port 3001')
})
