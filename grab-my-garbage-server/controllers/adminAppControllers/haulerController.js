const Haulers = require('../../models/haulerModel')
const bcrypt = require('bcrypt')

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
                return res.status(400).json({msg: "The email already exists."})
            
            if(password.length < 6)
                return res.status(400).json({msg: "Password should be atleast 6 character long"})

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

            res.status(200).json({msg: 'hauler added'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = haulerController