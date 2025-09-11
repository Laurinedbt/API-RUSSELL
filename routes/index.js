const express = require('express');
const router = express.Router();

const userRoute = require('../routes/users');

// Page de connexion/accueil
router.get('/', async (req, res) => {
  res.render('index', {
    title: 'Accueil',
  });
});


router.use('/users', userRoute);

module.exports = router;

