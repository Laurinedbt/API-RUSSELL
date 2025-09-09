const express = require("express");
const router = express.Router();
const { viewAuth } = require("../middlewares/viewAuth");

// Exemple avec réservations fictives
router.get("/", viewAuth, async (req, res) => {
    const reservations = [];

    res.render("dashboard", {
        user: req.user,
        reservations,
        today: new Date().toLocaleDateString("fr-FR")
    });
});


module.exports = router;

