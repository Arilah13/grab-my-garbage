let haulers = []
let users = []

const pickupSocket = {
    haulerJoin: async({id, haulerid, latitude, longitude}) => {
        const hauler = {id, haulerid, latitude, longitude}
        const exist = haulers.find((hauler) => hauler.haulerid === haulerid)
        if(exist === undefined) {
            haulers.push(hauler)
        } else {
            haulers.splice(haulers.findIndex(hauler => hauler.haulerid === haulerid), 1)
            haulers.push(hauler)
        }
        return hauler
    },
    findHaulers: async({latitude, longitude}) => {
        let nearbyhaulers = []
        haulers.map((hauler) => {
            if(getLatngDiffInMeters(hauler.latitude, hauler.longitude, latitude, longitude) <= 25)
                nearbyhaulers.push(hauler.id)
        })
        return nearbyhaulers
    },
    haulerDisconnect: async({id}) => {
        haulers.splice(haulers.findIndex(hauler => hauler.id === id), 1)
    },
    pickupOnProgress: async({haulerid, pickupid, userid}) => {
        const user = users.find((user) => user.userid === userid)
        if(user) {
            const hauler = haulers.find((hauler) => hauler.haulerid === haulerid)
            return ({hauler, pickupid})
        }
    },
    userJoin: async({id, userid}) => {
        const user = {id, userid}
        const exist = users.find((user) => user.userid === userid)
        if(!exist) {
            users.push(user)
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

module.exports = pickupSocket