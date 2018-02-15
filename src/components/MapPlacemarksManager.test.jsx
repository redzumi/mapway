import React from 'react'
import { mount } from 'enzyme'
import createYandexMapMock from '../testHelpers/createYandexMapMock'
import MapPlacemarksManager from './MapPlacemarksManager'

let managerComponent
let managerInstance
beforeEach(done => {
  window.ymaps = createYandexMapMock(done)
  managerComponent = mount(<MapPlacemarksManager />)
  managerInstance = managerComponent.instance()
})

afterEach(() => {
  managerComponent.unmount()
})

describe('MapPlacemarksManager', () => {
  it('renders correctly', () => {
    expect(managerComponent).toMatchSnapshot()
  })

  it('handles placemark coords updating', () => {
    managerInstance.setState({
      placemarks: [{ id: 'id1', name: 'Test placemark 1', coordinates: [22, 22] }],
    })
    managerInstance.handlePlacemarkCoordinatesUpdate(0, [55, 55])

    expect(managerComponent.state().placemarks[0]).toEqual({
      id: 'id1',
      name: 'Test placemark 1',
      coordinates: [55, 55],
    })
  })

  it('handles placemark addition', () => {
    managerInstance.setState({ mapCenter: [22, 22] })
    managerInstance.handlePlacemarkAdd({ name: 'Test placemark 1' })

    expect(managerComponent.state().placemarks[0]).toEqual({
      name: 'Test placemark 1',
      id: expect.anything(),
      coordinates: [22, 22],
    })
  })

  it('handles placemark reordering', () => {
    managerInstance.setState({
      placemarks: [
        { id: 'id1', name: 'Test placemark 1', coordinates: [22, 22] },
        { id: 'id2', name: 'Test placemark 2', coordinates: [23, 23] },
      ],
    })

    managerInstance.handlePlacemarksOrderUpdate([
      { id: 'id2', name: 'Test placemark 2', coordinates: [23, 23] },
      { id: 'id1', name: 'Test placemark 1', coordinates: [22, 22] },
    ])

    expect(managerComponent.state().placemarks).toEqual([
      { id: 'id2', name: 'Test placemark 2', coordinates: [23, 23] },
      { id: 'id1', name: 'Test placemark 1', coordinates: [22, 22] },
    ])
  })

  it('handles placemark deletion', () => {
    managerInstance.setState({
      placemarks: [
        { id: 'id1', name: 'Test placemark 1', coordinates: [22, 22] },
        { id: 'id2', name: 'Test placemark 2', coordinates: [23, 23] },
      ],
    })

    managerInstance.handlePlacemarkDelete(1)

    expect(managerComponent.state().placemarks).toEqual([
      { id: 'id1', name: 'Test placemark 1', coordinates: [22, 22] },
    ])
  })

  it('handles map center updating', () => {
    managerInstance.setState({ mapCenter: [22, 22] })
    managerInstance.handleMapCenterUpdate([55, 55])

    expect(managerComponent.state().mapCenter).toEqual([55, 55])
  })
})
