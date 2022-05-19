export const returnAdminUsers = async(data) => {
    let dates = []
    let sortedDates = []
    let finalDates = []
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

    data.map((p) => {
        dates.push(twelveMonthsPrior(p.createdAt))
    })

    for(let index = 0; index < 12; index++) {
        let count = 0
        dates.forEach((date) => date === index && count++)
        sortedDates.push({
            name: index,
            'User': count
        })
    }

    sortedDates.map((data) => {
        if(data['User'] === undefined )
            data['User'] = 0
    })

    let result = sortedDates.reduce((accumulator, cur) => {
        let name = cur.name, found = accumulator.find((elem) => {
            return elem.name === name
        })
        if(found){
            found['User'] += cur['User']
        } else accumulator.push(cur)
        return accumulator 
    }, [])

    const d = new Date().getMonth()
    if(d <= 12) {
        let date1 = []
        let date2 = []
        result.forEach((date) => {
            if(date.name > d) {
                date1.push({
                    name: date.name,
                    'User': date['User'],
                })
            }
        })
        date1.sort((a, b) => {return a.name - b.name})

        date1.forEach((date) => {
            finalDates.push({
                name: months[date.name],
                'User': date['User'],
                //'Special Pickups': date['Special Pickups']
            })
        })

        result.forEach((date) => {
            if(date.name <= d)
                date2.push({
                    name: date.name,
                    'User': date["User"],
                    //'Special Pickups': date['Special Pickups']
                })
        })
        date2.sort((a, b) => {return a.name - b.name})
        
        date2.forEach((date) => {
            finalDates.push({
                name: months[date.name],
                'User': date['User'],
                'User': date['User']
            })
        })
        
    } else {
        let date1 = []
        let date2 = []

        result.forEach((date) => {
            if(date.name < d)
                date1.push({
                    name: date.name,
                    'User': date["User"],
                    //'Special Pickups': date['Special Pickups']
                })
        })
        date1.sort((a, b) => {return a.name - b.name})

        date1.forEach((date) => {
            finalDates.push({
                name: months[date.name],
                'User': date['User'],
                //'Special Pickups': date['Special Pickups']
            })
        })

        result.forEach((date) => {
            if(date.name >= d)
                date2.push({
                    name: date.name,
                    'User': date["User"],
                    //'Special Pickups': date['Special Pickups']
                })
        })
        date2.sort((a, b) => {return a.name - b.name})

        date2.forEach((date) => {
            finalDates.push({
                name: months[date.name],
                'User': date['User'],
                //'Special Pickups': date['Special Pickups']
            })
        })
    }
    return finalDates
}

export const returnAdminHaulers = async(data) => {
    let dates = []
    let sortedDates = []
    let finalDates = []
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

    data.map((p) => {
        dates.push(twelveMonthsPrior(p.createdAt))
    })

    for(let index = 0; index < 12; index++) {
        let count = 0
        dates.forEach((date) => date === index && count++)
        sortedDates.push({
            name: index,
            'Hauler': count
        })
    }

    sortedDates.map((data) => {
        if(data['Hauler'] === undefined )
            data['Hauler'] = 0
    })

    let result = sortedDates.reduce((accumulator, cur) => {
        let name = cur.name, found = accumulator.find((elem) => {
            return elem.name === name
        })
        if(found){
            found['Hauler'] += cur['Hauler']
        } else accumulator.push(cur)
        return accumulator 
    }, [])

    const d = new Date().getMonth()
    if(d <= 12) {
        let date1 = []
        let date2 = []
        result.forEach((date) => {
            if(date.name > d) {
                date1.push({
                    name: date.name,
                    'Hauler': date['Hauler'],
                })
            }
        })
        date1.sort((a, b) => {return a.name - b.name})

        date1.forEach((date) => {
            finalDates.push({
                name: months[date.name],
                'Hauler': date['Hauler'],
                //'Special Pickups': date['Special Pickups']
            })
        })

        result.forEach((date) => {
            if(date.name <= d)
                date2.push({
                    name: date.name,
                    'Hauler': date["Hauler"],
                    //'Special Pickups': date['Special Pickups']
                })
        })
        date2.sort((a, b) => {return a.name - b.name})
        
        date2.forEach((date) => {
            finalDates.push({
                name: months[date.name],
                'Hauler': date['Hauler'],
                'Hauler': date['Hauler']
            })
        })
        
    } else {
        let date1 = []
        let date2 = []

        result.forEach((date) => {
            if(date.name < d)
                date1.push({
                    name: date.name,
                    'Hauler': date["Hauler"],
                    //'Special Pickups': date['Special Pickups']
                })
        })
        date1.sort((a, b) => {return a.name - b.name})

        date1.forEach((date) => {
            finalDates.push({
                name: months[date.name],
                'Hauler': date['Hauler'],
                //'Special Pickups': date['Special Pickups']
            })
        })

        result.forEach((date) => {
            if(date.name >= d)
                date2.push({
                    name: date.name,
                    'Hauler': date["Hauler"],
                    //'Special Pickups': date['Special Pickups']
                })
        })
        date2.sort((a, b) => {return a.name - b.name})

        date2.forEach((date) => {
            finalDates.push({
                name: months[date.name],
                'Hauler': date['Hauler'],
                //'Special Pickups': date['Special Pickups']
            })
        })
    }
    return finalDates
}

export const getSum = async(data, data1) => {
    let sum = 0

    await data.map((data) => {
        sum = sum + parseInt(data.payment) 
    })

    await data1.map((data) => {
        sum = sum + parseInt(data.payment)
    })
    return sum
}

const twelveMonthsPrior = (date, value) => {
    let d = new Date()
    let D = new Date(date)
    let m = D.getMonth()
    d.setMonth(d.getMonth() - 12)
    let diff = (m + 12 - d.getMonth()) % 12
    if(diff < 12) d.setDate(0)
    
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