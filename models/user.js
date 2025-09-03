const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require("bcrypt");

const User = new Schema({
    username : {
        type : String,
        trim : true,
        required: [true, "Le nom d'utilisateur est requis"]
    },

    email: {
        type: String,
        trim: true,
        required: [true, "L'email est requis"],
        unique: true, 
        lowercase: true
    },
    password: {
        type: String,
        trim: true,
    }
}, {
    // ajoute 2 champs au document createdAt et updateAt
    timestamps: true
});

// Hash le mot de passe quand il est modifié 
User.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next ();
    }

    this.password = bcrypt.hashSync(this.password, 10);

    next();
});

module.exports = mongoose.model('User', User);