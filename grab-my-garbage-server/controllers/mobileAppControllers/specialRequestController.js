const schedule = require('node-schedule')
const { Expo } = require('expo-server-sdk')

const Pickups = require('../../models/specialPickupModel')
const Haulers = require('../../models/haulerModel')
const Users = require('../../models/userModel')

let expo = new Expo({})

const requestController = {
    getPendingOfflinePickups: async(req, res) => {
        try{
            const id = req.params.id

            const request = await Pickups.find({accepted: 0, cancelled: 0, completed: 0, declinedHaulers: {$nin: {id: id}}, areaHaulers: {$in: {_id: id}} }).populate('customerId')
            if(!request) return res.status(400).json({msg: 'No Pickup is available.'})

            res.status(200).json(request)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUpcomingPickups: async(req, res) => {
        try{
            const id = req.params.id

            const request = await Pickups.find({accepted: 1, cancelled: 0, completed: 0, pickerId: id}).populate('customerId')
            if(!request) return res.status(400).json({msg: 'No Pickup is available.'})

            res.status(200).json(request)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getCompletedPickups: async(req, res) => {
        try{
            const id = req.params.id

            const request = await Pickups.find({accepted: 1, cancelled: 0, completed: 1, pickerId: id, haulerVisible: true}).populate('customerId')
            if(!request) return res.status(400).json({msg: 'No Pickup is available.'})

            res.status(200).json(request)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateDeclinedHauler: async(req, res) => {
        try{
            const haulerId = req.body

            const request = await Pickups.findById(req.params.id)
            if(!request) return res.status(400).json({msg: 'No Pickup is available.'})

            await request.declinedHaulers.push(haulerId)

            if(request.areaHaulers.length === request.declinedHaulers.length) {
                request.cancelled = 1
                const user = await Users.findById(request.customerId)
                await user.notification.push({
                    description: 'Your special pickup has been cancelled',
                    data: request,
                    userVisible: true,
                    seen: false
                })
                await user.save()
            }

            await request.save()

            res.status(200).json({msg: 'Specialpickup Declined'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateAcceptHauler: async(req, res) => {
        try{
            const haulerId = req.body.haulerId

            const request = await Pickups.findById(req.params.id)
            if(!request) return res.status(400).json({msg: 'No Pickup is available.'})
            
            const hauler = await Haulers.findById(haulerId)
            
            request.pickerId = haulerId
            request.accepted = 1

            const hour = (request.datetime.split('T')[1]).split(':')[0]
            const minute = (request.datetime.split('T')[1]).split(':')[1]
            const year = (request.datetime.split('T')[0]).split('-')[0]
            const month = (request.datetime.split('T')[0]).split('-')[1]
            const day = (request.datetime.split('T')[0]).split('-')[2]

            const month1 = parseInt(month) - 1
            const day1 = parseInt(day)
            const hour1 = parseInt(hour) - 3
            const minute1 = parseInt(minute) - 14

            const date = new Date(year,  month1, day1, hour1, minute1, 0)
 
            specialPickupNotify(date, hauler.pushId, request)

            await request.save()
            
            const user = await Users.findById(request.customerId)
            await user.notification.push({
                description: 'Your special pickup has been accepted',
                data: request,
                userVisible: true,
                seen: false
            })
            await user.save()

            res.status(200).json({msg: 'Specialpickup Accepted'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateCompletedPickup: async(req, res) => {
        try{
            const {date} = req.body

            const request = await Pickups.findById(req.params.id)
            if(!request) return res.status(400).json({msg: 'No Pickup is available.'})

            request.completed = 1
            request.active = 0
            request.completedDate = date
            await request.save()

            const user = await Users.findById(request.customerId)
            await user.notification.push({
                description: 'Your special pickup has been completed',
                data: request,
                userVisible: true,
                seen: false
            })
            await user.save()

            res.status(200).json({msg: 'Specialpickup Completed'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    excludePickup: async(req, res) => {
        try {
            const pickups = await Pickups.findById(req.params.id)
            if(!pickups) return res.status(400).json({msg: 'No Pickup is available.'})

            pickups.inactive = 1
            await pickups.save()

            res.status(200).json({msg: 'Specialpickup Exclude'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    includePickup: async(req, res) => {
        try {
            const pickups = await Pickups.findById(req.params.id)
            if(!pickups) return res.status(400).json({msg: 'No Pickup is available.'})

            pickups.inactive = 0
            await pickups.save()

            res.status(200).json({msg: 'Specialpickup Include'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    activePickup: async(req, res) => {
        try {
            const pickups = await Pickups.findById(req.params.id)
            if(!pickups) return res.status(400).json({msg: 'No Pickup is available.'})

            pickups.active = 1
            await pickups.save()

            const user = await Users.findById(pickups.customerId)
            await user.notification.push({
                description: 'Hauler is on the way to collect your special pickup',
                data: pickups,
                userVisible: true,
                seen: false
            })
            await user.save()

            res.status(200).json({msg: 'Specialpickup Active'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUpcomingPickupsToCollect: async(req, res) => {
        try{
            let requests = []

            const id = req.params.id
            const lat = req.params.lat
            const lng = req.params.lng
 
            const request = await Pickups.find({accepted: 1, cancelled: 0, completed: 0, pickerId: id, inactive: 0}).populate('customerId')
            if(!request) return res.status(400).json({msg: 'No Pickup is available.'})

            for(let i=0; i<request.length; i++){
                if(new Date(request[i].datetime).getTime() <= new Date().getTime() && new Date(new Date(request[i].datetime).getTime() + 24*60*60*1000).getTime() >= new Date().getTime()) {
                    requests.push(request[i])
                }
            }

            const pickupOrder = requests.sort((pickup_1, pickup_2) => 
                getLatngDiffInMeters(pickup_1.location[0].latitude, pickup_1.location[0].longitude, lat, lng) > 
                getLatngDiffInMeters (pickup_2.location[0].latitude, pickup_2.location[0].longitude, lat, lng) ? 
                1 : -1)

            res.status(200).json(pickupOrder)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deletePickup: async(req, res) => {
        try{
            const pickup = await Pickups.findById(req.params.id)
            if(!pickup) return res.status(400).json({msg: 'No Pickup is available.'})

            pickup.haulerVisible = false
            await pickup.save()

            res.status(200).json({msg: 'Specialpickup Removed'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

const specialPickupNotify = (date, pushId, pickup) => {
    schedule.scheduleJob(date, async() => {
        let messages = []

        pushId.map(push => {
            messages.push({
                to: push,
                sound: 'default',
                title: 'Schedule Pickup',
                body: 'Check your schedule for Special Pickup',
                data: { 
                    screen: 'PickupDetail',
                    item: pickup,
                }
            })
        })

        let chunks = expo.chunkPushNotifications(messages)

        for (let chunk of chunks) {
            try{
                await expo.sendPushNotificationsAsync(chunk)
            } catch (error) {
                console.log(error)
            }
        }
    })
}

const getLatngDiffInMeters = (lat1, lng1, lat2, lng2) => {
    let R = 6371
    let diffLat = degtorad(lat2-lat1)
    let diffLon = degtorad(lng1-lng2)
    let a = Math.sin(diffLat/2) * Math.sin(diffLat/2) +
            Math.cos(degtorad(lat1)) * Math.cos(degtorad(lat2)) *
            Math.sin(diffLon/2) * Math.sin(diffLon/2)
    
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    let d = R * c
    return d
}

const degtorad = (deg) => {
    return deg * (Math.PI/180)
}

module.exports = requestController