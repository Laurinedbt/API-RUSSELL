const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Reservation = new Schema({
  catwayNumber: {
    type : Number,
    required : true,
    unique : true
  },

  clientName: {
    type: String,
    trim: true,
    required: true
  },

  boatName: {
    type: String,
    trim: true,
    required: true
  },

  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value >= this.startDate;
      },
      message: 'La date de fin doit être postérieure à la date de début'
    }
  }

}, {
  timestamps: true // ajoute createdAt et updatedAt automatiquement
});

module.exports = mongoose.model('Reservation', Reservation);