import * as Location from 'expo-location'

const checkPermission = async() => {
    const hasPermission = await Location.requestForegroundPermissionsAsync()
    const hasBackgroundPermission = await Location.requestBackgroundPermissionsAsync()
    if(hasPermission.status !== 'granted') {
        const permission = await askPermission()
        
        return permission
    }
    if(hasBackgroundPermission !== 'granted') {
        const permission = await askBackgroundPermission()

        return permission
    }
    return true
};

const askPermission = async() => {
    const permission = await Location.requestForegroundPermissionsAsync()
    return permission.status === 'granted'
}

const askBackgroundPermission = async() => {
    const permission = await Location.requestBackgroundPermissionsAsync()
    return permission.status === 'granted'
}

export const getLocation = async() => {
    try{
        checkPermission()
        const {granted} = await Location.requestForegroundPermissionsAsync()
        if(!granted) return
    } catch(err){
        console.log(err)
    }
}

export const getLatngDiffInMeters = (lat1, lng1, lat2, lng2) => {
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

export const returnDate = (pickupDate) => {
    var date = new Date(pickupDate).getTime()
    var dateStamp = date/1000
    var timeStamp = new Date().getTime()
    var dateTimeStampTomorrow = new Date((dateStamp + (24 * 3600)) * 1000).getTime()
    if(timeStamp >= date && timeStamp <= dateTimeStampTomorrow)
        return true
    else 
        return false
} 

export const timeHandle = async(pickup) => {
    const filteredPickupOrder = await pickup.filter(pickup => {
        return returnDate(pickup.datetime)
    })
    return filteredPickupOrder
}
