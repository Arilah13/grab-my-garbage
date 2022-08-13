const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const schedule = require('node-schedule')
const { Expo } = require('expo-server-sdk')

const Haulers = require('../../models/haulerModel')

let expo = new Expo({})

const haulerController = {
    login: async(req, res) => {
        try {
            let dates = []

            const {email, password, pushId} = req.body       

            const hauler = await Haulers.findOne({email})
            if(!hauler) return res.status(400).json({msg: 'Hauler does not exist'})

            if(!hauler.password) return res.status(400).json({msg: 'Login Unsuccessful'})

            const isMatch = await bcrypt.compare(password, hauler.password)
            if(!isMatch) return res.status(400).json({msg: "Incorrect password"})

            const noti = await hauler.pushId.find(id => id === pushId)
                   
            if(!noti) {
                hauler.pushId.push(pushId)
                hauler.scheduleNotification = 0
                await hauler.save()
            }

            const accesstoken = createAccessToken(hauler._id)
            const refreshtoken = createRefreshToken(hauler._id)

            if(hauler.scheduleNotification === 0) {
                schedulePickupNotify(1, 30, hauler.pushId)
                schedulePickupNotify(2, 00, hauler.pushId)
                schedulePickupNotify(7, 30, hauler.pushId)
                schedulePickupNotify(8, 00, hauler.pushId)
                
                hauler.scheduleNotification = 1
                await hauler.save()
            }

            if(hauler.notification.length > 0) {
                for(let i=0; i<hauler.notification.length; i++) {
                    dates.push(hauler.notification[i].createdAt.toISOString().split('T')[0])
                }
            }
            dates.reverse()
            let uniqueDates = await getUnique(dates)

            let notifications = await getNotifications(uniqueDates, hauler)
            let result = false

            notifications.map(noti => {
                if(noti.data.length > 0) {
                    result = true
                }
            })

            res.status(200).json({
                _id: hauler._id,
                name: hauler.name,
                email: hauler.email,
                role: hauler.role,
                image: hauler.image,
                phone: hauler.phone,
                pushId: hauler.pushId,
                token: accesstoken,
                notification: result ? notifications : []
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    returnDetails: async(req, res) => {
        try{
            let dates = []
            
            const {email} = req.body

            const hauler = await Haulers.findOne({email})
            if(!hauler) return res.status(400).json({msg: 'Hauler does not exists.'})

            const accesstoken = createAccessToken(hauler._id)

            if(hauler.scheduleNotification === 0) {
                schedulePickupNotify(1, 30, hauler.pushId)
                schedulePickupNotify(2, 00, hauler.pushId)
                schedulePickupNotify(7, 30, hauler.pushId)
                schedulePickupNotify(8, 00, hauler.pushId)
                
                hauler.scheduleNotification = 1
                await hauler.save()
            }

            if(hauler.notification.length > 0) {
                for(let i=0; i<hauler.notification.length; i++) {
                    dates.push(hauler.notification[i].createdAt.toISOString().split('T')[0])
                }
            }
            dates.reverse()
            let uniqueDates = await getUnique(dates)

            let notifications = await getNotifications(uniqueDates, hauler)
            let result = false

            notifications.map(noti => {
                if(noti.data.length > 0) {
                    result = true
                }
            })

            res.status(200).json({
                _id: hauler._id,
                name: hauler.name,
                email: hauler.email,
                role: hauler.role,
                image: hauler.image,
                phone: hauler.phone,
                pushId: hauler.pushId,
                token: accesstoken,
                notification: result ? notifications : []
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateHaulerPassword: async(req, res) => {
        try{
            const hauler = await Haulers.findById(req.params.id)
            if(!hauler) return res.status(400).json({msg: 'Hauler does not exists.'})
            
            const password = req.body.password
            const passwordHash = await bcrypt.hash(password, 10)

            hauler.password = passwordHash

            await hauler.save()

            res.status(200).json({msg: 'Hauler updated'})  
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    removePushToken: async(req, res) => {
        try{
            const hauler = await Haulers.findById(req.params.id)
            if(!hauler) return res.status(400).json({msg: 'Hauler does not exists.'})

            await hauler.pushId.filter(pushId => pushId !== req.body.id)
            await hauler.save()

            res.status(200).json({msg: 'Pushtoken removed'})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    removeNotification: async(req, res) => {
        try{
            const hauler = await Haulers.findById(req.params.id)
            if(!hauler) return res.status(400).json({msg: 'Hauler does not exists.'})
            
            const index = await hauler.notification.findIndex(noti => noti._id.toString() === req.body.id)
            const notification = await hauler.notification.splice(index, 1)[0]
            notification.haulerVisible = false
            await hauler.notification.splice(index, 0, notification)
            
            await hauler.save()

            res.status(200).json({msg: 'Notification removed'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    readNotification: async(req, res) => {
        try{
            const hauler = await Haulers.findById(req.params.id)
            if(!hauler) return res.status(400).json({msg: 'Hauler does not exists.'})

            for(let n=0; n<hauler.notification.length; n++) {
                hauler.notification[n].seen = true
            }
            await hauler.save()

            res.status(200).json({msg: 'Notification seen'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    }    
}

const schedulePickupNotify = (hour, minute, pushId) => {
    const rule = new schedule.RecurrenceRule()
    rule.tz = 'Etc/UTC'
    rule.hour = hour
    rule.minute = minute

    schedule.scheduleJob(rule, async() => {
        let messages = []

        pushId.map(push => {
            messages.push({
                to: push,
                sound: 'default',
                title: 'Schedule Pickup',
                body: 'Check your schedule for Schedule Pickup',
                data: { 
                    screen: 'Schedule'
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

const createAccessToken = (user) => {
    return jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}

const createRefreshToken = (user) => {
    return jwt.sign({user}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

const getUnique = async(array) => {
    let uniqueArray = []

    for(let i=0; i<array.length; i++) {
        if(uniqueArray.length > 0) {
            let result = true
            for(let n=0; n<uniqueArray.length; n++) {
                if(array[i] === uniqueArray[n].date) {
                    result = false
                }
            }
            if(result === true) {
                uniqueArray.push({date: array[i], data: []})
            }
        } else {
            uniqueArray.push({date: array[i], data: []})
        }
    }

    return uniqueArray
}

const getNotifications = async(uniqueDates, hauler) => {
    for(let n=0; n<uniqueDates.length; n++) {
        for(let j=0; j<hauler.notification.length; j++) {
            if(hauler.notification[j].createdAt.toISOString().split('T')[0] === uniqueDates[n].date && hauler.notification[j].haulerVisible === true){
                uniqueDates[n].data.push({
                    description: hauler.notification[j].description,
                    id: hauler.notification[j]._id,
                    data: hauler.notification[j].data,
                    haulerVisible: hauler.notification[j].haulerVisible,
                    seen: hauler.notification[j].seen
                })
            }
        }
    }

    return uniqueDates
}

module.exports = haulerController