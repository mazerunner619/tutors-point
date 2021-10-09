const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.cookies.token;
        jwt.verify(token, process.env.JWT_SECRET_KEY);
        next();
    }catch(error){
       res.send('authentication required !');
    }
}