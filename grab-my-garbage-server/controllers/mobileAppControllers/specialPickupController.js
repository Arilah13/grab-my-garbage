const Pickups = require('../../models/specialPickupModel')
const cloudinary = require('cloudinary')
const haulers = require('../../models/haulerModel')
const polygonData = require('../../helpers/polygonData')
const turf = require('@turf/turf')
var io = require('socket.io-client')
// var socket = io.connect('https://grab-my-garbage-socket.herokuapp.com/', {
//     reconnection: true
// })
var socket = io.connect('http://192.168.13.1:5001', {
    reconnection: true
})

const schedule = require('node-schedule')
const { Expo } = require('expo-server-sdk')

const pickupController = {
    addSpecialPickup: async(req, res) => {
        try{
            const {pickupInfo, total, method, id} = req.body

            let photo

            if(pickupInfo.photo !== null && pickupInfo.photo !== '') {
                cloudinary.config({
                    cloud_name: process.env.CLOUD_NAME,
                    api_key: process.env.CLOUD_API_KEY,
                    api_secret: process.env.CLOUD_API_SECRET
                })
                
                await cloudinary.v2.uploader.upload('data:image/png;base64,' + pickupInfo.photo, {folder: 'grab-my-garbage'}, (err, result) =>{
                    if(err) 
                        throw err
                    else
                        photo = result.secure_url   
                })
            } else {
                photo = null
            }

            const service_city = await isPointInPolygon(pickupInfo.location.latitude, pickupInfo.location.longitude, polygonData)
            const hauler = await haulers.find({service_city: service_city})

            const newPickup = new Pickups({
                location: pickupInfo.location,
                datetime: pickupInfo.date,
                category: pickupInfo.category,
                weight: pickupInfo.solid_weight,
                image: photo,
                payment: total,
                paymentMethod: method,
                customerId: id,
                pickerId: hauler[0]._id
            })

            const hour = (pickupInfo.date.split('T')[1]).split(':')[0]
            const minute = (pickupInfo.date.split('T')[1]).split(':')[1]
            const year = (pickupInfo.date.split('T')[0]).split('-')[0]
            const month = (pickupInfo.date.split('T')[0]).split('-')[1]
            const day = (pickupInfo.date.split('T')[0]).split('-')[2]

            const mon1 = parseInt(month) - 1
            const day1 = parseInt(day) + 1
            const hour1 = parseInt(hour) - 18
            const minute1 = parseInt(minute) - 27

            const date = new Date(year,  mon1, day1, hour1, minute1, 0)
            
            await newPickup.save()

            schedule.scheduleJob(date, async() => {
                const result = await findPickup(newPickup._id)
                if(result === true) {
                    await cancelPickup(newPickup._id)
                    socket.emit('pickupCancel', {id: newPickup._id, hauler: hauler, userid: id})
                }
            })

            res.status(201).json({
                _id: newPickup._id,
                location: newPickup.location,
                datetime: newPickup.datetime,
                category: newPickup.category,
                weight: newPickup.weight,
                image: newPickup.image,
                payment: newPickup.payment,
                paymentMethod: newPickup.paymentMethod,
            })

        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getPendingPickups: async(req, res) => {
        try{
            const customerId = req.params.id
            const pickups = await Pickups.find({ customerId, accepted: 0, cancelled: 0, completed: 0 })
            if(!pickups) return res.status(400).json({msg: 'No Pickup is available.'})

            res.status(200).json(pickups)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getAcceptedPickups: async(req, res) => {
        try{
            const customerId = req.params.id
            const pickups = await Pickups.find({ customerId, accepted: 1, cancelled: 0, completed: 0 }).populate('pickerId')
            if(!pickups) return res.status(400).json({msg: 'No Pickup is available.'})

            res.status(200).json(pickups)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getCompletedPickups: async(req, res) => {
        try{
            const customerId = req.params.id
            const pickups = await Pickups.find({ customerId, accepted: 1, cancelled: 0, completed: 1 }).populate('pickerId')
            if(!pickups) return res.status(400).json({msg: 'No Pickup is available.'})

            res.status(200).json(pickups)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    cancelPickup: async(req, res) => {
        try{
            const pickups = await Pickups.findById(req.params.id)
            if(!pickups) return res.status(400).json({msg: 'No Pickup is available.'})

            pickups.cancelled = 1
            await pickups.save()

            res.status(200).json({message: 'Specialpickup Cancel'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

const findPickup = async(id) => {
    const pickups = await Pickups.findById(id)
    if(pickups.accepted === 1) {
        return false
    } else if(pickups.accepted === 0) {
        return true
    }
}

const cancelPickup = async(id) => {
    const pickups = await Pickups.findById(id)
    pickups.cancelled = 1
    await pickups.save()
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

module.exports = pickupController