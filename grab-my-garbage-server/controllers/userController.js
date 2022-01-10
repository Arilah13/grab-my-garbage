const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userController = {
    register: async(req, res) => {
        try{
            const {name, email, password, phone_number, registerrole} = req.body

            const user = await Users.findOne({email})
            if(user)
                return res.status(400).json({msg: "The email already exists."})
            
            if(password.length < 6)
                return res.status(400).json({msg: "Password should be atleast 6 character long"});

            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new Users({
                name: name,
                email: email,
                phone: phone_number,
                role: registerrole === "user" ? 0 : 1,
                password: passwordHash
            })

            await newUser.save()

            const accesstoken = createAccessToken(newUser._id)
            const refreshtoken = createRefreshToken(newUser._id)

            res.json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                token: accesstoken
            })

        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async(req, res) => {
        try {
            const {email, password} = req.body;

            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: "User does not exist"})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Incorrect password"})

            const accesstoken = createAccessToken(user._id)
            const refreshtoken = createRefreshToken(user._id)

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: accesstoken
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    logout: async(req, res) => {
        try{
            res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
            return res.json({msg: "Logged out"})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    refreshtoken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if(!rf_token) return res.status(400).json({msg: "Please Login or Register"})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if(err) return res.status(400).json({msg: "Please Login or Register"})

                const accesstoken = createAccessToken({id: user._id})
                res.json({accesstoken})
            })

            res.json({rf_token})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUserProfile: async(req, res) => {
        try{
            const user = await Users.findById(req.user._id)
            if(!user) return res.status(400).json({msg: "User does not exists."})

            res.json(user)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUserProfile: async(req, res) => {
        try{
            const user = await Users.findById(req.user._id)
            if(!user) return res.status(400).json({msg: "User does not exists."})

            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            if (req.body.password) {
                user.password = req.body.password
            }

            const accesstoken = createAccessToken({id: updatedUser._id})

            const updatedUser = await user.save()

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                token: accesstoken
            })                   
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

}

const createAccessToken = (user) => {
    return jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}

const createRefreshToken = (user) => {
    return jwt.sign({user}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

module.exports = userController;