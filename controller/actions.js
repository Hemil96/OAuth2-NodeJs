const jwt = require('jwt-simple');
const User = require('../model/user');
const Book = require('../model/book');
const config = require('../config/database');
const utils = require('../helper/utils');

// POST /authenticate
const authenticate = (req, res) => {
  User.findOne({ name: req.body.name })
    .then((user) => {
      this.user = user;
      if (!user) return res.status(403).send({ success: false, msg: 'Authentication failed, User not found' });
      return utils.comparePassword(req.body.password, user.password);
    })
    .then((isMatch) => {
      if (!isMatch) return res.status(403).send({ success: false, msg: 'Authenticaton failed, wrong password.' });
      const token = jwt.encode(this.user, config.secret);
      return res.json({ success: true, token: token });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ success: false, error: err });
    });
};


// POST /adduser
const addNew = (req, res) => {
  if ((!req.body.name) || (!req.body.password)) {
    return res.status(400).json({ success: false, msg: 'Enter all values' });
  }
  const userToCreate = {
    name: req.body.name,
    password: req.body.password,
  };
  const newUser = new User(userToCreate);

  newUser.save()
    .then((createdUser) => {
      if (!createdUser) return res.status(500).json({ success: false, msg: 'Failed to save' });
      return res.status(201).json({ success: true, msg: 'Successfully saved' });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false, msg: 'Failed to save' });
    });
};


// GET /getinfo
const getinfo = (req, res) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const token = req.headers.authorization.split(' ')[1];
    const decodedtoken = jwt.decode(token, config.secret);
    return res.status(200).json({ success: true, msg: `hello ${decodedtoken.name}` });
  }
  return res.status(400).json({ success: false, msg: 'No header' });
};


// POST /addBook
const addBook = (req, res) => {
  const bookToCreate = {
    name: req.body.name,
    quantity: req.body.quantity,
    userId: req.user_id,
  };
  const newBook = new Book(bookToCreate);
  newBook.save()
    .then((createdBook) => {
      if (!createdBook) return res.json({ success: false, msg: 'Failed to save' });
      return res.status(200).json({ success: true, msg: 'Successfully saved' });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ success: false, msg: 'Failed to save' });
    });
};

// GET /getBooks
const getBook = (req, res) => {
  Book.find({ userId: req.user_id })
    .then((foundBook) => {
      if (!foundBook) return res.status(404).json({ error: 'Book not found' });
      return res.json({ message: 'Book found', data: foundBook });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err });
    });
};

const functions = {
  authenticate,
  addNew,
  getinfo,
  addBook,
  getBook,
};

module.exports = functions;
