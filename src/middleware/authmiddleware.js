const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
    async protect(req, res, next){
        let accessToken
    
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            try {
                accessToken = await req.headers.authorization.split(' ')[1]
    
                const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    
                req.user = await User.findById(decoded.id).select('-password')
    
                next()
            } catch (error) {
                console.error(error)
                return res.status(401).json({ message : 'Not authorized, token failed'});
            }
        }
    
        if (!accessToken) {
            return res.status(404).json({
                message : "Not authorized, no token"
            });
        }
    },
    
    async admin(req, res, next){
        if (req.user && req.user.isAdmin) {
            next()
        } else {
            return res.status(401).json({ message : 'Not authorized as an admin' })
        }
    }
}

