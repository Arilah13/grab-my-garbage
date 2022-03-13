import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Sidebar from './components/sidebar/Sidebar'
import Topbar from './components/topbar/Topbar'
import Home from './pages/home/Home'
import UserList from './pages/userList/UserList'
import HaulerList from './pages/haulerList/HaulerList'
import SpecialPickupList from './pages/specialPickupList/SpecialPickupList'
import SchedulePickupList from './pages/schedulePickupList/SchedulePickupList'
import UserDetails from './pages/userDetails/UserDetails'

import './App.css'

function App() {
  return (
    <Router>
      <Topbar />
      <div className = 'container'>
        <Sidebar />
        <Switch>

          <Route exact path = '/' component = {Home} />

          <Route exact path = '/users' component = {UserList} />
          <Route exact path = '/users/:userId' component = {UserDetails} />
          <Route exact path = '/haulers' component = {HaulerList} />
          <Route exact path = '/specialpickups' component = {SpecialPickupList} />
          <Route exact path = '/schedulepickups' component = {SchedulePickupList} />

        </Switch>
      </div>
    </Router>
  );
}

export default App
