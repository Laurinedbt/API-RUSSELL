const Reservation = require('../models/reservation'); // modèle mongoose
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;


// On exporte le callback afin d'y accéder dans notre gestionnaire de routes


// Récupérer toutes les réservations
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des réservations", error: err });
  }
};

exports.getReservationById = async (req, res, next) => {
    const idReservation = req.params.idReservation

    try {
        let reservation = await Reservation.findById(idReservation);

        if (reservation) {
            return res.status(200).json(reservation);
        }

        return res.status(404).json('reservation_not_found');
    } catch (error) {
        return res.status(501).json(error);
    }
}

// Callback qui servira à ajouter une réservation
exports.addReservation = async (req, res, next) => {

    const temp = ({
        catwayNumber : req.body.catwayNumber,
        clientName : req.body.clientName,
        boatName : req.body.boatName,
        startDate : req.body.startDate,
        endDate : req.body.endDate
    });

    try {
        let reservation = await Reservation.create(temp);

        return res.status(201).json(reservation);
    } catch (error) {
        return res.status(501).json(error);
    }
}

// Callback qui servira à modifier une réservation

exports.updateReservation = async (req, res, next) => {
    const idReservation = req.params.idReservation
    const temp = ({
        catwayNumber : req.body.catwayNumber,
        clientName : req.body.clientName,
        boatName : req.body.boatName,
        startDate : req.body.startDate,
        endDate : req.body.endDate
    });

    try  {

        let reservation = await Reservation.findById({idReservation});

    if (reservation) {
        Object.keys(temp).forEach((key) => {
            if (!!temp[key]) {
                reservation [key] = temp[key];
            }
        });

        await reservation.save();
        return res.status(201).json(reservation);
    }

        return res.status(404).json('reservation_not_found');
    } catch (error) {
        return res.status(501).json(error);
    }
}

// Callback qui servira à supprimer une réservation

exports.deleteReservation = async (req, res, next) => {
    const idReservation = req.params.idReservation
    try {
        await Reservation.deleteOne({_id : idReservation});

        return res.status(204).json('delete_ok');
    } catch (error) {
        return res.status(501).json(error);
    }
}