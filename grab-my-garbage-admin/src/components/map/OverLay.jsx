import React from 'react'
import WrappedMap from './Map'

const OverLay = ({polygon}) => {
  return (
    <div style = {{ width: '40%', height: '300px' }}>
        <WrappedMap 
            googleMapURL = {`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAbfkVeoFpJ3IFgmb48FSWuKFWQsLYteKA`}
            loadingElement = {<div style = {{height: '100%'}} />}
            containerElement = {<div style = {{height: '100%'}} />}
            mapElement = {<div style = {{height: '100%'}} />}
            polygon = {polygon}
        />
    </div>
  )
}

export default OverLay