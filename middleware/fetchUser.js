const jwt = require('jsonwebtoken');
const JWT_SECRET = "thestillriver@120"

const fetchUser = (req, res, next) => {
    // get the user from the jwt token and add it to the req object
    const token = req.header('auth-token')
    if(!token) {
        res.status(400).send({success : 0, errorMessage : "Please authicate using a valid token"})
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user 
        next()
    } catch (error) {
        console.log(error.message)
        res.status(500).send({success : 0, errorMessage : "Please authicate using a valid token"})
    }
    

}

module.exports = fetchUser