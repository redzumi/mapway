import React from 'react'
import { mount } from 'enzyme'
import createYandexMapMock from '../testHelpers/createYandexMapMock'
import YandexMapContainer from './YandexMapContainer'

let mapComponent
beforeEach(done => {
  window.ymaps = createYandexMapMock(done)
  mapComponent = mount(
    <YandexMapContainer
      placemarks={[]}
      mapCenter={[55.75120138894101, 37.62371955158138]}
      onMapCenterUpdate={jest.fn()}
      onPlacemarkCoordinatesUpdate={jest.fn()}
    />
  )
})

afterEach(() => {
  mapComponent.unmount()
})

describe('YandexMapContainer', () => {
  it('renders correctly', () => {
    expect(mapComponent).toMatchSnapshot()
  })

  it('updates placemark after addition', () => {
    const componentInstance = mapComponent.instance()
    const spyUpdatePlacemark = jest.spyOn(componentInstance, 'updatePlacemarkInCollection')

    componentInstance.componentWillReceiveProps({ placemarks: [{ name: 'Test placemark 1' }] })

    expect(spyUpdatePlacemark).toBeCalledWith({ name: 'Test placemark 1' }, 0)
  })
})
