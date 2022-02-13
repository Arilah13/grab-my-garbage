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
    destination: 'Requests'
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
    value: '0',
    label: 'Loose Bags',
    avatarSource: require('../../assets/garbage-bag.jpeg'),
  },
  {
    value: '1',
    label: 'Appliances',
    avatarSource: require('../../assets/appliances.png'),
  },
  {
    value: '2',
    label: 'Electronics',
    avatarSource: require('../../assets/electronics.png'),
  },
  {
    value: '3',
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
    name: 'Signout',
    image: require('../../assets/logout.png'), 
    id: '2', 
    destination: 'Logout'
  },
]