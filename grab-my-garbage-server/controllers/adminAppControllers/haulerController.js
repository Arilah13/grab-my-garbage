const Haulers = require('../../models/haulerModel')
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary')
const SpecialPickup = require('../../models/specialPickupModel')
const SchedulePickup = require('../../models/scheduledPickupModel')

const haulerController = {
    returnHaulerList: async(req, res) => {
        try{
            let result = []

            const haulers = await Haulers.find({}).select('-password')

            if(haulers.length > 0) {
                for(let n=0; n<haulers.length; n++) {
                    const specialPickups = await SpecialPickup.find({ pickerId: haulers[n]._id })
                    const schedulePickups = await SchedulePickup.find({ pickerId: haulers[n]._id })

                    result.push({
                        _id: haulers[n]._id,
                        name: haulers[n].name,
                        email: haulers[n].email,
                        role: haulers[n].role,
                        image: haulers[n].image,
                        createdAt: haulers[n].createdAt,
                        updatedAt: haulers[n].updatedAt,
                        __v: haulers[n].__v,
                        location: haulers[n].location,
                        service_city: haulers[n].service_city,
                        phone: haulers[n].phone,
                        limit: haulers[n].limit,
                        pushId: haulers[n].pushId,
                        specialPickups: specialPickups,
                        schedulePickups: schedulePickups
                    })
                }
            }

            res.status(200).json(result)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    addHaulers: async(req, res) => {
        try{
            let pic 

            const {name, email, password, role, image, phone, service_city, limit} = req.body

            const hauler = await Haulers.findOne({email}) 
            if(hauler) return res.status(400).json({msg: 'The email already exists.'})
            
            if(password.length < 6) return res.status(400).json({msg: 'Password should be atleast 6 character long'})

            const passwordHash = await bcrypt.hash(password, 10)

            cloudinary.config({
                cloud_name: process.env.CLOUD_NAME,
                api_key: process.env.CLOUD_API_KEY,
                api_secret: process.env.CLOUD_API_SECRET
            })

            await cloudinary.v2.uploader.upload(image, {folder: 'grab-my-garbage'}, (err, result) =>{
                if(err) 
                    throw err
                else
                    pic = result.secure_url   
            })

            const newHauler = new Haulers({
                name: name,
                email: email,
                password: passwordHash,
                phone: phone,
                role: role,
                image: pic,
                limit: limit,
                service_city: service_city
            })

            await newHauler.save()

            res.status(201).json({
                _id: newHauler._id,
                name: newHauler.name,
                email: newHauler.email,
                image: newHauler.image,
                phone: newHauler.phone,
                location: newHauler.location,
                role: newHauler.role,
                service_city: newHauler.service_city,
                limit: newHauler.limit
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteHauler: async(req, res) => {
        try{
            const hauler = await Haulers.findById(req.params.id)

            if(!hauler)
                return res.status(400).json({msg: 'The hauler does not exist.'})

            await hauler.remove()
            res.status(200).json({msg: 'Hauler Removed'})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateHaulerDetail: async(req, res) => {
        try{
            const hauler = await Haulers.findById(req.params.id)
            if(!hauler) return res.status(400).json({msg: 'Hauler does not exists.'})

            hauler.name = req.body.name || hauler.name
            hauler.email = req.body.email || hauler.email
            hauler.phone = req.body.phone || hauler.phone
            hauler.limit = req.body.limit || hauler.limit
            hauler.service_city = req.body.service_city || hauler.service_city

            if(req.body.image) {                
                cloudinary.config({
                    cloud_name: process.env.CLOUD_NAME,
                    api_key: process.env.CLOUD_API_KEY,
                    api_secret: process.env.CLOUD_API_SECRET
                })
                
                await cloudinary.v2.uploader.upload(req.body.image, {folder: 'grab-my-garbage'}, (err, result) =>{
                    if(err) 
                        throw err
                    else
                        hauler.image = result.secure_url   
                })
            }

            if (req.body.password) {
                hauler.password = await bcrypt.hash(req.body.password, 10)
            }

            await hauler.save()

            const specialPickups = await SpecialPickup.find({ pickerId: hauler._id })
            const schedulePickups = await SchedulePickup.find({ pickerId: hauler._id })

            res.status(200).json({
                _id: hauler._id,
                name: hauler.name,
                email: hauler.email,
                image: hauler.image,
                phone: hauler.phone,
                location: hauler.location,
                role: hauler.role,
                service_city: hauler.service_city,
                limit: hauler.limit,
                specialPickups: specialPickups,
                schedulePickups: schedulePickups,
                pushId: hauler.pushId
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = haulerController