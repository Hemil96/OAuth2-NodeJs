const JwtStrategy = require('passport-jwt').Strategy;
// const passport = require('passport').initialize();
const passport = require('passport');
const { ExtractJwt } = require('passport-jwt');
const JwtBearerStrategy = require('passport-http-jwt-bearer');
const { BasicStrategy } = require('passport-http');
const config = require('../config/database');
const User = require('../model/user');
const Token = require('../model/token');
const Client = require('../model/client');

const opts = {};
opts.secretOrKey = config.secret;
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
  User.find({ id: jwt_payload.id }, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  });
}));

passport.use('basic-strategy', new BasicStrategy(
  (username, password, callback) => {
    Client.findOne({ id: username }, (err, client) => {
      if (err) { return callback(err); }

      // No client found with that id or bad password
      if (!client || client.secret !== password) { return callback(null, false); }
      // Success
      return callback(null, client);
    });
  },
));

passport.use(new JwtBearerStrategy(
  config.secret,
  (token, done) => {
    Token.findById(token._id, (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, token);
    });
  },
));


// Middlewares
exports.isBearerAuthenticated = passport.authenticate('jwt-bearer', { session: false });

exports.isAuthenticated = passport.authenticate(['jwt'], { session: false });

exports.isClientAuthenticated = passport.authenticate('basic-strategy', { session: false });
