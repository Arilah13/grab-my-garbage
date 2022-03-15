const SpecialPickups = require('../../models/specialPickupModel')

const specialPickupController = {
    returnspecialPickupList: async(req, res) => {
        try{
            const specialpickups = await SpecialPickups.find({}).populate('customerId').sort({accepted: -1, completed: 1, cancelled: 1, createdAt: -1})
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
    },
    returnSpecialPickupHauler: async(req, res) => {
        try{
            const specialPickups = await SpecialPickups.find({ pickerId: req.params.id })
            res.status(200).json(specialPickups)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = specialPickupController