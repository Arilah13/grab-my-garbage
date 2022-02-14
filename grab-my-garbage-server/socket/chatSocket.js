let users = []
let haulers = []

const chatSocket = {
    userJoin: async({id, userid}) => {
        const user = {id, userid}
        const exist = users.find((user) => user.userid === userid)
        if(!exist) {
            users.push(user)
        } else if(exist) {
            users.splice(users.findIndex(user => user.userid === userid), 1)
            users.push(user)
        }
    },
    haulerJoin: async({id, haulerid}) => {
        const hauler = {id, haulerid}
        const exist = haulers.find((hauler) => hauler.haulerid === haulerid)
        if(!exist) {
            haulers.push(hauler)
        } else {
            haulers.splice(haulers.findIndex(hauler => hauler.haulerid === haulerid), 1)
            haulers.push(hauler)
        }
        return hauler
    },
    returnUserSocketid: async({userid}) => {
        const user = users.find((user) => user.userid === userid)
        if(user)
            return user.id
        else 
            return false
    },
    returnHaulerSocketid: async({haulerid}) => {
        const hauler = haulers.find((hauler) => hauler.haulerid === haulerid)
        if(hauler) 
            return hauler.id
        else
            return false
    },
    removeUser: async({id}) => {
        const usersList = await users.find((user) => user.id === id)
        const haulerList = await haulers.find((hauler) => hauler.id === id)
        if(usersList) {
            users = users.filter(user => user.id !== id)
        } else if(haulerList) {
            haulers = haulers.filter(hauler => hauler.id !== id)
        }
    }
}

module.exports = chatSocket