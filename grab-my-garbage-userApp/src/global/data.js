export const menuData = [ 
  {
    name: 'Schedule Pickup',
    image: require('../../assets/menu/calendar.png'), 
    id: '0', 
    destination: 'Destination'
  },
  {
    name: 'Special Pickup',
    image: require('../../assets/menu/truck.png'),
    id: '1', 
    destination: 'Destination'
  },
  {
    name: 'Schedule Requests',
    image: require('../../assets/menu/request.png'),
    id: '2',
    destination: 'ScheduleRequests'
  },
  {
    name: 'Special Requests',
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
    name: 'Edit Profile',
    image: require('../../assets/profile/edit_profile.png'), 
    id: '0', 
    destination: 'Editprofile'
  },
  {
    name: 'Change Password',
    image: require('../../assets/profile/lock.png'),
    id: '1',
    destination: 'Changepassword'
  },
  {
    name: 'Signout',
    image: require('../../assets/profile/logout.png'), 
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
