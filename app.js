const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catwaysRouter = require('./routes/catways');
const reservationsRouter = require('./routes/reservations');

const mongodb = require('./db/mongo');

mongodb.initClientDbConnection();

const app = express();

// Configurer le moteur de templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // dossier pour pages .ejs

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catways', catwaysRouter);
app.use('/reservations', reservationsRouter);


module.exports = app;


