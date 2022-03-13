const { response } = require('express')
const Users = require('../models/userModel')

const authAdmin = async (req, res, next) => {
    try{
        const user = await Users.findOne({
            _id: req.user._id
        })
        if(user.role !== 1 )
            return res.status(400).json({msg: "Admin access denied"})

        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = authAdmin;