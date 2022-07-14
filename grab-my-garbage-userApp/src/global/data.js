export const menuData = [ 
  {
    name: 'Schedule',
    name1: 'Pickup',
    description: 'Pickup to collect',
    description1: 'solid-waste in terms',
    image: require('../../assets/menu/calendar.png'), 
    id: '0', 
    destination: 'Destination'
  },
  {
    name: 'Special',
    name1: 'Pickup',
    description: 'One-time pickup to',
    description1: 'collect solid-waste',
    image: require('../../assets/menu/truck.png'),
    id: '1', 
    destination: 'Destination'
  },
  {
    name: 'Schedule Pickup',
    name1: 'Requests',
    description: 'Find your schedule',
    description1: 'pickups here',
    image: require('../../assets/menu/request.png'),
    id: '2',
    destination: 'ScheduleRequests'
  },
  {
    name: 'Special Pickup',
    name1: 'Requests',
    description: 'Find your special',
    description1: 'pickups here',
    image: require('../../assets/menu/payments.png'),
    id: '3',
    destination: 'SpecialRequests'
  }                  
];

export const trashCategoryData = [
  {
    value: '0',
    label: 'Loose Bags',
    avatarSource: require('../../assets/trash/garbage-bag.jpeg'),
  },
  {
    value: '1',
    label: 'Appliances',
    avatarSource: require('../../assets/trash/appliances.png'),
  },
  {
    value: '2',
    label: 'Electronics',
    avatarSource: require('../../assets/trash/electronics.png'),
  },
  {
    value: '3',
    label: 'Furniture',
    avatarSource: require('../../assets/trash/furniture.png'),
  },
];

export const timeIntervalData = [
  {
    value: '0',
    label: '8.00 A.M - 12.00 P.M'
  },
  {
    value: '1',
    label: '2.00 P.M - 6.00 P.M'
  },
]

export const accountData = [
  {
    name: 'My Profile',
    image: 'account-circle', 
    id: '0', 
    destination: 'Editprofile'
  },
  {
    name: 'Change Password',
    image: 'lock',
    id: '1',
    destination: 'Changepassword'
  },
  {
    name: 'Signout',
    image: 'logout', 
    id: '2', 
    destination: 'Logout'
  },
]

export const dayData = [
  {
    value: '0',
    label: 'Monday'
  },
  {
    value: '1',
    label: 'Tuesday'
  },
  {
    value: '2',
    label: 'Wednesday'
  },
  {
    value: '3',
    label: 'Thursday'
  },
  {
    value: '4',
    label: 'Friday'
  },
  {
    value: '5',
    label: 'Saturday'
  },
  {
    value: '6',
    label: 'Sunday'
  },
]
