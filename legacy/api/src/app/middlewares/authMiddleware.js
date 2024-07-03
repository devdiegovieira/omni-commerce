const authConfig = require('../../configs/auth.json');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    try
    {
        if (!authHeader)
            throw 'Bearer authorization token needed.';

        const parts = authHeader.split(' ');
        const [ scheme, token ] = parts;

        if ((!parts.length === 2) || !scheme === 'Bearer')
            throw 'Bearer token invalid.';

        if (token != 'SW52ZW50b1Npc3RlbWFzL0h1YkRpZ2lncm93L1BlcnNpc3RlbnRBY2Nlc3MvR2VuZXJhdGVkQnlEaWVnby8wMzA1MjAyMQ==')
            throw 'Bearer token unregistered.'; 

        return next();
    } catch (err) {
        res.status(400).json(err);
    }
}