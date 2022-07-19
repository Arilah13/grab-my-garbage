const turf = require('@turf/turf')
const ScheduledPickups = require('../../models/scheduledPickupModel')
const Haulers = require('../../models/haulerModel')
const polygonData = require('../../helpers/polygonData')

const scheduledPickupController = {
    addScheduledPickup: async(req, res) => {
        try{
            let requests = []
            let results

            const {pickupInfo, total, method, id} = req.body
            const date1 = pickupInfo.from.split('T')[0]
            const date2 = pickupInfo.to.split('T')[0]

            const service_city = await isPointInPolygon(pickupInfo.location.latitude, pickupInfo.location.longitude, polygonData)
            
            const hauler = await Haulers.find({service_city: service_city})
            
            if(hauler.length > 0) {
                for(let n=0; n<hauler.length; n++) {
                    const pickup = await ScheduledPickups.find({pickerId: hauler[n]._id, cancelled: 0, days: {$in: pickupInfo.days}, completed: 0})
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
                                        haulerDetail: hauler[n],
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
            
            if(requests.length > 0) {
                for(let n=0; n<requests.length; n++) {
                    if(requests[n].pickup.length <= requests[n].limit) {
                        results = requests[n].haulerDetail
                    }
                }
            }

            if(!results) {
                const item = hauler[Math.floor(Math.random()*hauler.length)]
                results = item
            }
   
            const newPickup = new ScheduledPickups({
                location: pickupInfo.location,
                from: date1,
                to: date2,
                days: pickupInfo.days,
                timeslot: pickupInfo.time,
                payment: total,
                paymentMethod: method,
                customerId: id,
                pickerId: results
            })

            await newPickup.save()

            const haulerId = await Haulers.findById(results)
            haulerId.notification.push({
                id: newPickup._id,
                date: new Date(),
                description: 'You have been assigned a new schedule pickup',
                data: {item: newPickup},
                haulerVisible: true
            })

            haulerId.save()

            res.status(201).json({
                _id: newPickup._id,
                location: newPickup.location,
                from: newPickup.from,
                to: newPickup.to,
                days: newPickup.days,
                timeslot: newPickup.timeslot,
                payment: newPickup.payment,
                paymentMethod: newPickup.paymentMethod,
                customerId: newPickup.customerId,
                pickerId: newPickup.pickerId,
                completed: newPickup.completed,
                completedPickups: newPickup.completedPickups,
                createdAt: newPickup.createdAt,
                updatedAt: newPickup.updatedAt,
                __v: newPickup.__v,
                cancelled: newPickup.cancelled,
                inactive: newPickup.inactive,
                active: newPickup.active
            })

        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getSchedulePickup: async(req, res) => {
        try{
            const customerId = req.params.id
            const pickups = await ScheduledPickups.find({ customerId, completed: 0, cancelled: 0 }).populate('pickerId')
            if(!pickups) return res.status(400).json({msg: 'No Pickup is available.'})

            res.status(200).json(pickups)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    inactiveSchedulePickup: async(req, res) => {
        try{
            const pickups = await ScheduledPickups.findById(req.params.id)
            if(!pickups) return res.status(400).json({msg: 'No Pickup is available.'})
            
            pickups.inactive = 1
            await pickups.save()

            res.status(200).json({msg: 'Schedulepickup Inactive'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    activeSchedulePickup: async(req, res) => {
        try{
            const pickups = await ScheduledPickups.findById(req.params.id)
            if(!pickups) return res.status(400).json({msg: 'No Pickup is available.'})
            
            pickups.inactive = 0
            await pickups.save()

            res.status(200).json({msg: 'Schedulepickup Active'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    cancelSchedulePickup: async(req, res) => {
        try{
            const pickups = await ScheduledPickups.findById(req.params.id)
            if(!pickups) return res.status(400).json({msg: 'No Pickup is available.'})

            pickups.cancelled = 1
            await pickups.save()

            res.status(200).json({msg: 'SchedulePickup Cancel'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    }
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

module.exports = scheduledPickupController