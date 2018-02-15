import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'

const DragHandle = SortableHandle(() => (
  <span>
    <ReorderIcon className="material-icons">reorder</ReorderIcon>
  </span>
))

const SortableItem = SortableElement(({ value, onDelete }) => (
  <StyledLi>
    <DragHandle />
    {value}
    <DeleteIcon
      onClick={onDelete}
      onKeyPress={onDelete}
      role="button"
      tabIndex="0"
      className="material-icons delete-icon">
      delete
    </DeleteIcon>
  </StyledLi>
))

const SortableList = SortableContainer(({ items, onItemDelete }) => (
  <StyledUl>
    {items.map((value, index) => (
      <SortableItem
        key={value.id}
        index={index}
        value={value.name}
        onDelete={() => onItemDelete(value)}
      />
    ))}
  </StyledUl>
))

class SortablePlacemarksList extends Component {
  constructor(props) {
    super(props)
    this.state = { placemarks: this.props.placemarks }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.placemarks !== nextProps.placemarks)
      this.setState({ placemarks: nextProps.placemarks })
  }

  handleSortEnd = ({ oldIndex, newIndex }) => {
    const placemarks = arrayMove(this.state.placemarks, oldIndex, newIndex)
    this.props.onPlacemarksOrderUpdate(placemarks)
    this.setState({ placemarks })
  }

  handleItemDelete = item => {
    this.props.onPlacemarkDelete(this.state.placemarks.indexOf(item))
  }

  render() {
    return (
      <SortableList
        lockAxis="y"
        lockToContainerEdges
        useDragHandle
        items={this.state.placemarks}
        onItemDelete={this.handleItemDelete}
        onSortEnd={this.handleSortEnd}
      />
    )
  }
}

SortablePlacemarksList.propTypes = {
  placemarks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      coordinates: PropTypes.array,
    })
  ).isRequired,
  onPlacemarksOrderUpdate: PropTypes.func.isRequired,
  onPlacemarkDelete: PropTypes.func.isRequired,
}

const DeleteIcon = styled.i`
  cursor: pointer;
`

const ReorderIcon = styled.i`
  cursor: row-resize;
`

const StyledLi = styled.li`
  height: 60px;
  width: auto;
  padding: 0px 10px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  font-family: 'Montserrat', sans-serif;
  align-items: center;
  border-bottom: 1px solid #efefef;
  box-sizing: border-box;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`

const StyledUl = styled.ul`
  background-color: #f3f3f3;
  border: 1px solid #efefef;
  width: 300px;
  padding: 0px;
  margin: 0px;
  outline: none;
  user-select: none;
  & li {
    box-shadow: none;
  }
  &:active {
    cursor: row-resize;
  }
`

export { SortablePlacemarksList as default, StyledLi, StyledUl }
