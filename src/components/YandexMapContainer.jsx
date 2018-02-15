import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'

class YandexMapContainer extends Component {
  componentDidMount = async () => {
    await this.createMap()
    this.addMapEvents()
    this.createPlacemarksCollection()
    this.createPolyline()
  }

  componentWillReceiveProps(nextProps) {
    nextProps.placemarks.forEach((item, index) => {
      if (this.props.placemarks[index] !== item) this.updatePlacemarkInCollection(item, index)
    })

    if (this.props.placemarks.length <= nextProps.placemarks.length) return

    this.placemarksCollection.splice(
      nextProps.placemarks.length,
      this.props.placemarks.length - nextProps.placemarks.length
    )
    this.placemarksStringGeometry.splice(
      nextProps.placemarks.length,
      this.props.placemarks.length - nextProps.placemarks.length
    )

    this.updatePlacemarksIcons()
  }

  getAddressByCoordinates = async coordinates => {
    const objectsByCoordinates = await window.ymaps.geocode(coordinates, {
      results: 1,
    })
    return objectsByCoordinates.geoObjects.get(0)
  }

  updatePlacemarksIcons = () => {
    const collectionLength = this.placemarksCollection.getLength()
    this.placemarksCollection.each((placemark, index) => {
      let placemarkIcon = 'islands#grayIcon'
      let placemarkIconContent = ''

      if (index === 0) {
        placemarkIcon = 'islands#redStretchyIcon'
        placemarkIconContent = 'Начало'
      }
      if (index === collectionLength - 1) {
        placemarkIcon = 'islands#darkBlueStretchyIcon'
        placemarkIconContent = 'Конец'
      }

      placemark.options.set('preset', placemarkIcon)
      placemark.properties.set('iconContent', placemarkIconContent)
    })
  }

  updatePlacemarkInCollection(data, index) {
    const placemark = new window.ymaps.GeoObject(
      {
        geometry: {
          type: 'Point',
          coordinates: data.coordinates,
        },
        properties: {
          balloonContent: data.name,
          hintContent: 'Загрузка...',
        },
      },
      {
        draggable: true,
        preset: 'islands#grayIcon',
      }
    )

    if (index > this.placemarksCollection.getLength() - 1) this.placemarksCollection.add(placemark)
    else this.placemarksCollection.set(index, placemark)

    this.placemarksStringGeometry.set(index, placemark.geometry.getCoordinates())

    this.getAddressByCoordinates(placemark.geometry.getCoordinates()).then(addressObject => {
      placemark.properties.set('hintContent', addressObject.getAddressLine())
    })

    placemark.events.add('mouseenter', () => {
      placemark.hint.open()
    })

    placemark.events.add('dragend', () => {
      this.props.onPlacemarkCoordinatesUpdate(index, placemark.geometry.getCoordinates())
    })

    placemark.events.add('drag', () => {
      this.placemarksStringGeometry.set(index, placemark.geometry.getCoordinates())
    })
  }

  addMapEvents() {
    this.map.events.add('actiontick', e => {
      const tick = e.get('tick')
      const center = this.map.options
        .get('projection')
        .fromGlobalPixels(tick.globalPixelCenter, tick.zoom)
      this.props.onMapCenterUpdate(center)
    })
  }

  createPolyline = () => {
    this.placemarksStringGeometry = new window.ymaps.geometry.LineString()

    const placemarksPolyline = new window.ymaps.Polyline(
      this.placemarksStringGeometry,
      {},
      {
        draggable: false,
        strokeColor: '#000000',
        strokeWidth: 4,
        strokeOpacity: 0.6,
      }
    )

    this.map.geoObjects.add(placemarksPolyline)
  }

  createPlacemarksCollection() {
    this.placemarksCollection = new window.ymaps.GeoObjectCollection(
      {},
      {
        preset: 'islands#redCircleIcon',
        strokeWidth: 4,
        geodesic: true,
      }
    )

    this.placemarksCollection.events.add('add', this.updatePlacemarksIcons)
    this.placemarksCollection.events.add('set', this.updatePlacemarksIcons)

    this.map.geoObjects.add(this.placemarksCollection)
  }

  createMap() {
    return new Promise(resolve => {
      window.ymaps.ready(() => {
        this.map = new window.ymaps.Map(
          this.mapElement,
          {
            center: this.props.mapCenter,
            zoom: 12,
            controls: [],
          },
          {
            buttonMaxWidth: 300,
          }
        )
        resolve()
      })
    })
  }

  render() {
    return (
      <Map
        innerRef={element => {
          this.mapElement = element
        }}
      />
    )
  }
}

YandexMapContainer.propTypes = {
  placemarks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      coordinates: PropTypes.array.isRequired,
    })
  ).isRequired,
  mapCenter: PropTypes.arrayOf(PropTypes.number, PropTypes.number).isRequired,
  onMapCenterUpdate: PropTypes.func.isRequired,
  onPlacemarkCoordinatesUpdate: PropTypes.func.isRequired,
}

const Map = styled.div`
  width: 600px;
  height: 400px;
  padding: 10px;
`

export { YandexMapContainer as default, Map }
