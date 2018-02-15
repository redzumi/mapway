import React, { Component } from 'react'
import shortid from 'shortid'
import styled from 'styled-components'

import AddPlacemarkForm from './AddPlacemarkForm'
import SortablePlacemarksList from './SortablePlacemarksList'
import YandexMapContainer from './YandexMapContainer'

const DEFAULT_MAP_CENTER = [55.75120138894101, 37.62371955158138] // Moscow

class MapPlacemarksManager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      placemarks: [],
      mapCenter: DEFAULT_MAP_CENTER,
    }
  }

  handlePlacemarkCoordinatesUpdate = (index, coordinates) => {
    const placemarks = this.state.placemarks.slice()
    placemarks[index] = { ...placemarks[index], coordinates }
    this.setState({ placemarks })
  }

  handlePlacemarkAdd = placemark => {
    this.setState({
      placemarks: [
        ...this.state.placemarks,
        { id: shortid.generate(), coordinates: this.state.mapCenter, ...placemark },
      ],
    })
  }

  handlePlacemarksOrderUpdate = placemarks => {
    this.setState({ placemarks })
  }

  handlePlacemarkDelete = index => {
    const placemarks = this.state.placemarks.slice()
    placemarks.splice(index, 1)
    this.setState({ placemarks })
  }

  handleMapCenterUpdate = mapCenter => {
    this.setState({ mapCenter })
  }

  render() {
    return (
      <StyledContainer>
        <LeftPanel>
          <AddPlacemarkForm onPlacemarkAdd={this.handlePlacemarkAdd} />
          <SortablePlacemarksList
            placemarks={this.state.placemarks}
            onPlacemarksOrderUpdate={this.handlePlacemarksOrderUpdate}
            onPlacemarkDelete={this.handlePlacemarkDelete}
          />
        </LeftPanel>
        <YandexMapContainer
          placemarks={this.state.placemarks}
          onPlacemarkCoordinatesUpdate={this.handlePlacemarkCoordinatesUpdate}
          mapCenter={this.state.mapCenter}
          onMapCenterUpdate={this.handleMapCenterUpdate}
        />
      </StyledContainer>
    )
  }
}

const LeftPanel = styled.div`
  padding: 10px;
`

const StyledContainer = styled.div`
  display: flex;
`

export default MapPlacemarksManager
