const express = require('express');
const router = express.Router();

const service = require('../services/catways');

const private = require('../middlewares/private');

/**
 * @swagger
 * /catways:
 *   post:
 *     summary: Créer un catway
 *   get:
 *     summary: Lister tous les catways
 */

router.post('/', service.add);
router.get('/', service.getAll)

/**
 * @swagger
 * /catways/{id}:
 *   get:
 *     summary: Récupérer un catway par ID
 *   put:
 *     summary: Modifier un catway
 *   delete:
 *     summary: Supprimer un catway
 */

router.get('/:id', private.checkJWT, service.getById);

router.put('/:id', private.checkJWT, service.update);

router.delete('/:id', private.checkJWT, service.delete);


module.exports = router;
