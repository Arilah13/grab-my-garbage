import React from 'react'
import { GoogleMap, withScriptjs, withGoogleMap, Polygon, Marker } from 'react-google-maps'

import mapStyle from './MapStyles'

const Map = ({polygon, lat, lng}) => {

    const parseCoordinates = (coordinates) => {
        var result = []
        for (var index = 0; index < coordinates.length - 1; index++) {
            result.push({
                lat: Number(coordinates[index].lat),
                lng: Number(coordinates[index].lng)
            })
        }
        return result
    }

    return (
        <GoogleMap
            defaultCenter = {{ lat: 6.8815116, lng: 79.861244 }}
            defaultZoom = {13}
            defaultOptions = {{ styles: mapStyle }}
            tilt = {45}
            center = {lat && lng && {lat: lat, lng: lng}}
        >
            {polygon && polygon.map((poly, i) => {
                console.log(parseCoordinates(poly.area))
                return(
                    <Polygon 
                        path = {parseCoordinates(poly.area)}
                        key = {i}
                        options = {{
                            fillColor: 'darkblue',
                            fillOpacity: 0.4,
                            strokeColor: '#00d0f1',
                            strokeOpacity: 0.8,
                            strokeWeight: 1
                        }}
                    />
                )
            })}

            {lat && lng && 
                <Marker
                    position = {{lat: parseFloat(lat), lng: parseFloat(lng)}}
                    icon = {{
                        url: '/garbage.png',
                        scaledSize: new window.google.maps.Size(25, 25)
                    }}
                />
            }
        </GoogleMap>
    )
}

const WrappedMap = withScriptjs(withGoogleMap(Map))

export default WrappedMap