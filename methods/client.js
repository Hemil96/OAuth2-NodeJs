// Load required packages
var Client = require('../model/client');

// Create endpoint /api/client for POST
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
  console.log(client);

  // Save the client and check for errors
  client.save((err) => {
    if (err) { res.send(err); }
    return res.json({ message: 'Client added to the locker!', data: client });
  });
};

// Create endpoint /api/clients for GET
const getClients = (req, res) => {
  // Use the Client model to find all clients
  Client.find({ userId: req.body.userId }, (err, clients) => {
    if (err) { res.send(err); }
    return res.json(clients);
  });
};

const clientMethods = {
  postClients,
  getClients,
};

module.exports = clientMethods;
