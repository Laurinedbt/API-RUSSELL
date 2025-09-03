const express = require('express');
const router = express.Router();

const service = require('../services/users');

const private = require('../middlewares/private');

// Gestion de la connexion et de la déconnexion des utilisateurs
router.post('/login', service.login)
router.get('/logout', service.logout)

// Routes /users pour créer un utilisateur et lister les utilisateurs
router.post('/', service.add);
router.get('/', private.checkJWT, service.getAll);

//La route pour lire les infos d'un utilisateur
router.get('/:email', private.checkJWT, service.getByEmail);

// La route pour modifier un utilisateur
router.put('/:email', private.checkJWT, service.update);

// La route pour supprimer un utilisateur
router.delete('/:email', private.checkJWT, service.delete);


module.exports = router;
