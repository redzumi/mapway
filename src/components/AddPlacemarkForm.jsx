import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'

const DEFAULT_PLACEMARK = { name: '' }

class AddPlacemarkForm extends Component {
  constructor(props) {
    super(props)
    this.state = { formData: DEFAULT_PLACEMARK }
  }

  handleChange = e => {
    this.setState({ formData: { ...this.state.formData, [e.target.name]: e.target.value } })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.onPlacemarkAdd(this.state.formData)
    this.setState({ formData: DEFAULT_PLACEMARK })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <StyledInput
          name="name"
          required
          placeholder="Новая точка маршрута"
          value={this.state.formData.name}
          onChange={this.handleChange}
        />
      </form>
    )
  }
}

AddPlacemarkForm.propTypes = {
  onPlacemarkAdd: PropTypes.func.isRequired,
}

const StyledInput = styled.input`
  background-color: #fff;
  width: 300px;
  font-family: 'Montserrat', sans-serif;
  padding-left: 10px;
  height: 60px;
  margin: 0px;
  outline: none;
  box-sizing: border-box;
  border: 1px solid #efefef;
  transition: all 0.25s;
  margin-bottom: 20px;
  &:focus {
    border: 1px solid #a7a7a7;
  }
`

export { AddPlacemarkForm as default, StyledInput }
