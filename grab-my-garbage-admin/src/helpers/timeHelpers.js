export const fromDate = (date) => {
    let month 
    const dateB = ((date).split('T')[0]).split('-')[1]
    if(dateB === '01') {
        month = 'Jan'
    } else if(dateB === '02') {
        month = 'Feb'
    } else if(dateB === '03') {
        month = 'Mar'
    } else if(dateB === '04') {
        month = 'Apr'
    } else if(dateB === '05') {
        month = 'May'
    } else if(dateB === '06') {
        month = 'Jun'
    } else if(dateB === '07') {
        month = 'Jul'
    } else if(dateB === '08') {
        month = 'Aug'
    } else if(dateB === '09') {
        month = 'Sep'
    } else if(dateB === '10') {
        month = 'Oct'
    } else if(dateB === '11') {
        month = 'Nov'
    } else if(dateB === '12') {
        month = 'Dec'
    }
    const dateC = ((date).split('T')[0]).split('-')[2]
    const dateA = ((date).split('T')[0]).split('-')[0].substring(2, 4)
    const final = dateC + ' ' + month + ' ' + dateA
    return final
}

export const timeHelper = (timeC) => {
    let timeF
    let timeA = parseInt((((timeC).split('T')[1]).split('.')[0]).split(':')[0]) + 5
    const timeE = parseInt((((timeC).split('T')[1]).split('.')[0]).split(':')[1]) + 30
    if(timeE >= 60) {
        timeF = timeE - 60
        if(timeF < 10) {
            timeF = '0' + timeF
        }
        timeA = timeA + 1
    } else {
        timeF = timeE
    }
    const timeB = (parseInt(timeA) + 11) % 12 + 1
    const timeD = timeB + ':' + timeF + (parseInt(timeA) >= 12 ? ' PM' : ' AM') 
    return timeD
}

export const dateHelper = (dateA) => {
    let month
    const dateB = ((dateA).split('T')[0]).split('-')[1]
    if(dateB === '01') {
        month = 'January'
    } else if(dateB === '02') {
        month = 'February'
    } else if(dateB === '03') {
        month = 'March'
    } else if(dateB === '04') {
        month = 'April'
    } else if(dateB === '05') {
        month = 'May'
    } else if(dateB === '06') {
        month = 'June'
    } else if(dateB === '07') {
        month = 'July'
    } else if(dateB === '08') {
        month = 'August'
    } else if(dateB === '09') {
        month = 'September'
    } else if(dateB === '10') {
        month = 'October'
    } else if(dateB === '11') {
        month = 'November'
    } else if(dateB === '12') {
        month = 'December'
    }
    const dateC = parseInt(((dateA).split('T')[0]).split('-')[2]) + 1
    const final = dateC + ' ' + month
    return (final)
}