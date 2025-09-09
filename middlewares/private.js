const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

exports.checkJWT = async (req, res, next) => {
    // On cherche le token dans le header ou dans le cookie
    let token = req.headers['x-access-token'] || req.headers['authorization'] || req.cookies.authToken;

    if (!!token && token.startsWith('Bearer')) {
        token = token.slice(7);
    }

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json("token_not_valid");
            } else {
                req.decoded = decoded;

                // Rafraîchissement du token
                const expiresIn = 24 * 60 * 60;
                const newToken = jwt.sign(
                    { user: decoded.user },
                    SECRET_KEY,
                    { expiresIn: expiresIn }
                );

                // On renvoie le token mis à jour dans le header (optionnel)
                res.header("Authorization", 'Bearer ' + newToken);
                next();
            }
        });
    } else {
        return res.status(401).json('token_required');
    }
};


