const Catway = require('../models/catway'); // modèle mongoose
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;


// Récupérer tous les catways
exports.getAll = async (req, res) => {
  try {
    const catways = await Catway.find();
    res.status(200).json(catways);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des catways", error: err });
  }
};

exports.getById = async (req, res, next) => {
    const id = req.params.id

    try {
        let catway = await Catway.findById(id);

        if (catway) {
            return res.status(200).json(catway);
        }

        return res.status(404).json('catway_not_found');
    } catch (error) {
        return res.status(501).json(error);
    }
}

// Callback pour ajouter un catway
exports.add = async (req, res, next) => {

    const temp = ({
        catwayNumber : req.body.catwayNumber,
        catwayType : req.body.catwayType,
        catwayState : req.body.catwayState
    });

    try {
        let catway = await Catway.create(temp);

        return res.status(201).json(catway);
    } catch (error) {
        return res.status(501).json(error);
    }
}

// Callback pour modifier un catway

exports.update = async (req, res, next) => {
    const id = req.params.id
    const temp = ({
        catwayNumber : req.body.catwayNumber,
        catwayType : req.body.catwayType,
        catwayState : req.body.catwayState
    });

    try  {

        let catway = await Catway.findOne({_id : id});

    if (catway) {
        Object.keys(temp).forEach((key) => {
            if (!!temp[key]) {
                catway [key] = temp[key];
            }
        });

        await catway.save();
        return res.status(201).json(catway);
    }

        return res.status(404).json('catway_not_found');
    } catch (error) {
        return res.status(501).json(error);
    }
}

// Callback pour supprimer un catway

exports.delete = async (req, res, next) => {
    const id = req.params.id
    try {
        await Catway.deleteOne({_id : id});

        return res.status(204).json('delete_ok');
    } catch (error) {
        return res.status(501).json(error);
    }
}
