const Users = require('../../models/userModel')
const Haulers = require('../../models/haulerModel')
const SpecialPickup = require('../../models/specialPickupModel')
const SchedulePickup = require('../../models/scheduledPickupModel')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary')
const bcrypt = require('bcrypt')

const userController = {
    returnUserList: async(req, res) => {
        try{
            const users = await Users.find({role: {$ne: 2}}).select('-password')

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
                  
                cloudinary.config({
                    cloud_name: process.env.CLOUD_NAME,
                    api_key: process.env.CLOUD_API_KEY,
                    api_secret: process.env.CLOUD_API_SECRET
                })
                
                await cloudinary.v2.uploader.upload(req.body.image, {folder: 'grab-my-garbage'}, (err, result) =>{
                    if(err) 
                        throw err
                    else
                        user.image = result.secure_url   
                })
                 
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
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    loginAdmin: async(req, res) => {
        try{
            const {password} = req.body      

            const admin = await Users.findOne({role: 2})

            if(!admin.password) return res.status(400).json({msg: 'Login Unsuccessful'})

            const isMatch = await bcrypt.compare(password, admin.password)
            if(!isMatch) return res.status(400).json({msg: 'Incorrect password'})

            const accesstoken = createAccessToken(admin._id)

            const users = await Users.find({role: {$ne: 2}}).select('-password')

            const haulers = await Haulers.find({role: 1}).select('-password')

            const scheduleCount = await SchedulePickup.countDocuments({cancelled: 0})

            const specialCount = await SpecialPickup.countDocuments({cancelled: 0})

            const schedule = await SchedulePickup.find({cancelled: 0})

            const special = await SpecialPickup.find({cancelled: 0})

            admin.accesstoken = accesstoken

            res.status(200).json({
                admin: admin,
                users: users,
                haulers: haulers,
                scheduleCount: scheduleCount,
                specialCount: specialCount,
                schedule: schedule,
                special: special
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    returnAdmin: async(req, res) => {
        try{
            const admin = await Users.findOne({role: 2}).select('-password')

            const users = await Users.find({role: {$ne: 2}}).select('-password')

            const haulers = await Haulers.find({role: 1}).select('-password')

            const scheduleCount = await SchedulePickup.countDocuments({cancelled: 0})

            const specialCount = await SpecialPickup.countDocuments({cancelled: 0})

            const schedule = await SchedulePickup.find({cancelled: 0})

            const special = await SpecialPickup.find({cancelled: 0})

            res.status(200).json({
                admin: admin,
                users: users,
                haulers: haulers,
                scheduleCount: scheduleCount,
                specialCount: specialCount,
                schedule: schedule,
                special: special
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateAdmin: async(req, res) => {
        try{
            const admin = await Users.findOne({role: 2})

            admin.email = req.body.email || admin.email
            
            if(req.body.password) {
                admin.password = await bcrypt.hash(req.body.password, 10)
            }

            if(req.body.image) {                 
                cloudinary.config({
                    cloud_name: process.env.CLOUD_NAME,
                    api_key: process.env.CLOUD_API_KEY,
                    api_secret: process.env.CLOUD_API_SECRET
                })
                
                await cloudinary.v2.uploader.upload(req.body.image, {folder: 'grab-my-garbage'}, (err, result) =>{
                    if(err) 
                        throw err
                    else
                        admin.image = result.secure_url   
                })  
            }
            const newAdmin = await admin.save()

            const users = await Users.find({role: {$ne: 2}}).select('-password')

            const haulers = await Haulers.find({role: 1}).select('-password')

            const scheduleCount = await SchedulePickup.countDocuments({cancelled: 0})

            const specialCount = await SpecialPickup.countDocuments({cancelled: 0})

            const schedule = await SchedulePickup.find({cancelled: 0})

            const special = await SpecialPickup.find({cancelled: 0})

            res.status(200).json({
                admin: newAdmin,
                users: users,
                haulers: haulers,
                scheduleCount: scheduleCount,
                specialCount: specialCount,
                schedule: schedule,
                special: special
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

const createAccessToken = (user) => {
    return jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}

module.exports = userController