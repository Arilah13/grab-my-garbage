export const menuData = [ 
  {
    name: 'Start Pickup',
    image: require('../../assets/truck.png'), 
    id: '0', 
    destination: 'Pickup'
  },
  {
    name: 'Pickup History',
    image: require('../../assets/request.png'),
    id: '1', 
    destination: 'History'
  },
  {
    name: '',
    image: require('../../assets/request.png'),
    id: '2',
    destination: ''
  },
  {
    name: '',
    image: require('../../assets/payments.png'),
    id: '3',
    destination: ''
  }                  
]

export const accountData = [
  {
    name: 'Change Password',
    image: require('../../assets/lock.png'),
    id: '1',
    destination: 'Changepassword'
  },
  {
    name: 'Signout',
    image: require('../../assets/logout.png'), 
    id: '2', 
    destination: 'Logout'
  },
]