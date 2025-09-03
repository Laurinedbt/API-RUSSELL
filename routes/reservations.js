const express = require('express');
const router = express.Router();

const service = require('../services/reservations');

const private = require('../middlewares/private');

// Récupérer toutes les réservations d'un catway

router.get('/:id/reservations', private.checkJWT, service.getReservations);

// Récupérer une réservation spécifique

router.get('/:id/reservations/:idReservation', private.checkJWT, service.getReservationById);

// Créer une nouvelle réservation

router.post('/:id/reservations', private.checkJWT, service.addReservation);

// Modifier une réservation

router.put('/:id/reservations/:idReservation', private.checkJWT, service.updateReservation);

// Supprimer une réservation

router.delete('/:id/reservations/:idReservation', private.checkJWT, service.deleteReservation);

module.exports = router;