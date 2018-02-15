import Enzyme from 'enzyme'
import React16Adapter from 'enzyme-adapter-react-16'
import 'jest-styled-components' // eslint-disable-line

Enzyme.configure({ adapter: new React16Adapter() })
