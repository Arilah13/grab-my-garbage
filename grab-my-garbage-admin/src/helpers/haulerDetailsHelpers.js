export const returnPerMonthPickup = (data, data1) => {
    let Pickups = []
    let dates = []
    let sortedDates = []
    let finalDates = []
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

    data.map((pickup) => {
        if(pickup.completedPickups.length > 0)
            pickup.completedPickups.map((pckup) => {
                Pickups.push(pckup)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    })

    Pickups.map((p) => {
        dates.push(sixMonthsPrior(p.date))
    })

    for(let index = 0; index < 12; index++) {
        let count = 0
        dates.forEach((date) => date === index && count++)
        sortedDates.push({
            name: index,
            'Schedule Pickups': count
        })
    }

    dates = []

    data1.map((pickup) => {
        if(pickup.completedDate)
            dates.push(sixMonthsPrior(pickup.completedDate))
    })

    for(let index = 0; index < 12; index++) {
        let count = 0
        dates.forEach((date) => date === index && count++)
        sortedDates.push({
            name: index,
            'Special Pickups': count
        })
    }

    sortedDates.map((data) => {
        if(data['Schedule Pickups'] === undefined )
            data['Schedule Pickups'] = 0
        else if(data['Special Pickups'] === undefined)
            data['Special Pickups'] = 0
    })

    let result = sortedDates.reduce((accumulator, cur) => {
        let name = cur.name, found = accumulator.find((elem) => {
            return elem.name === name
        })
        if(found){
            found['Special Pickups'] += cur['Special Pickups']
            found['Schedule Pickups'] += cur['Schedule Pickups']
        } else accumulator.push(cur)
        return accumulator 
    }, [])

    const d = new Date().getMonth()
    if(d <= 6) {
        let date1 = []
        let date2 = []
        result.forEach((date) => {
            if(date.name > d) {
                date1.push({
                    name: date.name,
                    'Schedule Pickups': date['Schedule Pickups'],
                    'Special Pickups': date['Special Pickups']
                })
            }
        })
        date1.sort((a, b) => {return a.name - b.name})

        date1.forEach((date) => {
            finalDates.push({
                name: months[date.name],
                'Schedule Pickups': date['Schedule Pickups'],
                'Special Pickups': date['Special Pickups']
            })
        })

        result.forEach((date) => {
            if(date.name <= d)
                date2.push({
                    name: date.name,
                    'Schedule Pickups': date["Schedule Pickups"],
                    'Special Pickups': date['Special Pickups']
                })
        })
        date2.sort((a, b) => {return a.name - b.name})
        
        date2.forEach((date) => {
            finalDates.push({
                name: months[date.name],
                'Schedule Pickups': date['Schedule Pickups'],
                'Special Pickups': date['Special Pickups']
            })
        })
        
    } else {
        let date1 = []
        let date2 = []

        result.forEach((date) => {
            if(date.name < d)
                date1.push({
                    name: date.name,
                    'Schedule Pickups': date["Schedule Pickups"],
                    'Special Pickups': date['Special Pickups']
                })
        })
        date1.sort((a, b) => {return a.name - b.name})

        date1.forEach((date) => {
            finalDates.push({
                name: months[date.name],
                'Schedule Pickups': date['Schedule Pickups'],
                'Special Pickups': date['Special Pickups']
            })
        })

        result.forEach((date) => {
            if(date.name >= d)
                date2.push({
                    name: date.name,
                    'Schedule Pickups': date["Schedule Pickups"],
                    'Special Pickups': date['Special Pickups']
                })
        })
        date2.sort((a, b) => {return a.name - b.name})

        date2.forEach((date) => {
            finalDates.push({
                name: months[date.name],
                'Schedule Pickups': date['Schedule Pickups'],
                'Special Pickups': date['Special Pickups']
            })
        })
    }
    return finalDates
}

export const moneyreturn = (data, data1) => {
    let dates = []
    let sortedDates = []
    let finalDates = []
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

    data.map((p) => {
        dates.push(sixMonthsPrior(p.to, p.payment))
    })
    
    for(let index = 0; index < 12; index++) {
        let sum = 0
        dates.forEach((d) => index === d.date && (sum += Number(d.payment)))
        sortedDates.push({
            name: index,
            'Schedule Pickups': sum
        })
    }

    dates = []

    data1.map((p) => {
        if(p.completedDate)
            dates.push(sixMonthsPrior(p.completedDate, p.payment))
    })

    for(let index = 0; index < 12; index++) {
        let sum = 0
        dates.forEach((d) => index === d.date && (sum += Number(d.payment)))
        sortedDates.push({
            name: index,
            'Special Pickups': sum
        })
    }

    sortedDates.map((data) => {
        if(data['Schedule Pickups'] === undefined )
            data['Schedule Pickups'] = 0
        else if(data['Special Pickups'] === undefined)
            data['Special Pickups'] = 0
    })

    let result = sortedDates.reduce((accumulator, cur) => {
        let name = cur.name, found = accumulator.find((elem) => {
            return elem.name === name
        })
        if(found){
            found['Special Pickups'] += cur['Special Pickups']
            found['Schedule Pickups'] += cur['Schedule Pickups']
        } else accumulator.push(cur)
        return accumulator 
    }, [])

    const d = new Date().getMonth()
    if(d <= 6) {
        let date1 = []
        let date2 = []
        result.forEach((date) => {
            if(date.name > d) {
                date1.push({
                    name: date.name,
                    'Schedule Pickups': date['Schedule Pickups'],
                    'Special Pickups': date['Special Pickups']
                })
            }
        })
        date1.sort((a, b) => {return a.name - b.name})

        date1.forEach((date) => {
            finalDates.push({
                name: months[date.name],
                'Schedule Pickups': date['Schedule Pickups'],
                'Special Pickups': date['Special Pickups']
            })
        })

        result.forEach((date) => {
            if(date.name <= d)
                date2.push({
                    name: date.name,
                    'Schedule Pickups': date["Schedule Pickups"],
                    'Special Pickups': date['Special Pickups']
                })
        })
        date2.sort((a, b) => {return a.name - b.name})
        
        date2.forEach((date) => {
            finalDates.push({
                name: months[date.name],
                'Schedule Pickups': date['Schedule Pickups'],
                'Special Pickups': date['Special Pickups']
            })
        })
        
    } else {
        let date1 = []
        let date2 = []

        result.forEach((date) => {
            if(date.name < d)
                date1.push({
                    name: date.name,
                    'Schedule Pickups': date["Schedule Pickups"],
                    'Special Pickups': date['Special Pickups']
                })
        })
        date1.sort((a, b) => {return a.name - b.name})

        date1.forEach((date) => {
            finalDates.push({
                name: months[date.name],
                'Schedule Pickups': date['Schedule Pickups'],
                'Special Pickups': date['Special Pickups']
            })
        })

        result.forEach((date) => {
            if(date.name >= d)
                date2.push({
                    name: date.name,
                    'Schedule Pickups': date["Schedule Pickups"],
                    'Special Pickups': date['Special Pickups']
                })
        })
        date2.sort((a, b) => {return a.name - b.name})

        date2.forEach((date) => {
            finalDates.push({
                name: months[date.name],
                'Schedule Pickups': date['Schedule Pickups'],
                'Special Pickups': date['Special Pickups']
            })
        })
    }

    return finalDates
}

const sixMonthsPrior = (date, value) => {
    let d = new Date()
    let D = new Date(date)
    let m = D.getMonth()
    d.setMonth(d.getMonth() - 6)
    let diff = (m + 12 - d.getMonth()) % 12
    if(diff < 6) d.setDate(0)
    
    if(D > d) {
        if(value) {
            const data = {date: D.getMonth(), payment: value}
            return data
        }
        else {
            return D.getMonth()
        }
    }
}

const monthConvert = (date) => {
    let month 
    if(date === 1) {
        month = 'Jan'
    } else if(date === 2) {
        month = 'Feb'
    } else if(date === 3) {
        month = 'Mar'
    } else if(date === 4) {
        month = 'Apr'
    } else if(date === 5) {
        month = 'May'
    } else if(date === 6) {
        month = 'Jun'
    } else if(date === 7) {
        month = 'Jul'
    } else if(date === 8) {
        month = 'Aug'
    } else if(date === 9) {
        month = 'Sep'
    } else if(date === 10) {
        month = 'Oct'
    } else if(date === 11) {
        month = 'Nov'
    } else if(date === 12) {
        month = 'Dec'
    }

    return month
}