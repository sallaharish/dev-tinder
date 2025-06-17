const jwt = require('jsonwebtoken');
const util = require('util');
const verifyToken = util.promisify(jwt.verify);

async function auth(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send('Unauthorized: No token');
    }

    try {
        const decoded = await verifyToken(token, 'your_jwt_secret');
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).send('Unauthorized: Invalid token');
    }
}

module.exports = auth;
