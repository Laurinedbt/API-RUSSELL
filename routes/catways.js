const express = require('express');
const router = express.Router();

const service = require('../services/catways');

const private = require('../middlewares/private');

// Routes /catways pour créer et lister un utilisateur
router.post('/', service.add);
router.get('/', service.getAll)

router.get('/:id', private.checkJWT, service.getById);

router.put('/:id', private.checkJWT, service.update);

router.delete('/:id', private.checkJWT, service.delete);


module.exports = router;
