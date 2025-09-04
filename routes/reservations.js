const express = require('express');
const router = express.Router();

const service = require('../services/reservations');

const private = require('../middlewares/private');

// Récupérer toutes les réservations d'un catway et créer une réservation

/**
 * @swagger
 * /catways/{id}/reservations:
 *   get:
 *     summary: Récupérer toutes les réservations d'un catway
 *   post:
 *     summary: Créer une réservation pour un catway
 */

router.get('/:id/reservations', private.checkJWT, service.getReservations);
router.post('/:id/reservations', private.checkJWT, service.addReservation);

// Récupérer une réservation spécifique

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   get:
 *     summary: Récupérer une réservation spécifique
 *   put:
 *     summary: Modifier une réservation
 *   delete:
 *     summary: Supprimer une réservation
 */

router.get('/:id/reservations/:idReservation', private.checkJWT, service.getReservationById);

// Modifier une réservation

router.put('/:id/reservations/:idReservation', private.checkJWT, service.updateReservation);

// Supprimer une réservation

router.delete('/:id/reservations/:idReservation', private.checkJWT, service.deleteReservation);

module.exports = router;