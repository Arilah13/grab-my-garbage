export const dayConverter = (day) => {
    if(day === 'Monday')
        return 'Mon'
    else if(day === 'Tuesday')
        return 'Tue'
    else if(day === 'Wednesday')
        return 'Wed'
    else if(day === 'Thursday')
        return 'Thu'
    else if(day === 'Friday')
        return 'Fri'
    else if(day === 'Saturday')
        return 'Sat'
    else if(day === 'Sunday')
        return 'Sun'
}

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