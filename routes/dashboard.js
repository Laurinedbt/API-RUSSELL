const express = require("express");
const router = express.Router();
const { viewAuth } = require("../middlewares/viewAuth");
const Catway = require("../models/catway");
const Reservation = require("../models/reservation");
const User = require("../models/user");


router.get("/", viewAuth, async (req, res) => {
    const reservations = [];
    res.render("dashboard", {
        user: req.user,
        reservations,
        today: new Date().toLocaleDateString("fr-FR")
    });
});

// Catways page
router.get("/catways", viewAuth, async (req, res) => {
    const catways = await Catway.find();
    res.render("catways", { user: req.user, catways });
});

// Réservations page
router.get("/reservations", viewAuth, async (req, res) => {
    const reservations = await Reservation.find().populate("catwayId");
    const catways = await Catway.find();
    res.render("reservations", { user: req.user, reservations, catways });
});

// Utilisateurs page (admin uniquement)
router.get("/users", viewAuth, async (req, res) => {
    if(req.user.role !== 'admin') return res.redirect("/dashboard");
    const users = await User.find();
    res.render("users", { user: req.user, users });
});



module.exports = router;

