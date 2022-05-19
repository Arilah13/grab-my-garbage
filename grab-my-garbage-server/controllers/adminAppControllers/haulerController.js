const Haulers = require('../../models/haulerModel')
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary')

const haulerController = {
    returnHaulerList: async(req, res) => {
        try{
            const haulers = await Haulers.find({})
            res.status(200).json(haulers)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    addHaulers: async(req, res) => {
        try{
            const {name, email, password, registerrole, image, phone, service_city} = req.body

            const hauler = await Haulers.findOne({email}) 
            if(hauler)
                return res.status(400).json({msg: 'The email already exists.'})
            
            if(password.length < 6)
                return res.status(400).json({msg: 'Password should be atleast 6 character long'})

            const passwordHash = await bcrypt.hash(password, 10)

            const newHauler = new Haulers({
                name: name,
                email: email,
                password: passwordHash,
                phone: phone,
                role: registerrole,
                image: image,
                service_city: service_city
            })

            await newHauler.save()

            res.status(201).json({msg: 'hauler added'})
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
            res.status(200).json({msg: 'User removed'})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    returnHaulerDetail: async(req, res) => {
        try{
            const hauler = await Haulers.findById(req.params.id).select('-password')
            if(!hauler) return res.status(400).json({msg: 'Hauler does not exists.'})

            res.status(200).json(hauler)
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
            hauler.service_city = req.body.service_city || hauler.service_city

            if(req.body.image) {
                const check = checkURL(req.body.image)
                
                if(check) {
                    hauler.image = req.body.image       
                } else {                  
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
            }

            if (req.body.password) {
                hauler.password = await bcrypt.hash(req.body.password, 10)
            }

            await hauler.save()

            res.status(200).json({
                message: 'Hauler updated'
            }) 
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
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

module.exports = haulerController