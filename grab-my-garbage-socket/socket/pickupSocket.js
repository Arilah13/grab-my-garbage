const axios = require('axios')

let haulers = []
let users = []
let ongoingSpecialPickups = []
let ongoingScheduledPickups = []

const pickupSocket = {
    haulerJoin: async({id, haulerid, latitude, longitude, heading}) => {
        const hauler = {id, haulerid, latitude, longitude, heading}
        const exist = await haulers.find((hauler) => hauler.haulerid === haulerid)

        if(!exist) {
            haulers.push(hauler)
        } else {
            haulers.splice(haulers.findIndex(hauler => hauler.haulerid === haulerid), 1)
            haulers.push(hauler)
        }

        return hauler
    },
    userJoin: async({id, userid}) => {
        const user = {id, userid}
        const exist = await users.find((user) => user.userid === userid)

        if(!exist) {
            users.push(user)
        } else if(exist) {
            users.splice(users.findIndex(user => user.userid === userid), 1)
            users.push(user)
        }
    },
    findHaulers: async({latitude, longitude}) => {
        let nearbyhaulers = []

        haulers.map((hauler) => {
            if(getLatngDiffInMeters(hauler.latitude, hauler.longitude, latitude, longitude) <= 25)
                nearbyhaulers.push(hauler.id)
        })

        return nearbyhaulers
    },
    pickupOnProgress: async({haulerid, pickupid, userid}) => {
        const ongoingPickup = {userid, haulerid, pickupid}
        const exist = await ongoingSpecialPickups.find((ongoingPickup) => ongoingPickup.pickupid === pickupid)

        if(!exist)
            ongoingSpecialPickups.push(ongoingPickup)
    
        return ongoingPickup
    },
    scheduledPickupOnProgress: async({haulerid, ongoingPickup, pickup}) => {
        const scheduledOngoingPickup = {haulerid, ongoingPickup, pickup}
        const exist = await ongoingScheduledPickups.find((ongoingScheduledPickup) => ongoingScheduledPickup.haulerid === haulerid)

        if(!exist)
            ongoingScheduledPickups.push(scheduledOngoingPickup)

        return scheduledOngoingPickup
    },
    checkOngoingPickup: async({userid}) => {
        const ongoingPickup = await ongoingSpecialPickups.find((ongoingPickup) => ongoingPickup.userid === userid)

        if(ongoingPickup)
            return ongoingPickup
    },
    checkOngoingScheduledPickup: async({userid}) => {
        const ongoingScheduledPickup = ongoingScheduledPickups.map(async(ongoingScheduledPickup) => {
            let send = false

            await ongoingScheduledPickup.pickup.map((pickup) => {
                if (pickup.customerId._id === userid)
                    send = true
            })

            if(send === true)
                return ongoingScheduledPickup
        })
        
        if(ongoingScheduledPickup)
            return Promise.all(ongoingScheduledPickup)
    },
    returnHaulerLocation: async({haulerid}) => {
        const hauler = await haulers.find((hauler) => hauler.haulerid === haulerid)
        
        if(hauler) 
            return hauler
    },
    returnDestinationtime: async({haulerid, pickup}) => {
        const hauler = await haulers.find((hauler) => hauler.haulerid === haulerid)
        const time = await getTime(hauler, pickup.location[0])

        return {time, id: pickup._id}
    },
    returnOngoingSchedulePickup: async({haulerid}) => {
        const ongoingScheduledPickup = await ongoingScheduledPickups.find((ongoingScheduledPickup) => {
            return ongoingScheduledPickup.haulerid === haulerid
        })
        
        const ongoingPickup = ongoingScheduledPickup.ongoingPickup
        
        return ongoingPickup
    },
    findPickupOnProgress: async({haulerid}) => {
        const ongoingPickup = await ongoingSpecialPickups.find((ongoingPickup) => ongoingPickup.haulerid === haulerid)

        if(ongoingPickup)
            return ongoingPickup
    },
    findScheduledPickupOnProgress: async({haulerid}) => {
        const ongoingPickup = await ongoingScheduledPickups.find((ongoingScheduledPickup) => ongoingScheduledPickup.haulerid === haulerid)

        if(ongoingPickup)
            return ongoingPickup
    },
    returnUserSocketid: async({userid}) => {
        const user = await users.find((user) => user.userid === userid)

        if(user)
            return user.id
    },
    returnUserSchedulePickupDetails: async({haulerid, hauler}) => {
        const ongoingScheduledPickup = await ongoingScheduledPickups.find((ongoingScheduledPickup) => ongoingScheduledPickup.haulerid === haulerid)

        const data = await ongoingScheduledPickup.pickup.map(async(pickup) => {
            const socketId = await returnUserSocketid({userid: pickup.customerId._id})
            const time = await getTime(hauler, pickup.location[0])
            const data = {socketId, time, haulerid, id: pickup._id, ongoingPickup: ongoingScheduledPickup.pickup[0]._id, userid: pickup.customerId._id}

            return data
        })
        
        return await Promise.all(data)
    },
    completeSpecialPickup: async({pickupid}) => {
        const ongoingPickup = await ongoingSpecialPickups.find((ongoingPickup) => ongoingPickup.pickupid === pickupid)
        const userid = await ongoingPickup.userid
        const userSocketid = await users.find((user) => user.userid === userid)

        ongoingSpecialPickups.splice(ongoingSpecialPickups.findIndex(ongoingPickup => ongoingPickup.pickupid === pickupid), 1)

        return userSocketid
    },
    completeSchedulePickup: async({haulerid}) => {
        ongoingScheduledPickups.splice(ongoingScheduledPickups.findIndex(ongoingScheduledPickup => ongoingScheduledPickup.haulerid === haulerid), 1)
    },
    haulerDisconnect: async({id}) => {
        haulers.splice(haulers.findIndex(hauler => hauler.id === id), 1)
    },
    removeUser: async({id}) => {
        const usersList = await users.find((user) => user.id === id)
        const haulerList = await haulers.find((hauler) => hauler.id === id)
        
        if(usersList) {
            users = users.filter(user => user.id !== id)
        } else if(haulerList) {
            haulers = haulers.filter(hauler => hauler.id !== id)
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

const returnUserSocketid = async({userid}) => {
    const user = users.find((user) => user.userid === userid)
    if(user)
        return user.id
    else 
        return false
}

const getTime = async(hauler, location) => {
    const startlatitude = hauler.latitude
    const startlongitude = hauler.longitude

    const endlatitude = location.latitude
    const endlongitude = location.longitude

    const { data } = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${startlatitude},${startlongitude}&destinations=${endlatitude},${endlongitude}&key=${process.env.GOOGLE_MAPS}`)

    return data.rows[0].elements[0].duration.value
}

module.exports = pickupSocket