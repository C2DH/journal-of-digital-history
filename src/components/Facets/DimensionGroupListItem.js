import React from 'react'
import { Button } from 'react-bootstrap'
import { X } from 'react-feather'

const DimensionGroupListItem = ({ group, isActive, onClick, onRemove }) => (
  <li
    className={`DimensionGroupListItem ${group.count > 0 && 'with-count'} ${isActive && 'active'}`}
  >
    <div
      className="DimensionGroupListItem_label"
      onClick={onClick}
    >
    {group.count > 0
      ? <span>{group.key}&nbsp;({group.count})</span>
      : <span>{group.key}&nbsp;({group.count})</span>
    }
    </div>
    {isActive && (
      <div className="DimensionGroupListItem_actions">
      <Button
        size="sm"
        variant="outline-secondary"
        onClick={onRemove}
        className="DimensionGroupListItem_actions_removeBtn"
      >
        <X size={14}/>
      </Button>
      </div>
    )}
  </li>
)

export default DimensionGroupListItem
