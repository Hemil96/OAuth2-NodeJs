const jwt = require('jwt-simple');
const User = require('../model/user');
const Book = require('../model/book');
const config = require('../config/database');

const authenticate = (req, res) => {
  User.findOne({
    name: req.body.name,
  }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.status(403).send({ success: false, msg: 'Authentication failed, User not found' });
    } else {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          const token = jwt.encode(user, config.secret);
          res.json({ success: true, token: token });
        } else {
          return res.status(403).send({ success: false, msg: 'Authenticaton failed, wrong password.' });
        }
      });
    }
  });
};

const addNew = (req, res) => {
  if ((!req.body.name) || (!req.body.password)) {
    console.log(req.body.name);
    console.log(req.body.password);

    res.json({ success: false, msg: 'Enter all values' });
  } else {
    const userToCreate = {
      name: req.body.name,
      password: req.body.password,
    };
    const newUser = new User(userToCreate);

    newUser.save((err, newUser) => {
      if (err) {
        res.json({ success: false, msg: 'Failed to save' });
      } else {
        res.json({ success: true, msg: 'Successfully saved' });
      }
    });
  }
};

const getinfo = (req, res) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const token = req.headers.authorization.split(' ')[1];
    const decodedtoken = jwt.decode(token, config.secret);
    return res.json({ success: true, msg: `hello ${decodedtoken.name}` });
  }

  return res.json({ success: false, msg: 'No header' });
};

const addBook = (req, res) => {
  const bookToCreate = {
    name: req.body.name,
    quantity: req.body.quantity,
    userId: req.user_id,
  };
  const newBook = new Book(bookToCreate);
  newBook.save(((err, bookCreated) => {
    if (err) console.log(err);
    else return res.json({ message: 'New Book Added to the locker:', data: bookCreated });
  }));
};

const getBook = (req, res) => {
  Book.find({ userId: req.user_id })
    .then((foundBook) => {
      if (!foundBook) return res.json({ error: 'Book not found' });
      return res.json({ message: 'Book found', data: foundBook });
    })
    .catch((err) => {
      console.log(err);
      return res.json({ error: err });
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
