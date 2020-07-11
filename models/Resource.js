// INSTRUCTIONS
/*
  Create a new resource model that uses the User
  as an associative collection (examples):
  - User -> Books
  - User -> Reservation

  Your model must contain at least three attributes
  other than the associated user and the timestamps.

  Your model must have at least one helpful virtual
  or query function. For example, you could have a
  book's details output in an easy format: book.format()
*/
const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  Title: {
    type: String,
    required: true
  },
  Subject: {
    type: String,
    required: true
  },
  Content: {
    type: String,
	required: true
  },
},{
    timestamps: true
 
});

module.exports = mongoose.model('Resource', ResourceSchema);