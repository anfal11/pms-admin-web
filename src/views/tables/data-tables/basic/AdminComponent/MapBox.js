import { Fragment, useState, useEffect, useRef } from 'react'
import {
    Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col, Badge, Form, FormGroup, ncontrolledDropdown, CardBody, CustomInput, Table, Spinner, InputGroup, InputGroupAddon, nputGroupText, FormFeedback, Progress
} from 'reactstrap'
import useJwt from '@src/auth/jwt/useJwt'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp'
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker'

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
// import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'


mapboxgl.workerClass = MapboxWorker
mapboxgl.accessToken = 'pk.eyJ1Ijoic2hha3VyOTk5IiwiYSI6ImNsODMwYjFvejAxNHgzdnA2dzl5OGVhZnMifQ.wBjwtq5J4UmUw0OBLRJTIQ'

const MapBox = ({ location, setLocation }) => {

    useEffect(() => {

        const map = new mapboxgl.Map({
            container: 'Mlajanmap',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [location.lng, location.lat],
            zoom: 11
        })
        const marker = new mapboxgl.Marker({
            draggable: true,
            color: "#b40219"
        })
            .setLngLat([location.lng, location.lat])
            .addTo(map)
        // Add zoom and rotation controls to the map.
        map.addControl(new mapboxgl.NavigationControl())
            // Add geolocate control to the map.
          // Add Geolocate control to the map
          //in prod only work over https...
        const geolocateControl = new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
        })

        map.addControl(geolocateControl)
        // Handle geolocate event to update the marker
        geolocateControl.on('geolocate', (e) => {
            const { coords } = e
            const location = [coords.longitude, coords.latitude]
    
            // Update marker position
            marker.setLngLat(location)
            setLocation({ lat: coords.latitude, lng: coords.longitude })
            map.setCenter(location)
        })

         // Handle track user location start
        geolocateControl.on('trackuserlocationstart', () => {
            console.log('User location tracking started')
        })
    
        // Handle track user location end
        geolocateControl.on('trackuserlocationend', () => {
            console.log('User location tracking ended')
        })

         // Add geocoder (search box)
        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl,
            marker: false // Disable the default marker
        })
        geocoder.on('result', (e) => {
            const { coordinates } = e.result.geometry
            marker.setLngLat([coordinates[0], coordinates[1]])
            setLocation({ lat: coordinates[1], lng: coordinates[0] })
            map.setCenter(coordinates)
        })
            // Add the Geocoder control to the map
        map.addControl(geocoder, 'top-left')

        map.on('click', function (e) {
            const coordinates = document.getElementById('Mlajancoordinates')
            marker.setLngLat([e.lngLat.lng, e.lngLat.lat])
            setLocation({ lat: e.lngLat.lat, lng: e.lngLat.lng })
            //   console.log(e.lngLat.lng ,e.lngLat.lat )
            coordinates.style.display = 'block'
        })
        function onDragEnd() {
            const coordinates = document.getElementById('Mlajancoordinates')
            const lngLat = marker.getLngLat()
            setLocation({ lat: lngLat.lat, lng: lngLat.lng })
            coordinates.style.display = 'block'
        }
        marker.on('dragend', onDragEnd)
        return () => map.remove()
    }, [])

    return (
        <Fragment>
            <Card>
                <Row className='p-1'>
                    <Col md='12' className='CustomMapboxDesign'>
                        <small>Drag the marker to your location :</small>
                        <div className="Mlajanmap-container" >
                            <div id="Mlajanmap"></div>
                            <pre id="Mlajancoordinates" className="Mlajancoordinates">Lng: {location.lng ? location.lng.toFixed(4) : ''} <br />Lat: {location.lng ? location.lat.toFixed(4) : ''}</pre>
                        </div>
                    </Col>
                </Row>
            </Card>
        </Fragment>
    )
}

export default MapBox