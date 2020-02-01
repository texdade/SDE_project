/*  GameArena KeyComparator App
*/

const express = require('express');
const bodyParser = require('body-parser');
//const {auth, protect} = require('./auth/all_auth');
const gProtect = require('./auth/google_auth').protect;
const sProtect = require('./auth/steam_auth').protect;

const gAuth = require('./auth/google_auth').auth;
const sAuth = require('./auth/steam_auth').auth;
const app = express();

//auth(app);
gAuth(app);
sAuth(app);

//middlewares
app.use(express.static('views'));// folder in which to put the static files (html, css, js client)
app.use(bodyParser.json({limit: '50mb'})); // read json

//middlewares (just for the widget)
app.use(bodyParser.urlencoded({ extended: true , limit: '50mb'})); // read form enctype data
app.set('view engine', 'ejs'); // set the engine render ejs for dynamic building of html pages with ejs tags

//set up routers for v1 app
const genericRouter = require('./routes/generic_router'); //testing if the application is working
const secureRouter = require('./routes/secure_router'); //testing if normal auth is working
const websiteRouter = require('./routes/website_router'); //testing website engine ejs

//set up routers for latest version app
app.use('/', genericRouter);

app.use('/steam/', sProtect(), secureRouter);//protected end-points (requiring steam auth)
app.use('/google/', gProtect(), secureRouter);//protected end-points (requiring google auth)

//set up routers for latest version app
app.use('/', websiteRouter);

module.exports = app;