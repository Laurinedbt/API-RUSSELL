// Vérifier que l’utilisateur est connecté avant de lui permettre d’accéder à certaines pages du dashboard

const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

exports.viewAuth = (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) return res.redirect("/");

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded.user;
        next();
    } catch (err) {
        return res.redirect("/");
    }
};
