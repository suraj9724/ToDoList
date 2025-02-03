var jwt = require('jsonwebtoken');
var jwt_screat = "SurajIsGood";

const fetchuser = (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" })
    }

    try {
        const data = jwt.verify(token, jwt_screat)
        // Make sure we're setting the user object correctly
        req.user = {
            id: data.user
        }
        next()
    } catch (error) {
        res.status(401).send({ error: "Invalid token" })
    }
}

module.exports = fetchuser;