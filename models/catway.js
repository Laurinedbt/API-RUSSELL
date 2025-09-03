const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Catway = new Schema({
  catwayNumber: {
    type : Number,
    required : true,
    unique : true
  },

  catwayType: {
    type: String,
    enum: ['long', 'short'],
    required: true
  },

  catwayState: {
    type: String,
    default: 'bon état'
  }

}, {
  timestamps: true // ajoute createdAt et updatedAt automatiquement
});

module.exports = mongoose.model('Catway', Catway);
