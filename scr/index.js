const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');

const multer = require('multer');

require('dotenv').config();

const https = require('https');

const myconnection = require('express-myconnection');
const mysql = require('mysql');


//routes
const router = require ('./rutas/coaching');


const storage = multer.diskStorage({
  destination: 'public/images',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
//settings
app.set('port', process.env.PORT || process.env.PORT);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views' ));

app.use(multer({
  storage: storage,
}).single('imagen'));

app.use(morgan('dev'));

app.use(myconnection(mysql, {
  host:process.env.DB_HOST,
  user:process.env.DB_USER,
  password:process.env.DB_PASS,
  port:process.env.DB_PORT,
  database: process.env.DB
}, 'single'));

//middlewares
app.use(express.urlencoded({extended: true}));

app.use(express.json());

app.use(session({
 secret: 'secret_coaching',
 resave: true,
 saveUninitialized: true
}));

app.use(express.static('public'));

app.use('/', router);

app.listen(app.get('port'), () => {
  console.log('Server on port ' + process.env.PORT);
});
