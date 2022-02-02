const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary')
const fs = require('fs')

const userController = {
    google: async(req, res) => {
        try{
            const {name, email, registerrole, photoUrl} = req.body

            const user = await Users.findOne({email}) 
            if(user) {
                const accesstoken = createAccessToken(user._id)

                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    image: user.image,
                    token: accesstoken
                })
            } else {
                const newUser = new Users({
                    name: name,
                    email: email,
                    role: registerrole === "user" ? 0 : 1,
                    image: photoUrl
                })

                await newUser.save()

                const accesstoken = createAccessToken(newUser._id)

                res.json({
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    image: newUser.image,
                    token: accesstoken
                })
            }

        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    facebook: async(req, res) => {
        try{
            const {name, email, registerrole, id, token} = req.body

            const user = await Users.findOne({email}) 
            if(user) {
                const accesstoken = createAccessToken(user._id)

                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    fbid: id,
                    fbtoken: token,
                    token: accesstoken
                })
            } else {
                const newUser = new Users({
                    name: name,
                    email: email,
                    role: registerrole === "user" ? 0 : 1,
                })

                await newUser.save()

                const accesstoken = createAccessToken(newUser._id)

                res.json({
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    fbid: id,
                    fbtoken: token,
                    token: accesstoken
                })
            }
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    register: async(req, res) => {
        try{
            const {name, email, password, registerrole} = req.body

            const user = await Users.findOne({email}) 
            if(user)
                return res.status(400).json({msg: "The email already exists."})
            
            if(password.length < 6)
                return res.status(400).json({msg: "Password should be atleast 6 character long"});

            const passwordHash = await bcrypt.hash(password, 10)

            const newUser = new Users({
                name: name,
                email: email,
                role: registerrole === "user" ? 0 : 1,
                password: passwordHash,
                //image: photoUrl
            })

            await newUser.save()

            const accesstoken = createAccessToken(newUser._id)

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
            const {email, password} = req.body       

            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: "User does not exist"})

            if(!user.password) return res.status(400).json({msg: "Login Unsuccessful"})

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
    updateUserProfile: async(req, res) => {
        try{
            const user = await Users.findById(req.params.id).select('-password')
            if(!user) return res.status(400).json({msg: "User does not exists."})

            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            user.phone = req.body.phone_number || user.phone

            if(req.body.image) {
                const check = checkURL(req.body.image)
                
                if(check) {
                    user.image = req.body.image       
                } else {                  
                    cloudinary.config({
                        cloud_name: process.env.CLOUD_NAME,
                        api_key: process.env.CLOUD_API_KEY,
                        api_secret: process.env.CLOUD_API_SECRET
                    })
                    
                    await cloudinary.v2.uploader.upload("data:image/gif;base64," + req.body.image, {folder: "grab-my-garbage"}, (err, result) =>{
                        if(err) 
                            throw err
                        else
                            user.image = result.secure_url   
                    })
                }   
            }
            
            if (req.body.password) {
                user.password = req.body.password
            }

            await user.save()

            res.json({
                message: 'User updated'
            })                   
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUserById: async(req, res) => {
        try {
            const user = await Users.findById(req.params.id)
            if(!user) return res.status(400).json({msg: "User does not exists."})

            res.json(user)         
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    returnDetails: async(req, res) => {
        try{
            const {email} = req.body

            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: "User does not exists."})

            const accesstoken = createAccessToken(user._id)

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
                token: accesstoken
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUserPassword: async(req, res) => {
        try{
            const user = await Users.findById(req.params.id).select('-password')
            if(!user) return res.status(400).json({msg: "User does not exists."})
            
            const password = req.body.password
            const passwordHash = await bcrypt.hash(password, 10)

            user.password = passwordHash

            await user.save()

            res.json({
                message: 'User updated'
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

const checkURL = (check) => {
    let url 

    try {
        url = new URL(check)
    } catch (_) {
        return false
    }

    return url.protocol === 'http:' || url.protocol === 'https:'
}

module.exports = userController;