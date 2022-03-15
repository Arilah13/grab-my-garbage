const ScheduledPickups = require('../../models/scheduledPickupModel')
const Haulers = require('../../models/haulerModel')
const polygonData = require('../../helpers/polygonData')
const turf = require('@turf/turf')

const scheduledPickupController = {
    addScheduledPickup: async(req, res) => {
        try{
            const {pickupInfo, total, method, id} = req.body
            const date1 = pickupInfo.from.split('T')[0]
            const date2 = pickupInfo.to.split('T')[0]

            const service_city = await isPointInPolygon(pickupInfo.location.latitude, pickupInfo.location.longitude, polygonData)

            const hauler = await Haulers.find({service_city: service_city})

            const newPickup = new ScheduledPickups({
                location: pickupInfo.location,
                from: date1,
                to: date2,
                days: pickupInfo.days,
                timeslot: pickupInfo.time,
                payment: total,
                paymentMethod: method,
                customerId: id,
                pickerId: hauler._id
            })

            await newPickup.save()

            res.status(201).json({
                _id: newPickup._id,
                location: newPickup.location,
                from: newPickup.from,
                to: newPickup.to,
                days: newPickup.days,
                time: newPickup.timeslot,
                payment: newPickup.payment,
                paymentMethod: newPickup.paymentMethod,
            })

        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getSchedulePickup: async(req, res) => {
        try{
            const customerId = req.params.id
            const pickups = await ScheduledPickups.find({ customerId, completed: 0 })
            if(!pickups) return res.status(400).json({msg: 'No Pickup is available.'})

            res.status(200).json(pickups)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

const isPointInPolygon = (latitude, longitude, polygon) => {
    console.log(latitude)
    const point = turf.point([longitude, latitude])
    for(let i = 0; i < polygon.length; i++) {
        const value = turf.booleanPointInPolygon(point, turf.polygon([polygon[i].coordinates]))
        if(value === true) {
            return polygon[i].name
        }
    }
}

module.exports = scheduledPickupController