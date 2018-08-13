
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const ejs = require('ejs');
const auth = require('./methods/auth.js');
const routes = require('./routes/routes');
const config = require('./config/database');


mongoose.connect(config.database);

mongoose.connection.on('open', () => {
  console.log('Mongo is connected');
  const app = express();
  app.use(morgan('dev'));
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(session({
    secret: 'Super Secret Session Key',
    saveUninitialized: true,
    resave: true,
  }));
  app.set('view engine', 'ejs');
  app.use(routes);
  app.use(passport.initialize());


  app.listen(3333, () => {
    console.log('server is running');
  });
});
