const SpecialPickups = require('../../models/specialPickupModel')

const specialPickupController = {
    returnspecialPickupList: async(req, res) => {
        try{
            const specialpickups = await SpecialPickups.find({}).populate('customerId')
            res.status(200).json(specialpickups)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    returnSpecialPickupUser: async(req, res) => {
        try{
            const specialPickups = await SpecialPickups.find({ customerId: req.params.id })
            res.status(200).json(specialPickups)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = specialPickupController