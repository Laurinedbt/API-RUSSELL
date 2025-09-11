
const User = require('../models/user'); // modèle mongoose
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;


// Récupérer tous les utilisateurs
exports.getAll = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error: err });
  }
};

exports.getByEmail = async (req, res, next) => {
    const email = req.params.email

    try {
        let user = await User.findOne({ email: email });

        if (user) {
            return res.status(200).json(user);
        }

        return res.status(404).json('user_not_found');
    } catch (error) {
        return res.status(501).json(error);
    }
}

// Callback pour à ajouter un user
exports.add = async (req, res, next) => {

    const temp = ({
        username : req.body.username,
        email : req.body.email,
        password : req.body.password
    });

    try {
        let user = await User.create(temp);

        return res.status(201).json(user);
    } catch (error) {
        return res.status(501).json(error);
    }
}

// Callback pour modifier un user

exports.update = async (req, res, next) => {
    const email = req.params.email
    const temp = ({
        username : req.body.username,
        email : req.body.email,
        password : req.body.password
    });

    try  {

        let user = await User.findOne({ email: email });

    if (user) {
        Object.keys(temp).forEach((key) => {
            if (!!temp[key]) {
                user [key] = temp[key];
            }
        });

        await user.save();
        return res.status(201).json(user);
    }

        return res.status(404).json('user_not_found');
    } catch (error) {
        return res.status(501).json(error);
    }
}

// Callback pour supprimer un user

exports.delete = async (req, res, next) => {
    const email = req.params.email
    try {
        await User.deleteOne({ email: email });

        return res.status(204).json('delete_ok');
    } catch (error) {
        return res.status(501).json(error);
    }
}

// Callback pour l'authentification, login et logout

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email: email }, "-__v -createdAt -updatedAt");

        if (user) {
            const response = await bcrypt.compare(password, user.password);

            if (response) {
                delete user._doc.password;

                const expireIn = 24 * 60 * 60;
                const token = jwt.sign(
                    { user: user },
                    SECRET_KEY,
                    { expiresIn: expireIn }
                );

                // Stocker le token en cookie pour réutilisation
                res.cookie("authToken", token, {
                    httpOnly: true,
                    maxAge: expireIn * 1000
                });

                // Redirection vers le dashboard
                return res.redirect("/dashboard");
            }

            return res.status(403).render("login", { error: "Identifiants incorrects" });

        } else {
            return res.status(404).render("login", { error: "Utilisateur non trouvé" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).render("login", { error: "Erreur serveur" });
    }
};


exports.logout = async (req, res, next) => {
    try {
        // Supprime le cookie authToken
        res.clearCookie("authToken");

        // Redirige vers la page d’accueil
        return res.redirect("/");
    } catch (error) {
        console.error(error);
        return res.status(500).render("login", { error: "Erreur lors de la déconnexion" });
    }
};
