const bcrypt = require('bcrypt');
const User = require('../model/user');

const comparePassword = (textPassword, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(textPassword, hash)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

const utils = {
  comparePassword,
};
module.exports = utils;
