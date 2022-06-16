const scheduledPickups = require('../../models/scheduledPickupModel')
const Haulers = require('../../models/haulerModel')

const requestController = {
    getScheduledPickupforToday: async(req, res) => {
        try{
            let requests = []

            const pickerId = req.params.id
            const date = new Date()
            const day = dayFinder(date.getDay())

            const request = await scheduledPickups.find({ pickerId, from: {$lte: date.toISOString()}, to: {$gte: date.toISOString()}, days: {$in: [day]}, cancelled: 0 }).populate('customerId')
            if(!request) return res.status(400).json({msg: 'No Pickup is available.'})
            
            for(let i=0; i<request.length; i++){
                let status = false
                if(request[i].completedPickups.length > 0) {
                    for(let j=0; j<request[i].completedPickups.length; j++){
                        if(request[i].completedPickups[j].date === date.toISOString().split('T')[0]){
                            status = true
                        }
                    }
                    if(status === false) {
                        requests.push(request[i])
                    }
                } else {
                    requests.push(request[i])
                }    
            }

            res.status(200).json(requests)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    completeScheduledPickupforToday: async(req, res) => {
        try{
            const { completedDate, completedHauler } = req.body
            
            const date = completedDate.split('T')[0]

            const request = await scheduledPickups.findById(req.params.id)
            if(!request) return res.status(400).json({msg: 'No Pickup is available.'})
            
            request.completedPickups.push({date, completedHauler})
            await request.save()

            res.status(200).json({
                message: 'pickup completed'
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getScheduledPickupToCollect: async(req, res) => {
        try{
            let requests = []

            const pickerId = req.params.id
            const lat = req.params.lat
            const lng = req.params.lng

            const date = new Date()
            const day = dayFinder(date.getDay())

            const request = await scheduledPickups.find({ pickerId, from: {$lte: date.toISOString()}, to: {$gte: date.toISOString()}, days: {$in: [day]}, cancelled: 0, inactive: 0 }).populate('customerId')
            if(!request) return res.status(400).json({msg: 'No Pickup is available.'})
            
            for(let i=0; i<request.length; i++){
                let status = false

                if(timeDiff(request[i].timeslot) === true) {
                    if(request[i].completedPickups.length > 0) {
                        for(let j=0; j<request[i].completedPickups.length; j++){
                            if(request[i].completedPickups[j].date === date.toISOString().split('T')[0]){
                                status = true
                            }
                        }
                        if(status === false) {
                            requests.push(request[i])
                        }
                    } else {
                        requests.push(request[i])
                    }
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
    activePickup: async(req, res) => {
        try {
            const pickups = await scheduledPickups.findById(req.params.id)
            if(!pickups) return res.status(400).json({msg: 'No Pickup is available.'})

            pickups.active = 1
            await pickups.save()

            res.status(200).json({
                message: 'success'
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    inactivePickup: async(req, res) => {
        try {
            const pickups = await scheduledPickups.findById(req.params.id)
            if(!pickups) return res.status(400).json({msg: 'No Pickup is available.'})

            pickups.active = 0
            await pickups.save()

            res.status(200).json({
                message: 'success'
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getAllScheduledPickup: async(req, res) => {
        try{
            const pickerId = req.params.id
            const date = new Date()

            const request = await scheduledPickups.find({ pickerId, from: {$lte: date.toISOString()}, to: {$gte: date.toISOString()}, cancelled: 0, inactive: 0 }).populate('customerId')
            if(!request) return res.status(400).json({msg: 'No Pickup is available.'}) 

            res.status(200).json(request)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

const dayFinder = (date) => {
    if(date === 0) {
        return 'Sunday'
    } else if(date === 1) {
        return 'Monday'
    } else if(date === 2) {
        return 'Tuesday'
    } else if(date === 3) {
        return 'Wednesday'
    } else if(date === 4) {
        return 'Thursday'
    } else if(date === 5) {
        return 'Friday'
    } else if(date === 6) {
        return 'Saturday'
    }
}

const timeDiff = (time) => {
    const time1 = new Date().toISOString().split('T')[1]

    let timeA = parseInt((time1.split('.')[0]).split(':')[0]) + 5
    const timeE = parseInt((time1.split('.')[0]).split(':')[1]) + 30
    if(timeE >= 60) {
        timeA = timeA + 1
    }

    let startTime = (time.split('-')[0]).split(' ')[0]
    let endTime = parseInt((time.split('-')[1]).split(' ')[1])

    const ampmStartTime = (time.split('-')[0]).split(' ')[2]
    const ampmEndTime = (time.split('-')[1]).split(' ')[2]

    if(ampmStartTime === 'P.M') {
        startTime = parseInt(startTime) + 12
    }
    if(ampmEndTime === 'P.M' && endTime !== '12') {
        endTime = parseInt(endTime) + 12
    }
    if(parseInt(timeA) <= endTime && startTime <= parseInt(timeA))
        return true
    else 
        return false
}

const getLatngDiffInMeters = (lat1, lng1, lat2, lng2) => {
    let R = 6371 //Radius of earth
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