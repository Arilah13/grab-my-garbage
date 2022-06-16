const Users = require('../../models/userModel')
const Schedule = require('../../models/scheduledPickupModel')
const Special = require('../../models/specialPickupModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary')

const userController = {
    google: async(req, res) => {
        try{
            const {name, email, registerrole, photoUrl, notification_token} = req.body

            const user = await Users.findOne({email}) 
            if(user) {
                const accesstoken = createAccessToken(user._id)

                const noti = await user.pushId.find(id => id === notification_token)
                   
                if(!noti) {
                    user.pushId.push(notification_token)
                    await user.save()
                }

                const scheduleCount = await Schedule.countDocuments({customerId: user._id})
                const specialCount = await Special.countDocuments({customerId: user._id})

                const schedule = await Schedule.find({customerId: user._id})
                const special = await Special.find({customerId: user._id})

                const count = scheduleCount + specialCount

                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    image: user.image,
                    count: count,
                    schedule: schedule,
                    special: special,
                    pushId: user.pushId,
                    token: accesstoken
                })
            } else {
                const newUser = new Users({
                    name: name,
                    email: email,
                    role: registerrole === 'user' ? 0 : 1,
                    image: photoUrl,
                    pushId: notification_token
                })

                await newUser.save()

                const accesstoken = createAccessToken(newUser._id)

                const scheduleCount = await Schedule.countDocuments({customerId: newUser._id})
                const specialCount = await Special.countDocuments({customerId: newUser._id})

                const schedule = await Schedule.find({customerId: newUser._id})
                const special = await Special.find({customerId: newUser._id})

                const count = scheduleCount + specialCount

                res.status(200).json({
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    image: newUser.image,
                        count: count,
                    schedule: schedule,
                    special: special,
                    pushId: newUser.pushId,
                    token: accesstoken
                })
            }

        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    facebook: async(req, res) => {
        try{
            const {name, email, registerrole, id, token, notification_token} = req.body

            const user = await Users.findOne({email}) 
            if(user) {
                const accesstoken = createAccessToken(user._id)

                if(user.pushId !== notification_token) {
                    user.pushId = notification_token
                    await user.save()
                }

                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    fbid: id,
                    fbtoken: token,
                    pushId: user.pushId,
                    token: accesstoken
                })
            } else {
                const newUser = new Users({
                    name: name,
                    email: email,
                    pushId: notification_token,
                    role: registerrole === 'user' ? 0 : 1,
                })

                await newUser.save()

                const accesstoken = createAccessToken(newUser._id)

                res.status(200).json({
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    fbid: id,
                    pushId: newUser.pushId,
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
            const {name, email, password, registerrole, notification_token} = req.body

            const user = await Users.findOne({email}) 
            if(user)
                return res.status(400).json({msg: 'The email already exists.'})
            
            if(password.length < 6)
                return res.status(400).json({msg: 'Password should be atleast 6 character long'});

            const passwordHash = await bcrypt.hash(password, 10)

            const newUser = new Users({
                name: name,
                email: email,
                role: registerrole === 'user' ? 0 : 1,
                password: passwordHash,
                pushId: notification_token,
                //image: photoUrl
            })

            await newUser.save()

            const accesstoken = createAccessToken(newUser._id)

            res.status(200).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                pushId: newUser.pushId,
                token: accesstoken
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async(req, res) => {
        try {
            const {email, password, notification_token} = req.body       

            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: 'User does not exist'})

            if(!user.password) return res.status(400).json({msg: 'Login Unsuccessful'})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: 'Incorrect password'})

            const noti = await user.pushId.find(id => id === notification_token)
             
            if(!noti) {
                user.pushId.push(notification_token)
                await user.save()
            }

            const accesstoken = createAccessToken(user._id)
            const refreshtoken = createRefreshToken(user._id)

            if(user.pushId !== notification_token) {
                user.pushId = notification_token
                await user.save()
            }

            const scheduleCount = await Schedule.countDocuments({customerId: user._id})
            const specialCount = await Special.countDocuments({customerId: user._id})

            const schedule = await Schedule.find({customerId: user._id})
            const special = await Special.find({customerId: user._id})

            const count = scheduleCount + specialCount

            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                pushId: user.pushId,
                count: count,
                schedule: schedule,
                special: special,
                token: accesstoken
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    logout: async(req, res) => {
        try{
            res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
            return res.status(200).json({msg: 'Logged out'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    refreshtoken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if(!rf_token) return res.status(400).json({msg: 'Please Login or Register'})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if(err) return res.status(400).json({msg: 'Please Login or Register'})

                const accesstoken = createAccessToken({id: user._id})
                res.status(200).json({accesstoken})
            })

            res.status(200).json({rf_token})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUserProfile: async(req, res) => {
        try{
            const user = await Users.findById(req.params.id).select('-password')
            if(!user) return res.status(400).json({msg: 'User does not exists.'})

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
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUserById: async(req, res) => {
        try {
            const user = await Users.findById(req.params.id)
            if(!user) return res.status(400).json({msg: 'User does not exists.'})

            res.status(200).json(user)         
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    returnDetails: async(req, res) => {
        try{
            const {email} = req.body

            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: 'User does not exists.'})

            const scheduleCount = await Schedule.countDocuments({customerId: user._id})
            const specialCount = await Special.countDocuments({customerId: user._id})

            const schedule = await Schedule.find({customerId: user._id})
            const special = await Special.find({customerId: user._id})

            const count = scheduleCount + specialCount

            const accesstoken = createAccessToken(user._id)

            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
                count: count,
                schedule: schedule,
                special: special,
                token: accesstoken
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUserPassword: async(req, res) => {
        try{
            const user = await Users.findById(req.params.id).select('-password')
            if(!user) return res.status(400).json({msg: 'User does not exists.'})
            
            const password = req.body.password
            const passwordHash = await bcrypt.hash(password, 10)

            user.password = passwordHash

            await user.save()

            res.status(200).json({
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

module.exports = userController