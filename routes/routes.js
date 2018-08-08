const express = require('express');
const actions = require('../methods/actions');
const auth = require('../methods/auth');
const client = require('../methods/client');

const router = express.Router();

router.post('/authenticate', actions.authenticate);
router.post('/adduser', actions.addNew);
router.get('/getinfo', actions.getinfo);

// Client routes
router.post('/client', auth.isAuthenticated, client.postClients);
router.post('/client', auth.isAuthenticated, client.postClients);


module.exports = router;
