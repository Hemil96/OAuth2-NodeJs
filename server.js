const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser');
const config = require('./config/database');
const routes = require('./routes/routes');


mongoose.connect(config.database);

mongoose.connection.on('open', () => {
  console.log('Mongo is connected');
  const app = express();
  app.use(morgan('dev'));
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(routes);
  app.use(passport.initialize());

  app.listen(3333, () => {
    console.log('server is running');
  });
});
