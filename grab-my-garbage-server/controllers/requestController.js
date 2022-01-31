const Pickups = require('../models/pickupModel')

const pickupController = {
    getPendingPickups: async(req, res) => {
        try{
            const lat = req.params.lat
            const lng = req.params.lng

            let pendingPickups = []

            const pickups = await Pickups.find({accepted: 0, cancelled: 0}).populate('customerId')
            if(!pickups) return res.status(400).json({msg: "No Pickup is available."})

            pickups.map(pickup => {
                if(getLatngDiffInMeters(lat, lng, pickup.location[0].latitude, pickup.location[0].longitude) <= 25)
                    pendingPickups.push(pickup)  
            })

            res.json(pendingPickups)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    }
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

module.exports = pickupController