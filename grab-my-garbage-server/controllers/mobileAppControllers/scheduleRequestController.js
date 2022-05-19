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

            res.status(200).json(requests)
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

module.exports = requestController