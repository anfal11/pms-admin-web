import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

const LocationMarker = () => {
  const [position, setPosition] = useState(null)
  const map = useMapEvents({
    click() {
      map.locate()
    },
    locationfound(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    }
  })

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  )
}
const MapEvents = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Event Handling</CardTitle>
      </CardHeader>
      <CardBody>
        <p>Click on map to get to your current location.</p>
        <Map className='leaflet-map' center={{ lat: 51.505, lng: -0.09 }} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <LocationMarker />
        </Map>
      </CardBody>
    </Card>
  )
}
export default MapEvents
