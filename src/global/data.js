export const menuData = [ 
  {
    name: 'Schedule Pickup',
    image: require('../../assets/calendar.png'), 
    id: '0', 
    destination: 'Destination'
  },
  {
    name: 'Special Pickup',
    image: require('../../assets/truck.png'),
    id: '1', 
    destination: 'Destination'
  },
  {
    name: 'Requests',
    image: require('../../assets/request.png'),
    id: '2',
    destination: ''
  },
  {
    name: 'Payments',
    image: require('../../assets/payments.png'),
    id: '3',
    destination: ''
  }                  
];

export const trashCategoryData = [
  {
    value: '1',
    label: 'Loose Bags & Bulk',
    avatarSource: require('../../assets/garbage-bag.jpeg'),
  },
  {
    value: '2',
    label: 'Appliances',
    avatarSource: require('../../assets/appliances.png'),
  },
  {
    value: '3',
    label: 'Electronics',
    avatarSource: require('../../assets/electronics.png'),
  },
  {
    value: '4',
    label: 'Furniture',
    avatarSource: require('../../assets/furniture.png'),
  },
];

export const timeIntervalData = [
  {
    value: '1',
    label: '8.00 A.M - 12.00 P.M'
  },
  {
    value: '2',
    label: '2.00 P.M - 6.00 P.M'
  },
]

export const accountData = [
  {
    name: 'Edit Profile',
    image: require('../../assets/edit_profile.png'), 
    id: '0', 
    destination: 'Editprofile'
  },
  {
    name: 'Change Password',
    image: require('../../assets/lock.png'),
    id: '1',
    destination: 'Changepassword'
  },
  {
    name: 'Payment Option',
    image: require('../../assets/payment_option.png'), 
    id: '2', 
    destination: 'Paymentoption'
  },
  {
    name: 'Signout',
    image: require('../../assets/logout.png'), 
    id: '3', 
    destination: 'Logout'
  },
]

export const cardDetails = [
  {
    cardNo: 'Cash',
    id: '0',
    type: 'Cash',
  },
  {
    cardNo: '5234 1234 1234',
    id: '1',
    type: 'Master',
  },
  {
    cardNo: '4321 4321 4321',
    id: '2',
    type: 'Visa'
  },
  {
    cardNo: '3778 5678 5678',
    id: '3',
    type: 'Amex'
  },
  {
    cardNo: '3778 5678 5678',
    id: '4',
    type: 'Amex'
  },
  {
    cardNo: '3778 5678 5678',
    id: '5',
    type: 'Amex'
  }
]