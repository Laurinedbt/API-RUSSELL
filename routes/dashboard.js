const express = require("express");
const router = express.Router();
const { viewAuth } = require("../middlewares/viewAuth");
const Catway = require("../models/catway");
const Reservation = require("../models/reservation");
const User = require("../models/user");

// Tableau de bord
router.get("/", viewAuth, async (req, res) => {
    const reservations = [];
    res.render("dashboard", {
        user: req.user,
        reservations,
        today: new Date().toLocaleDateString("fr-FR")
    });
});


// ------------------ CATWAYS ------------------
// Page Catways
router.get("/catways", viewAuth, async (req, res) => {
    try {
        const catways = await Catway.find();  // récupère tous les catways
        res.render("catways", { user: req.user, catways });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur récupération catways");
    }
});


// Ajouter un catway
router.post("/catways", viewAuth, async (req, res) => {
    try {
        const { catwayNumber, catwayType, catwayState } = req.body;
        await Catway.create({ catwayNumber, catwayType, catwayState });
        res.redirect("/dashboard/catways");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur ajout catway");
    }
});

// Modifier un catway
router.put("/catways/:id", viewAuth, async (req, res) => {
    try {
        const { catwayNumber, catwayType, catwayState } = req.body;
        await Catway.findByIdAndUpdate(req.params.id, { catwayNumber, catwayType, catwayState });
        res.redirect("/dashboard/catways");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur modification catway");
    }
});

// Supprimer un catway
router.delete("/catways/:id", viewAuth, async (req, res) => {
    try {
        await Catway.findByIdAndDelete(req.params.id);
        res.redirect("/dashboard/catways");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur suppression catway");
    }
});

// ------------------ RESERVATIONS ------------------

// Page Réservations
router.get("/reservations", viewAuth, async (req, res) => {
    try {
        const catways = await Catway.find();

        let reservations;
        if (req.user.role === 'admin') {
            // Admin voit toutes les réservations
            reservations = await Reservation.find();
        } else {
            // Client ne voit que ses réservations
            reservations = await Reservation.find({ clientName: req.user.username });
        }

        res.render("reservations", { user: req.user, reservations, catways });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur récupération réservations");
    }
});



// Ajouter une réservation
router.post("/reservations", viewAuth, async (req, res) => {
    try {
        const { catwayNumber, clientName, boatName, startDate, endDate } = req.body;

        // Vérifier si le catway est déjà réservé sur cette période
        const existing = await Reservation.find({
            catwayNumber,
            $or: [
                { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
            ]
        });

        if (existing.length > 0) {
            // Conflit : catway déjà réservé
            return res.status(400).send("Ce catway est déjà réservé sur ces dates");
        }

        await Reservation.create({ catwayNumber, clientName, boatName, startDate, endDate });
        res.redirect("/dashboard/reservations");

    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur ajout réservation");
    }
});



// Supprimer une réservation
router.delete("/reservations/:id", viewAuth, async (req, res) => {
    try {
        await Reservation.findByIdAndDelete(req.params.id);
        res.redirect("/dashboard/reservations");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur suppression réservation");
    }
});


// ------------------ UTILISATEURS (admin) ------------------
// Page Utilisateurs
router.get("/users", viewAuth, async (req, res) => {
    if (req.user.role !== "admin") return res.redirect("/dashboard");
    const users = await User.find();
    res.render("users", { user: req.user, users });
});

// Ajouter un utilisateur
router.post("/users", viewAuth, async (req, res) => {
    if (req.user.role !== "admin") return res.redirect("/dashboard");
    const { username, email, password, role } = req.body;
    await User.create({ username, email, password, role });
    res.redirect("/dashboard/users");
});

// Modifier un utilisateur
router.put("/users/:id", viewAuth, async (req, res) => {
    if (req.user.role !== "admin") return res.redirect("/dashboard");
    const { username, email, role } = req.body;
    await User.findByIdAndUpdate(req.params.id, { username, email, role });
    res.redirect("/dashboard/users");
});

// Supprimer un utilisateur
router.delete("/users/:id", viewAuth, async (req, res) => {
    if (req.user.role !== "admin") return res.redirect("/dashboard");
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard/users");
});



module.exports = router;

