import React from 'react'
import { shallow } from 'enzyme'
import AddPlacemarkForm, { StyledInput } from './AddPlacemarkForm'

describe('AddPlacemarkForm styled components', () => {
  it('renders input correctly', () => {
    expect(shallow(<StyledInput />)).toMatchSnapshot()
  })
})

describe('AddPlacemarkForm', () => {
  it('renders correctly', () => {
    expect(shallow(<AddPlacemarkForm onPlacemarkAdd={() => {}} />)).toMatchSnapshot()
  })

  it('simulates add placemark event', () => {
    const onPlacemarkAdd = jest.fn()
    const renderedComponent = shallow(<AddPlacemarkForm onPlacemarkAdd={onPlacemarkAdd} />)

    renderedComponent
      .find('[name="name"]')
      .simulate('change', { target: { name: 'name', value: 'Test placemark name' } })
    renderedComponent.find('form').simulate('submit', { preventDefault() {} })

    expect(onPlacemarkAdd).toBeCalledWith({ name: 'Test placemark name' })
  })
})
