const SchedulePickups = require('../../models/scheduledPickupModel')

const schedulePickupController = {
    returnschedulePickupList: async(req, res) => {
        try{
            const schedulepickups = await SchedulePickups.find({}).populate('customerId').sort({completed: 1, createdAt: -1})
            res.status(200).json(schedulepickups)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    returnSchedulePickupUser: async(req, res) => {
        try{
            const schedulePickups = await SchedulePickups.find({ customerId: req.params.id })
            res.status(200).json(schedulePickups)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    returnSchedulePickupHauler: async(req, res) => {
        try{
            const schedulePickups = await SchedulePickups.find({ pickerId: req.params.id })
            res.status(200).json(schedulePickups)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = schedulePickupController