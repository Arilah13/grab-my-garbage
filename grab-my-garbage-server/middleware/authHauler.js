const jwt = require('jsonwebtoken')
const Haulers = require('../models/haulerModel')

const auth = async (req, res, next) => {
    try{ 
        let token, decoded
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            try {
                token = req.headers.authorization.split(' ')[1]

                decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

                const hauler = await Haulers.findById(decoded.user).select('-password')

                next()
            } catch (error) {
                res.status(401)
                throw new Error(`Not authorized, token failed`)
            }
        }

        if (!token) {
            res.status(401)
            throw new Error('Not authorized, no token')
        }

    } catch(err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = auth;