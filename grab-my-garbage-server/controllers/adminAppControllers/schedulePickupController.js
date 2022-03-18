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
    },
    addSchedulePickup: async(req, res) => {
        try{
            const { location, from, to, days, timeslot, payment, paymentMethod, customerId, pickerId } = req.body

            if(customerId) {
                const newSchedulePickup = new SchedulePickups({
                    location: location,
                    from: from,
                    to: to,
                    days: days,
                    timeslot: timeslot,
                    payment: payment,
                    paymentMethod: paymentMethod,
                    customerId: customerId,
                    pickerId: pickerId
                })

                await newSchedulePickup.save()
            } else {
                const newSchedulePickup = new SchedulePickups({
                    location: location,
                    from: from,
                    to: to,
                    days: days,
                    timeslot: timeslot,
                    payment: payment,
                    paymentMethod: paymentMethod,
                    pickerId: pickerId
                })

                await newSchedulePickup.save()
            }

            res.status(201).json({msg: 'Schedule pickup added'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteSchedulePickup: async(req, res) => {
        try{
            const schedulePickup = await SchedulePickups.findById(req.params.id)

            if(!schedulePickup)
                return res.status(400).json({msg: 'Schedule pickup does not exist.'})

            await schedulePickup.remove()
            res.status(200).json({msg: 'Schedule pickup removed'})
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    returnSchedulePickupDetail: async(req, res) => {
        try{
            const schedulePickup = await SchedulePickups.findById(req.params.id).populate('customerId').populate('pickerId')
            if(!schedulePickup) return res.status(400).json({msg: 'Schedule pickup does not exists.'})

            res.status(200).json(schedulePickup)
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateSchedulePickupDetail: async(req, res) => {
        try{
            const schedulePickup = await SchedulePickups.findById(req.params.id)
            if(!schedulePickup) return res.status(400).json({msg: 'Schedule pickup does not exists.'})

            schedulePickup.location = req.body.location || schedulePickup.location
            schedulePickup.from = req.body.from || schedulePickup.from
            schedulePickup.to = req.body.to || schedulePickup.to
            schedulePickup.days = req.body.days || schedulePickup.days
            schedulePickup.timeslot = req.body.service_city || schedulePickup.service_city
            schedulePickup.payment = req.body.payment || schedulePickup.payment
            schedulePickup.paymentMethod = req.body.paymentMethod || schedulePickup.paymentMethod
            schedulePickup.pickerId = req.body.pickerId || schedulePickup.pickerId

            await schedulePickup.save()

            res.status(200).json({
                message: 'Schedule pickup updated'
            }) 
        } catch(err) {
            return res.status(500).json({msg: err.message})
        }
    }

}

module.exports = schedulePickupController