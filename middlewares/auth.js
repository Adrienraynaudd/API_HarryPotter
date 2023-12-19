const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../logger');
const ENV = require('../environment/environment');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            throw new Error('Token absent');
        }

        const decodedToken = jwt.verify(token, ENV.RANDOM_TOKEN_SECRET);

        User.findOne({ email: decodedToken.user.email })
            .then((user) => {
                if (!user) {
                    throw new Error('Utilisateur introuvable');
                }
                logger.warn({ message: `${user.name} fait une requête ${req.method} ${req.baseUrl}${req.path}` });
                next();
            })
            .catch((err) => {
                logger.error({ message: err.toString() });
                res.status(403).json({ message: 'UNAUTHORIZED - 1' });
            });
    } catch (err) {
        res.status(403).json({ message: 'UNAUTHORIZED - 0' });
    }
};
