const Users = require('../../models/userModel')
const Haulers = require('../../models/haulerModel')
const SpecialPickup = require('../../models/specialPickupModel')
const SchedulePickup = require('../../models/scheduledPickupModel')

const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary')
const bcrypt = require('bcrypt')
const turf = require('@turf/turf')

const polygonData = require('../../helpers/polygonData')

const userController = {
    returnUserList: async(req, res) => {
        try{
            let result = []

            const users = await Users.find({role: {$ne: 2}}).select('-password')

            if(users.length > 0) {
                for(let n=0; n<users.length; n++) {
                    const specialPickups = await SpecialPickup.find({ customerId: users[n]._id })
                    const schedulePickups = await SchedulePickup.find({ customerId: users[n]._id })

                    result.push({
                        _id: users[n]._id,
                        name: users[n].name,
                        email: users[n].email,
                        role: users[n].role,
                        image: users[n].image,
                        createdAt: users[n].createdAt,
                        updatedAt: users[n].updatedAt,
                        __v: users[n].__v,
                        phone: users[n].phone,
                        paymentId: users[n].paymentId,
                        pushId: users[n].pushId,
                        specialPickups: specialPickups,
                        schedulePickups: schedulePickups
                    })
                }
            }

            res.status(200).json(result)
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

            const specialPickups = await SpecialPickup.find({ customerId: user._id })
            const schedulePickups = await SchedulePickup.find({ customerId: user._id })

            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
                phone: user.phone,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                __v: user.__v,
                paymentId: user.paymentId,
                pushId: user.pushId,
                specialPickups: specialPickups,
                schedulePickups: schedulePickups
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
            res.status(200).json({msg: 'User Removed'})
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
    },
    addSpecialPickup: async(req, res) => {
        try{
            const {pickupInfo, id, result} = req.body

            let photo

            if(pickupInfo.image !== null && pickupInfo.image !== '') {
                cloudinary.config({
                    cloud_name: process.env.CLOUD_NAME,
                    api_key: process.env.CLOUD_API_KEY,
                    api_secret: process.env.CLOUD_API_SECRET
                })
                
                await cloudinary.v2.uploader.upload(pickupInfo.image, {folder: 'grab-my-garbage'}, (err, result) =>{
                    if(err) 
                        throw err
                    else
                        photo = result.secure_url   
                })
            } else {
                photo = null
            }

            let locations = []
            locations.push(result)

            const newPickup = new SpecialPickup({
                location: locations,
                datetime: pickupInfo.datetime,
                category: pickupInfo.category,
                weight: pickupInfo.weight,
                image: photo,
                payment: '320',
                paymentMethod: 'Cash',
                customerId: id,
            })

            await newPickup.save()

            const user = await Users.findById(id)

            res.status(201).json({
                _id: newPickup._id,
                location: newPickup.location,
                datetime: newPickup.datetime,
                category: newPickup.category,
                weight: newPickup.weight,
                image: newPickup.image,
                payment: newPickup.payment,
                paymentMethod: newPickup.paymentMethod,
                customerId: user
            })

        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    addScheduledPickup: async(req, res) => {
        try{
            let requests = []
            let results

            const {pickupInfo, id, result} = req.body
            const date1 = pickupInfo.from.split('T')[0]
            const date2 = pickupInfo.to.split('T')[0]
            const service_city = await isPointInPolygon(result.latitude, result.longitude, polygonData)

            const hauler = await Haulers.find({service_city: service_city})
            const user = await Users.findById(id)

            let locations = []
            locations.push(result)

            if(hauler.length > 0) {
                for(let n=0; n<hauler.length; n++) {
                    const pickup = await SchedulePickup.find({pickerId: hauler[n]._id, cancelled: 0, days: {$in: pickupInfo.days}, completed: 0})
                    if(pickup.length > 0) {
                        for(let i=0; i<pickup.length; i++){
                            if(pickup[i].timeslot === pickupInfo.time) {
                                const index = await requests.find(pick => pick.hauler === hauler[n]._id)
                                const pick = await requests.splice((pick => pick.hauler === hauler[n]._id), 1)[0]
                                if(index) {
                                    pick.pickup.push(pickup[i])
                                    pick.on += 1
                                    requests.push(pick)
                                } else {
                                    requests.push({
                                        hauler: hauler[n]._id,
                                        limit: hauler[n].limit,
                                        pickup: [pickup[i]],
                                        on: 1
                                    })
                                }                   
                            }
                        }
                    }
                }
            }

            if(!results) {
                const item = hauler[Math.floor(Math.random()*hauler.length)]
                results = item._id
            }

            if(requests.length > 0) {
                for(let n=0; n<requests.length; n++) {
                    if(requests[n].pickup.length <= requests[n].limit) {
                        results = requests[n].hauler
                    }
                }
            }
   
            const newPickup = new SchedulePickup({
                location: locations,
                from: date1,
                to: date2,
                days: pickupInfo.days,
                timeslot: pickupInfo.timeslot,
                payment: '400',
                paymentMethod: 'Cash',
                customerId: id,
                pickerId: results
            })

            await newPickup.save()

            res.status(201).json({
                _id: newPickup._id,
                location: newPickup.location,
                from: newPickup.from,
                to: newPickup.to,
                days: newPickup.days,
                timeslot: newPickup.timeslot,
                payment: newPickup.payment,
                paymentMethod: newPickup.paymentMethod,
                pickerId: newPickup.pickerId,
                customerId: user
            })

        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

const createAccessToken = (user) => {
    return jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}

const isPointInPolygon = (latitude, longitude, polygon) => {
    const point = turf.point([longitude, latitude])
    for(let i = 0; i < polygon.length; i++) {
        const value = turf.booleanPointInPolygon(point, turf.polygon([polygon[i].coordinates]))
        if(value === true) {
            return polygon[i].name
        }
    }
}

module.exports = userController