// Load required packages
var Client = require('../model/client');

// /client for POST
const postClients = (req, res) => {
  // Set the client properties that came from the POST data
  const clientToCreate = {
    name: req.body.name,
    id: req.body.id,
    secret: req.body.secret,
    userId: req.body.userId,
  };

  // Create a new instance of the Client model
  var client = new Client(clientToCreate);

  // Save the client and check for errors
  client.save()
    .then((createdClient) => {
      if (!createdClient) return res.status(500).json({ error: 'Failed to create' });
      return res.json({ message: 'Client added to the locker!', data: client });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: 'Failed to create' });
    });
};

// Create endpoint /api/clients for GET
const getClients = (req, res) => {
  // Use the Client model to find all clients
  Client.find({ userId: req.query.userId })
    .then((foundClient) => {
      if (!foundClient) return res.status(404).json({ error: 'Client not found' });
      return res.json({ message: 'Client found', data: foundClient });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: 'Failed to find' });
    });
};

const clientMethods = {
  postClients,
  getClients,
};

module.exports = clientMethods;
