import React from 'react'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const OrderByDropdown = ({
  values = [], // array of [{value:'abc', label:''}]
  title = 'title',
  selectedValue = '',
  onChange,
  disabled = false,
  id = 'dropdown-basic-button',
  size = 'sm',
  variant = 'outline-secondary',
}) => {
  const { t } = useTranslation()
  return (
    <DropdownButton
      disabled={disabled}
      id={id}
      onChange={onChange}
      title={title}
      variant={variant}
      size={size}
    >
      {values.map((item) => (
        <Dropdown.Item
          key={item.value}
          active={selectedValue === item.value}
          onClick={() => onChange(item)}
        >
          <span>{t(item.label ?? item.value)}</span>
        </Dropdown.Item>
      ))}
    </DropdownButton>
  )
}

export default OrderByDropdown
