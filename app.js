import createError from 'http-errors';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
// import flash from 'connect-flash';
import passport from 'passport';
import { initializingPassport } from './passportConfig.js';

import {indexRouter} from './routes/index.route.js';

export const app = express();
export const port = process.env.PORT || 3000;

// view engine setup
app.set('view engine', 'ejs');
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  // cookie: {secure:false}
}));

app.use(passport.initialize());
app.use(passport.session());
initializingPassport(passport);

// app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});