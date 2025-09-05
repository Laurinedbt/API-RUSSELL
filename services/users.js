
const User = require('../models/user'); // modèle mongoose
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;


// On exporte le callback afin d'y accéder dans notre gestionnaire de routes


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

// Ici c'est le callback qui servira à ajouter un user
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

// Ici c'est le callback qui servira à modifier un user

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

// Ici c'est le callback qui servira à supprimer un user

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
        let user = await User.findOne({ email : email }, "-__v -createdAt -updatedAt");

        if (user) {
            const response = await bcrypt.compare(password, user.password);
            
            if (response) {
                delete user._doc.password;

                const expireIn = 24 * 60 * 60;
                const token = jwt.sign({
                    email: user.email,
                    role: user.role
                },
                SECRET_KEY,
                {
                        expiresIn: expireIn
                });

                res.header('Authorization', 'Bearer ' + token);
                return res.status(200).json({
                    message:'authenticate_succeed',
                    token: token,
                    user: {
                        email: user.email,
                        role: user.role
                    }
                });
            }

            return res.status(403).json('wrong_credentials');
            
        } else {
            return res.status(404).json('user_not_found');
        }

    } catch (error) {
        return res.status(501).json(error);
    }
}


// Fonction pour le login côté serveur
exports.loginReturn = async (email, password) => {
    try {
        let user = await User.findOne({ email: email }, "-__v -createdAt -updatedAt");

        if (!user) {
            throw new Error('user_not_found');
        }

        const response = await bcrypt.compare(password, user.password);
        
        if (!response) {
            throw new Error('wrong_credentials');
        }

        delete user._doc.password;

        const expireIn = 24 * 60 * 60;
        const token = jwt.sign({ user: user }, SECRET_KEY, { expiresIn: expireIn });

        return { token, user }; // Retourne les données, pas de réponse HTTP
        
    } catch (error) {
        throw error;
    }
};


exports.logout = async (req, res, next) => {
    try {
        res.removeHeader('Authorization');
        return res.status(200).json({ message: 'logout_success' });

    } catch (error) {
        return res.status(501).json(error);
    }
}