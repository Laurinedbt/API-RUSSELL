const express = require('express');
const router = express.Router();

const service = require('../services/users');

const private = require('../middlewares/private');

// La route pour ajouter un utilisateur
router.put('/add', service.add);

// Ajout de la route /authenticate
router.post('/authenticate', service.authenticate);

// La route pour lister tous les utilisateurs
router.get('/', private.checkJWT, service.getAll);

//La route pour lire les infos d'un utilisateur
router.get('/:id', private.checkJWT, service.getById);

// La route pour modifier un utilisateur
router.patch('/:id', private.checkJWT, service.update);

// La route pour supprimer un utilisateur
router.delete('/:id', private.checkJWT, service.delete);


module.exports = router;
