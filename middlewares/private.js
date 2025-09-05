const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

exports.checkJWT = async (req, res, next) => {
    // Récupérer le token depuis les headers OU les cookies
    let token = req.headers['x-access-token'] 
             || req.headers['authorization'] 
             || req.cookies.token;   // <-- 🔑 ajout

    if (!!token && token.startsWith('Bearer')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).render('index', { 
                    title: 'Accueil',
                    message: "Token invalide, veuillez vous reconnecter"
                });
            } else {
                req.decoded = decoded;

                // Optionnel : régénérer un nouveau token si tu veux prolonger la session
                const expiresIn = 24 * 60 * 60;
                const newToken = jwt.sign(
                    { user: decoded.user },
                    SECRET_KEY,
                    { expiresIn }
                );

                res.cookie('token', newToken, { httpOnly: true, secure: false });
                next();
            }
        });
    } else {
        return res.status(401).render('index', {
            title: 'Accueil',
            message: "Veuillez vous connecter"
        });
    }
};

