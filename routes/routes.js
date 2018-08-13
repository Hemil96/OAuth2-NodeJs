const express = require('express');
const actions = require('../methods/actions');
const auth = require('../methods/auth');
const client = require('../methods/client');
const oauth2 = require('../methods/oauth2');

const router = express.Router();

// User
router.post('/authenticate', actions.authenticate);
router.post('/adduser', actions.addNew);
router.get('/getinfo', actions.getinfo);

// Client routes
router.post('/clients', auth.isAuthenticated, client.postClients);
router.get('/clients', auth.isAuthenticated, client.getClients);

// Oauth routes
router.get('/oauth2/authorize', oauth2.authorization);
router.post('/oauth2/authorize', oauth2.decision);

// Exchange code with token
router.post('/oauth2/token', auth.isClientAuthenticated, oauth2.token);

// Accessing/modifying the resourse
router.post('/addBook', auth.isBearerAuthenticated, actions.addBook);
router.get('/getBooks', auth.isBearerAuthenticated, actions.getBook);

module.exports = router;
