const SpecialPickups = require('../../models/specialPickupModel')

const specialPickupController = {
    returnSpecialPickupList: async(req, res) => {
        try{
            const specialpickups = await SpecialPickups.find({}).populate('customerId').sort({accepted: -1, completed: 1, cancelled: 1, createdAt: -1})
            res.status(200).json(specialpickups)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    cancelSpecialPickup: async(req, res) => {
        try{
            const id = req.params.id

            const specialpickups = await SpecialPickups.findById(id)

            specialpickups.cancelled = 1

            await specialpickups.save()

            res.status(200).json({msg: 'Specialpickup Cancelled'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }   
    }
}

module.exports = specialPickupController