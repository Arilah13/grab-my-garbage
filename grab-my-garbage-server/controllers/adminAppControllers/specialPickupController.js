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
    },
    deleteSpecialPickup: async(req, res) => {
        try{
            const specialPickup = await SpecialPickups.findById(req.params.id)

            if(!specialPickup)
                return res.status(400).json({msg: 'Special pickup does not exist.'})

            await specialPickup.remove()
            res.status(200).json({msg: 'Special pickup removed'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    returnSpecialPickupDetail: async(req, res) => {
        try{
            const specialPickup = await SpecialPickups.findById(req.params.id).populate('customerId').populate('pickerId')
            if(!specialPickup) return res.status(400).json({msg: 'Special pickup does not exists.'})

            res.status(200).json(specialPickup)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

module.exports = specialPickupController