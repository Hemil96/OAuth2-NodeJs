var mongoose = require('mongoose');

var { Schema } = mongoose;

var BookSchema = new Schema({
  name: String,
  quantity: Number,
  userId: String,
});

module.exports = mongoose.model('Book', BookSchema);
