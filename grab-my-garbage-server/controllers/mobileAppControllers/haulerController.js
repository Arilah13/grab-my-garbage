const Haulers = require('../../models/haulerModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const haulerController = {
    login: async(req, res) => {
        try {
            const {email, password, pushId} = req.body       

            const hauler = await Haulers.findOne({email})
            if(!hauler) return res.status(400).json({msg: 'Hauler does not exist'})

            if(!hauler.password) return res.status(400).json({msg: 'Login Unsuccessful'})

            const isMatch = await bcrypt.compare(password, hauler.password)
            if(!isMatch) return res.status(400).json({msg: "Incorrect password"})

            if(hauler.pushId !== pushId) {
                hauler.pushId = pushId
                await hauler.save()
            }

            const accesstoken = createAccessToken(hauler._id)
            const refreshtoken = createRefreshToken(hauler._id)

            res.status(201).json({
                _id: hauler._id,
                name: hauler.name,
                email: hauler.email,
                role: hauler.role,
                image: hauler.image,
                phone: hauler.phone,
                pushId: hauler.pushId,
                token: accesstoken
            })
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    returnDetails: async(req, res) => {
        try{
            const {email} = req.body

            const hauler = await Haulers.findOne({email})
            if(!hauler) return res.status(400).json({msg: 'Hauler does not exists.'})

            const accesstoken = createAccessToken(hauler._id)

            res.status(200).json({
                _id: hauler._id,
                name: hauler.name,
                email: hauler.email,
                role: hauler.role,
                image: hauler.image,
                token: accesstoken
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

            res.status(200).json({
                message: 'Hauler updated'
            })  
        } catch (err) {
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

module.exports = haulerController