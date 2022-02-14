const Haulers = require('../models/haulerModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary')

const haulerController = {
    login: async(req, res) => {
        try {
            const {email, password} = req.body       

            const hauler = await Haulers.findOne({email})
            if(!hauler) return res.status(400).json({msg: "User does not exist"})

            if(!hauler.password) return res.status(400).json({msg: "Login Unsuccessful"})

            // const isMatch = await bcrypt.compare(password, user.password)
            // if(!isMatch) return res.status(400).json({msg: "Incorrect password"})

            const accesstoken = createAccessToken(hauler._id)
            const refreshtoken = createRefreshToken(hauler._id)

            res.status(200).json({
                _id: hauler._id,
                name: hauler.name,
                email: hauler.email,
                role: hauler.role,
                image: hauler.image,
                phone: hauler.phone,
                token: accesstoken
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    returnDetails: async(req, res) => {
        try{
            const {email} = req.body

            const hauler = await Haulers.findOne({email})
            if(!hauler) return res.status(400).json({msg: "User does not exists."})

            const accesstoken = createAccessToken(hauler._id)

            res.status(200).json({
                _id: hauler._id,
                name: hauler.name,
                email: hauler.email,
                role: hauler.role,
                image: hauler.image,
                token: accesstoken
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    postLocation: async(req, res) => {
        try{
            const {location, haulerID} = req.body

            const hauler = await Haulers.findById(haulerID)
            if(!hauler) return res.status(400).json({msg: "User does not exists."})

            hauler.location = location

            await hauler.save()

            res.status(200).json({
                message: 'Location updated'
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

const createAccessToken = (user) => {
    return jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}

const createRefreshToken = (user) => {
    return jwt.sign({user}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

module.exports = haulerController