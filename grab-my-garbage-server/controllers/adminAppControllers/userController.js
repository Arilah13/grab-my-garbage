const Users = require('../../models/userModel')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary')

const userController = {
    returnUserList: async(req, res) => {
        try{
            const users = await Users.find({}).select('-password')

            res.status(200).json(users)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    returnUserDetail: async(req, res) => {
        try{
            const user = await Users.findById(req.params.id).select('-password')
            if(!user) return res.status(400).json({msg: 'User does not exists.'})

            res.status(200).json(user)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUserDetail: async(req, res) => {
        try{
            const user = await Users.findById(req.params.id).select('-password')
            if(!user) return res.status(400).json({msg: 'User does not exists.'})

            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            user.phone = req.body.phone || user.phone

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
                    
                    await cloudinary.v2.uploader.upload('data:image/gif;base64,' + req.body.image, {folder: 'grab-my-garbage'}, (err, result) =>{
                        if(err) 
                            throw err
                        else
                            user.image = result.secure_url   
                    })
                }   
            }

            await user.save()

            res.status(200).json({
                message: 'User updated'
            }) 
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteUser: async(req, res) => {
        try{
            const user = await Users.findById(req.params.id)

            if(!user)
                return res.status(400).json({msg: 'The user does not exist.'})

            await user.remove()
            res.status(200).json({msg: 'User removed'})
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

module.exports = userController