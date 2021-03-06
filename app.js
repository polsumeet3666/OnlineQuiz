import mongoose from 'mongoose';
import adminRouter from './routes/admin';
import config from './src/config.json';


const createError = require('http-errors');
const express = require('express');
const formidable = require('express-formidable');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const indexRouter = require('./routes/index').default;
const usersRouter = require('./routes/users').default;

const app = express();
// session for non prod
app.use(session(
  {
    secret: 'keyboardcat',
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true,
  },
));
const dbUrl = `${config.url}${config.dbname}?poolSize=${config.poolSize}`;
const mongoClient = mongoose.createConnection(dbUrl, { useNewUrlParser: true ,socketTimeoutMS:45000}, (err) => {
  if (err) {
    console.log('error :: mongodb not running');
    console.error(err);
    process.exit(0);
  }
  console.log('info :: Server up and running on port 3000');
  console.log('info :: mongodb up and running on port 27017');
});

// init mongodb model
global.mongoClient = mongoClient;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use(formidable({ encoding: 'utf-8' }));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
