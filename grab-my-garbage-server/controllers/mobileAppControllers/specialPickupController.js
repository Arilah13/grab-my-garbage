const Pickups = require('../../models/specialPickupModel')
const cloudinary = require('cloudinary')

const pickupController = {
    addSpecialPickup: async(req, res) => {
        try{
            const {pickupInfo, total, method, id} = req.body

            let photo

            if(pickupInfo.photo !== null && pickupInfo.photo !== '') {
                cloudinary.config({
                    cloud_name: process.env.CLOUD_NAME,
                    api_key: process.env.CLOUD_API_KEY,
                    api_secret: process.env.CLOUD_API_SECRET
                })
                
                await cloudinary.v2.uploader.upload("data:image/gif;base64," + pickupInfo.photo, {folder: "grab-my-garbage"}, (err, result) =>{
                    if(err) 
                        throw err
                    else
                        photo = result.secure_url   
                })
            } else {
                photo = null
            }

            const newPickup = new Pickups({
                location: pickupInfo.location,
                datetime: pickupInfo.date,
                category: pickupInfo.category,
                weight: pickupInfo.solid_weight,
                image: photo,
                payment: total,
                paymentMethod: method,
                customerId: id
            })

            await newPickup.save()

            res.status(201).json({
                _id: newPickup._id,
                location: newPickup.location,
                datetime: newPickup.datetime,
                category: newPickup.category,
                weight: newPickup.weight,
                image: newPickup.image,
                payment: newPickup.payment,
                paymentMethod: newPickup.paymentMethod,
            })

        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getPendingPickups: async(req, res) => {
        try{
            const customerId = req.params.id
            const pickups = await Pickups.find({ customerId, accepted: 0, cancelled: 0, completed: 0 })
            if(!pickups) return res.status(400).json({msg: "No Pickup is available."})

            res.status(200).json(pickups)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getAcceptedPickups: async(req, res) => {
        try{
            const customerId = req.params.id
            const pickups = await Pickups.find({ customerId, accepted: 1, cancelled: 0, completed: 0 }).populate('pickerId')
            if(!pickups) return res.status(400).json({msg: "No Pickup is available."})

            res.status(200).json(pickups)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getCompletedPickups: async(req, res) => {
        try{
            const customerId = req.params.id
            const pickups = await Pickups.find({ customerId, accepted: 1, cancelled: 0, completed: 1 })
            if(!pickups) return res.status(400).json({msg: "No Pickup is available."})

            res.status(200).json(pickups)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = pickupController