const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary')

const Users = require('../../models/userModel')
const Schedule = require('../../models/scheduledPickupModel')
const Special = require('../../models/specialPickupModel')

const userController = {
    google: async(req, res) => {
        try{
            let dates = []
            
            const {name, email, registerrole, photoUrl, notification_token} = req.body

            const user = await Users.findOne({email}) 
            if(user) {
                const accesstoken = createAccessToken(user._id)

                const noti = await user.pushId.find(id => id === notification_token)
                   
                if(!noti) {
                    user.pushId.push(notification_token)
                    await user.save()
                }

                const scheduleCount = await Schedule.countDocuments({customerId: user._id})
                const specialCount = await Special.countDocuments({customerId: user._id})

                const schedule = await Schedule.find({customerId: user._id})
                const special = await Special.find({customerId: user._id})

                const count = scheduleCount + specialCount

                if(user.notification.length > 0) {
                    for(let i=0; i<user.notification.length; i++) {
                        dates.push(user.notification[i].createdAt.toISOString().split('T')[0])
                    }
                }
                dates.reverse()
                let uniqueDates = await getUnique(dates)
    
                let notifications = await getNotifications(uniqueDates, user)
                let result = false

                notifications.map(noti => {
                    if(noti.data.length > 0) {
                        result = true
                    }
                })

                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    image: user.image,
                    count: count,
                    schedule: schedule,
                    special: special,
                    pushId: user.pushId,
                    notification: result ? notifications : [],
                    token: accesstoken
                })
            } else {
                const newUser = new Users({
                    name: name,
                    email: email,
                    role: registerrole === 'user' ? 0 : 1,
                    image: photoUrl,
                    pushId: notification_token
                })

                await newUser.save()

                const accesstoken = createAccessToken(newUser._id)

                const scheduleCount = await Schedule.countDocuments({customerId: newUser._id})
                const specialCount = await Special.countDocuments({customerId: newUser._id})

                const schedule = await Schedule.find({customerId: newUser._id})
                const special = await Special.find({customerId: newUser._id})

                const count = scheduleCount + specialCount

                res.status(200).json({
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    image: newUser.image,
                    count: count,
                    schedule: schedule,
                    special: special,
                    pushId: newUser.pushId,
                    token: accesstoken
                })
            }

        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    facebook: async(req, res) => {
        try{
            const {name, email, registerrole, notification_token} = req.body

            const user = await Users.findOne({email}) 
            if(user) {
                const accesstoken = createAccessToken(user._id)

                if(user.pushId !== notification_token) {
                    user.pushId = notification_token
                    await user.save()
                }

                const scheduleCount = await Schedule.countDocuments({customerId: user._id})
                const specialCount = await Special.countDocuments({customerId: user._id})

                const schedule = await Schedule.find({customerId: user._id})
                const special = await Special.find({customerId: user._id})

                const count = scheduleCount + specialCount

                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    pushId: user.pushId,
                    count: count,
                    schedule: schedule,
                    special: special,
                    token: accesstoken
                })
            } else {
                const newUser = new Users({
                    name: name,
                    email: email,
                    pushId: notification_token,
                    role: registerrole === 'user' ? 0 : 1,
                })

                await newUser.save()

                const accesstoken = createAccessToken(newUser._id)

                const scheduleCount = await Schedule.countDocuments({customerId: newUser._id})
                const specialCount = await Special.countDocuments({customerId: newUser._id})

                const schedule = await Schedule.find({customerId: newUser._id})
                const special = await Special.find({customerId: newUser._id})

                const count = scheduleCount + specialCount

                res.status(200).json({
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    pushId: newUser.pushId,
                    count: count,
                    schedule: schedule,
                    special: special,
                    token: accesstoken
                })
            }
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    register: async(req, res) => {
        try{
            const {name, email, password, registerrole, notification_token} = req.body

            const user = await Users.findOne({email}) 
            if(user)
                return res.status(400).json({msg: 'The email already exists.'})
            
            if(password.length < 6)
                return res.status(400).json({msg: 'Password should be atleast 6 character long'});

            const passwordHash = await bcrypt.hash(password, 10)

            const newUser = new Users({
                name: name,
                email: email,
                role: registerrole === 'user' ? 0 : 1,
                password: passwordHash,
                pushId: notification_token,
            })

            await newUser.save()

            const accesstoken = createAccessToken(newUser._id)

            const scheduleCount = await Schedule.countDocuments({customerId: newUser._id})
            const specialCount = await Special.countDocuments({customerId: newUser._id})

            const schedule = await Schedule.find({customerId: newUser._id})
            const special = await Special.find({customerId: newUser._id})

            const count = scheduleCount + specialCount

            res.status(200).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                pushId: newUser.pushId,
                count: count,
                schedule: schedule,
                special: special,
                token: accesstoken
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async(req, res) => {
        try {
            let dates = []

            const {email, password, notification_token} = req.body       

            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: 'User does not exist'})

            if(!user.password) return res.status(400).json({msg: 'Login Unsuccessful'})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: 'Incorrect password'})

            const noti = await user.pushId.find(id => id === notification_token)
             
            if(!noti) {
                user.pushId.push(notification_token)
                await user.save()
            }

            const accesstoken = createAccessToken(user._id)
            const refreshtoken = createRefreshToken(user._id)

            if(user.pushId !== notification_token) {
                user.pushId = notification_token
                await user.save()
            }

            const scheduleCount = await Schedule.countDocuments({customerId: user._id})
            const specialCount = await Special.countDocuments({customerId: user._id})

            const schedule = await Schedule.find({customerId: user._id})
            const special = await Special.find({customerId: user._id})

            const count = scheduleCount + specialCount

            if(user.notification.length > 0) {
                for(let i=0; i<user.notification.length; i++) {
                    dates.push(user.notification[i].createdAt.toISOString().split('T')[0])
                }
            }
            dates.reverse()
            let uniqueDates = await getUnique(dates)

            let notifications = await getNotifications(uniqueDates, user)
            let result = false

            notifications.map(noti => {
                if(noti.data.length > 0) {
                    result = true
                }
            })

            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                pushId: user.pushId,
                count: count,
                schedule: schedule,
                special: special,
                notification: result ? notifications : [],
                token: accesstoken
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    refreshtoken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if(!rf_token) return res.status(400).json({msg: 'Please Login or Register'})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if(err) return res.status(400).json({msg: 'Please Login or Register'})

                const accesstoken = createAccessToken({id: user._id})
                res.status(200).json({accesstoken})
            })

            res.status(200).json({rf_token})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUserProfile: async(req, res) => {
        try{
            const user = await Users.findById(req.params.id).select('-password')
            if(!user) return res.status(400).json({msg: 'User does not exists.'})

            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            user.phone = req.body.phone_number || user.phone

            if(req.body.image) {
                const check = checkURL(req.body.image)
                
                if(check) {
                    user.image = req.body.image       
                } else {                  
                    cloudinary.config({
                        cloud_name: process.env.CLOUD_NAME,
                        api_key: process.env.CLOUD_API_KEY,
                        api_secret: process.env.CLOUD_API_SECRET
                    })
                    
                    await cloudinary.v2.uploader.upload('data:image/png;base64,' + req.body.image, {folder: 'grab-my-garbage'}, (err, result) =>{
                        if(err) 
                            throw err
                        else
                            user.image = result.secure_url   
                    })
                }   
            }

            await user.save()

            res.status(200).json({msg: 'User Updated'})                   
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUserById: async(req, res) => {
        try {
            const user = await Users.findById(req.params.id)
            if(!user) return res.status(400).json({msg: 'User does not exists.'})

            res.status(200).json(user)         
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    returnDetails: async(req, res) => {
        try{
            let dates = []

            const {email} = req.body

            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: 'User does not exists.'})

            const scheduleCount = await Schedule.countDocuments({customerId: user._id})
            const specialCount = await Special.countDocuments({customerId: user._id})

            const schedule = await Schedule.find({customerId: user._id})
            const special = await Special.find({customerId: user._id})

            const count = scheduleCount + specialCount

            const accesstoken = createAccessToken(user._id)

            if(user.notification.length > 0) {
                for(let i=0; i<user.notification.length; i++) {
                    dates.push(user.notification[i].createdAt.toISOString().split('T')[0])
                }
            }
            dates.reverse()
            let uniqueDates = await getUnique(dates)
        
            let notifications = await getNotifications(uniqueDates, user)
            let result = false

            notifications.map(noti => {
                if(noti.data.length > 0) {
                    result = true
                }
            })

            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
                count: count,
                schedule: schedule,
                special: special,
                token: accesstoken,
                notification: result ? notifications : []
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUserPassword: async(req, res) => {
        try{
            const user = await Users.findById(req.params.id).select('-password')
            if(!user) return res.status(400).json({msg: 'User does not exists.'})
            
            const password = req.body.password
            const passwordHash = await bcrypt.hash(password, 10)

            user.password = passwordHash

            await user.save()

            res.status(200).json({msg: 'User Updated'})  
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    removePushToken: async(req, res) => {
        try{
            const user = await Users.findById(req.params.id)
            if(!user) return res.status(400).json({msg: 'User does not exists.'})

            await user.pushId.filter(pushId => pushId !== req.body.id)
            user.save()

            res.status(200).json({msg: 'Pushtoken removed'})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    removeNotification: async(req, res) => {
        try{
            const user = await Users.findById(req.params.id)
            if(!user) return res.status(400).json({msg: 'User does not exists.'})

            const index = await user.notification.findIndex(noti => noti._id.toString() === req.body.id)
            const notification = await user.notification.splice(index, 1)[0]
            notification.userVisible = false
            await user.notification.splice(index, 0, notification)
            
            await user.save()

            res.status(200).json({msg: 'Notification removed'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    readNotification: async(req, res) => {
        try{
            const user = await Users.findById(req.params.id)
            if(!user) return res.status(400).json({msg: 'User does not exists.'})

            for(let n=0; n<user.notification.length; n++) {
                user.notification[n].seen = true
            }
            await user.save()

            res.status(200).json({msg: 'Notification seen'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    }  
}

const createAccessToken = (user) => {
    return jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}

const createRefreshToken = (user) => {
    return jwt.sign({user}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

const checkURL = (check) => {
    let url 

    try {
        url = new URL(check)
    } catch (_) {
        return false
    }

    return url.protocol === 'http:' || url.protocol === 'https:'
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

const getNotifications = async(uniqueDates, user) => {
    for(let n=0; n<uniqueDates.length; n++) {
        for(let j=0; j<user.notification.length; j++) {
            if(user.notification[j].createdAt.toISOString().split('T')[0] === uniqueDates[n].date && user.notification[j].userVisible === true){
                uniqueDates[n].data.push({
                    description: user.notification[j].description,
                    id: user.notification[j]._id,
                    data: user.notification[j].createdAt,
                    userVisible: user.notification[j].userVisible,
                    seen: user.notification[j].seen
                })
            }
        }
    }

    return uniqueDates
}

module.exports = userController