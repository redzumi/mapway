import React from 'react'
import { mount, shallow } from 'enzyme'
import SortablePlacemarksList, { StyledLi, StyledUl } from './SortablePlacemarksList'

const onPlacemarksOrderUpdate = jest.fn()
const onPlacemarkDelete = jest.fn()
const placemarks = [
  {
    id: 'id1',
    name: 'Name 1',
    coordinates: [55, 55],
  },
  {
    id: 'id2',
    name: 'Name 2',
    coordinates: [55, 55],
  },
]

describe('SortablePlacemarksList styled components', () => {
  it('renders ul correctly', () => {
    expect(shallow(<StyledUl />)).toMatchSnapshot()
  })

  it('renders li correctly', () => {
    expect(shallow(<StyledLi />)).toMatchSnapshot()
  })
})

describe('SortablePlacemarksList', () => {
  let renderedComponent
  beforeEach(() => {
    renderedComponent = mount(
      <SortablePlacemarksList
        placemarks={placemarks}
        onPlacemarksOrderUpdate={onPlacemarksOrderUpdate}
        onPlacemarkDelete={onPlacemarkDelete}
      />
    )
  })

  afterEach(() => {
    onPlacemarksOrderUpdate.mockReset()
    onPlacemarkDelete.mockReset()
  })

  it('renders correctly', () => {
    expect(renderedComponent).toMatchSnapshot()
  })

  it('reorders placemarks', () => {
    renderedComponent.instance().handleSortEnd({ oldIndex: 0, newIndex: 1 })

    expect(onPlacemarksOrderUpdate).toBeCalledWith([
      {
        id: 'id2',
        name: 'Name 2',
        coordinates: [55, 55],
      },
      {
        id: 'id1',
        name: 'Name 1',
        coordinates: [55, 55],
      },
    ])
  })

  it('deletes placemark from list', () => {
    renderedComponent
      .find('.delete-icon')
      .first()
      .simulate('click')

    expect(onPlacemarkDelete).toBeCalledWith(0)
  })
})
