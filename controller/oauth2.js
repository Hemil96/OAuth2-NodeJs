// Load required packages
var oauth2orize = require('oauth2orize');
var jwt = require('jwt-simple');
var Client = require('../model/client');
var Token = require('../model/token');
var Code = require('../model/code');
var config = require('../config/database');

var server = oauth2orize.createServer();


const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const uid = (len) => {
  var buf = [];
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charlen = chars.length;

  for (let i = 0; i < len; i++) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }
  return buf.join('');
};

// Register serialialization function
server.serializeClient((client, callback) => {
  return callback(null, client._id);
});

// Register deserialization function
server.deserializeClient((id, callback) => {
  Client.findOne({ _id: id }, (err, client) => {
    if (err) { return callback(err); }
    return callback(null, client);
  });
});

// Register authorization code grant type
server.grant(oauth2orize.grant.code((client, redirectUri, user, ares, callback) => {
  // Create a new authorization code
  var code = new Code({
    value: uid(16),
    clientId: client._id,
    redirectUri: redirectUri,
    userId: client.userId,
  });

  // Save the auth code and check for errors
  code.save((err) => {
    if (err) { return callback(err); }

    callback(null, code.value);
  });
}));

server.exchange(oauth2orize.exchange.code((client, code, redirectUri, callback) => {
  Code.findOne({ value: code }, (err, authCode) => {
    if (err) { return callback(err); }
    if (authCode === undefined) { return callback(null, false); }
    if (client._id.toString() !== authCode.clientId) { return callback(null, false); }
    if (redirectUri !== authCode.redirectUri) { return callback(null, false); }

    // Delete auth code now that it has been used
    authCode.remove((err) => {
      if (err) { return callback(err); }

      // Create a new access token
      const token = new Token({
        value: uid(256),
        clientId: authCode.clientId,
        userId: authCode.userId,
      });

      // Save the access token and check for errors
      token.save((err) => {
        if (err) { return callback(err); }
        const enctoken = jwt.encode(token, config.secret);
        callback(null, enctoken);
      });
    });
  });
}));

// User authorization endpoint
exports.authorization = [
  server.authorization((clientId, redirectUri, callback) => {
    Client.findOne({ id: clientId }, (err, client) => {
      if (err) { return callback(err); }

      return callback(null, client, redirectUri);
    });
  }),
  (req, res) => {
    console.log(config.userid);
    res.render('dialog', { transactionID: req.oauth2.transactionID, user: config.userid, client: req.oauth2.client });
  },
];

exports.decision = [
  server.decision(),
];

// Application client token exchange endpoint
exports.token = [
  server.token(),
  server.errorHandler(),
];
