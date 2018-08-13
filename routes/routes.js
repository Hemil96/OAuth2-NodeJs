const express = require('express');
const actions = require('../controller/actions');
const auth = require('../controller/auth');
const client = require('../controller/client');
const oauth2 = require('../controller/oauth2');

const router = express.Router();

// User
router.post('/authenticate', actions.authenticate); // Authenticate user
router.post('/adduser', actions.addNew); // Create New User
router.get('/getinfo', actions.getinfo); // Retrive All Users

// Client routes
router.post('/clients', auth.isAuthenticated, client.postClients); // Create New User
router.get('/clients', auth.isAuthenticated, client.getClients); // Authenticate client

// Oauth routes
router.get('/oauth2/authorize', oauth2.authorization); // Ask for permission
router.post('/oauth2/authorize', oauth2.decision); // Retrive the code from url

// Exchange code with token
router.post('/oauth2/token', auth.isClientAuthenticated, oauth2.token); // Generate token

// Accessing/modifying the resourse
router.post('/addBook', auth.isBearerAuthenticated, actions.addBook); // Add books
router.get('/getBooks', auth.isBearerAuthenticated, actions.getBook); // Get Books

module.exports = router;
