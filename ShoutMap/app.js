
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';

import {dbConnection, closeConnection} from './config/mongoConnection.js';


import configRoutes from './routes/index.js';

import apiRoutes from './routes/api.js';

import bodyParser from 'body-parser';


import { populateDatabase } from './seed.js';



//establish directory

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//express

const app = express();

const staticDir = express.static(path.join(__dirname, 'public'));

app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRoutes);

app.use(
  session({
    name: 'AuthCookie',
    secret: "some secret string!",
    saveUninitialized: false,
    resave: false,
  })
);

let jsonParser = bodyParser.json({limit:'200mb', type:'application/json'}); 
app.use(jsonParser);


//Handlebars engine
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


/* Middleware: Redirects logged in users accessing the root to the map, and non logged-in to welcome */
app.all('*', checkUser);
function checkUser(req, res, next) {
    if ( req.path !== '/') return next();
    if (!req.session.user) {
        return res.render('welcome');
    }
    return res.redirect('/map');

}


/* Middleware: Prevents users from seeing login page if logged in */
app.use('/login', (req, res, next) => {
    //console.log(req.session.id);
    if (!req.session.user){
        return next();
    }
    //TODO: FIX THIS
    return res.redirect('/map');
});

/* Middleware: Prevents users from seeing register page if logged in */
app.use('/register', (req, res, next) => {
    //console.log(req.session.id);
    if (!req.session.user){
        return next();
    }
    return res.redirect('/map');
});

/* Middleware: Prevents users from seeing map if logged out */
app.use('/map', (req, res, next) => {
    //console.log(req.session.id);
    if (!req.session.user){
        res.redirect('/login');
    }
    return next();
});




//Database

const db = await dbConnection();
await db.dropDatabase();

//populate database
await populateDatabase();

//setup routes

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});