const SchedulePickups = require('../../models/scheduledPickupModel')

const schedulePickupController = {
    returnSchedulePickupList: async(req, res) => {
        try{
            const schedulepickups = await SchedulePickups.find({}).populate('customerId').sort({completed: 1, createdAt: -1})
            res.status(200).json(schedulepickups)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    }, 
    cancelSchedulePickup: async(req, res) => {
        try{
            const id = req.params.id

            const schedulepickups = await SchedulePickups.findById(id)
            schedulepickups.cancelled = 1

            await schedulepickups.save()
            
            res.status(200).json({msg: 'Schedulepickup Cancelled'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = schedulePickupController