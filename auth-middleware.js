const jwt = require('jsonwebtoken');
const middleWares = {};

middleWares.authenticateUser = (req, res ,next) => {
    const token = req.cookies.token;
    if(!token)
        return res.status(401).json({message : "UNAUTHORIZED action, beware!"});
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if(verified.userId === req.params.userid)
    next();
    else res.status(401).json({message : "UNAUTHORIZED action, beware!"});
};



module.exports = middleWares;