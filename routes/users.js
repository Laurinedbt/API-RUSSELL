const express = require('express');
const router = express.Router();

const service = require('../services/users');

const private = require('../middlewares/private');
const roles = require('../middlewares/roles');

// Gestion de la connexion et de la déconnexion des utilisateurs
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Connexion utilisateur
 *     responses:
 *       200:
 *         description: Connexion réussie
 */

router.post('/login', service.login)

/**
 * @swagger
 * /users/logout:
 *   get:
 *     summary: Déconnexion utilisateur
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */

router.get('/logout', service.logout)

// Routes /users pour créer un utilisateur et lister les utilisateurs

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *   get:
 *     summary: Lister tous les utilisateurs
 *     security:
 *       - bearerAuth: []
 */

router.post('/', service.add);
router.get('/', private.checkJWT, service.getAll);

/**
 * @swagger
 * /users/{email}:
 *   get:
 *     summary: Récupérer un utilisateur par email
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *   put:
 *     summary: Modifier un utilisateur par email
 *   delete:
 *     summary: Supprimer un utilisateur par email
 */

//La route pour lire les infos d'un utilisateur
router.get('/:email', private.checkJWT, service.getByEmail);

// La route pour modifier un utilisateur
router.put('/:email', private.checkJWT, service.update);

// La route pour supprimer un utilisateur
router.delete('/:email', private.checkJWT, service.delete);


module.exports = router;
