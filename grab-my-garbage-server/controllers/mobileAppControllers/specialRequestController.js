const Pickups = require('../../models/specialPickupModel')
const Haulers = require('../../models/haulerModel')

const requestController = {
    getPendingPickups: async(req, res) => {
        try{
            const lat = req.params.lat
            const lng = req.params.lng
            const id = req.params.id

            let pendingPickups = []

            const request = await Pickups.find({accepted: 0, cancelled: 0, completed: 0, declinedHaulers: {$nin:{id: id}}}).populate('customerId')
            if(!request) return res.status(400).json({msg: "No Pickup is available."})

            request.map(pickup => {
                if(getLatngDiffInMeters(lat, lng, pickup.location[0].latitude, pickup.location[0].longitude) <= 25)
                    pendingPickups.push(pickup)  
            })

            res.status(200).json(pendingPickups)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getPendingOfflinePickups: async(req, res) => {
        try{
            const id = req.params.id

            let pendingPickups = []

            const haulers = await Haulers.findById(id)
            const lat = haulers.location[0].latitude
            const lng = haulers.location[0].longitude

            const request = await Pickups.find({accepted: 0, cancelled: 0, completed: 0, declinedHaulers: {$nin:{id: id}}}).populate('customerId')
            if(!request) return res.status(400).json({msg: "No Pickup is available."})

            request.map(pickup => {
                if(getLatngDiffInMeters(lat, lng, pickup.location[0].latitude, pickup.location[0].longitude) <= 25)
                    pendingPickups.push(pickup)  
            })

            res.status(200).json(pendingPickups)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUpcomingPickups: async(req, res) => {
        try{
            const id = req.params.id

            const request = await Pickups.find({accepted: 1, cancelled: 0, completed: 0, pickerId: id}).populate('customerId')
            if(!request) return res.status(400).json({msg: "No Pickup is available."})

            res.status(200).json(request)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getCompletedPickups: async(req, res) => {
        try{
            const id = req.params.id

            const request = await Pickups.find({accepted: 1, cancelled: 0, completed: 1, pickerId: id}).populate('customerId')
            if(!request) return res.status(400).json({msg: "No Pickup is available."})

            res.status(200).json(request)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateDeclinedHauler: async(req, res) => {
        try{
            const haulerId = req.body

            const request = await Pickups.findById(req.params.id)
            if(!request) return res.status(400).json({msg: "No Pickup is available."})

            request.declinedHaulers.push(haulerId)
            await request.save()

            res.status(200).json({
                message: 'success'
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateAcceptHauler: async(req, res) => {
        try{
            const haulerId = req.body

            const request = await Pickups.findById(req.params.id)
            if(!request) return res.status(400).json({msg: "No Pickup is available."})

            request.pickerId = haulerId.id
            request.accepted = 1
            await request.save()

            res.status(200).json({
                message: 'success'
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateCompletedPickup: async(req, res) => {
        try{
            const {date} = req.body

            const request = await Pickups.findById(req.params.id)
            if(!request) return res.status(400).json({msg: "No Pickup is available."})

            request.completed = 1
            request.completedDate = date
            await request.save()

            res.status(200).json({
                message: 'success'
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    }
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