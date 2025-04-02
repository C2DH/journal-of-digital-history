import React from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const DynamicForm = ({
  items,
  onChange,
  onAdd,
  onRemove,
  moveItem,
  errors,
  fieldConfig,
  title,
  maxItems = 10,
}) => {
  const { t } = useTranslation();

  console.log("🚀 ~ file: DynamicForm.tsx:12 ~ errors:", errors)

  return (
    <>
      <h3 className="progressiveHeading">{title}</h3>
      <div className="dynamic-list-form">
        {items.map((item, index) => (
          <div
            key={index}
            className="list-item d-flex align-items-top mb-2 ps-2 pe-1 pb-2 pt-0 border border-dark rounded shadow-sm"
            style={{
              position: 'relative',
              border: '1px solid #ccc',
              padding: '16px',
              marginBottom: '16px',
              borderRadius: '4px',
            }}
          >
            <div className="w-100 mt-2">
              {fieldConfig.map(({ label, fieldName, type = 'text' }) => (
                <div className="form-group" key={fieldName}>
                  <label htmlFor={`${fieldName}-${index}`}>{label}</label>
                  {type === 'textarea' ? (
                    <textarea
                      className="form-control"
                      id={`${fieldName}-${index}`}
                      value={item[fieldName]}
                      onChange={(e) => onChange(index, fieldName, e.target.value)}
                    ></textarea>
                  ) : (
                    <input
                      type={type}
                      className="form-control"
                      id={`${fieldName}-${index}`}
                      value={item[fieldName]}
                      onChange={(e) => onChange(index, fieldName, e.target.value)}
                    />
                  )}
                  {errors?.[index]?.[fieldName] && (
                    <div className="text-danger">{errors[index][fieldName]}</div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex-shrink-1">
              <Button
                size="sm"
                className="d-block rounded-circle border-dark border p-0 m-3"
                style={{ height: '25px', width: '25px', lineHeight: '23px' }}
                variant="warning"
                onClick={() => onRemove(index)}
              >
                ✕
              </Button>
              {index > 0 && (
                <Button
                  size="sm"
                  className="d-block rounded-circle p-0 m-3"
                  style={{ height: '25px', width: '25px', lineHeight: '25px' }}
                  variant="secondary"
                  onClick={() => moveItem(index, index - 1)}
                >
                  ↑
                </Button>
              )}
              {index < items.length - 1 && (
                <Button
                  size="sm"
                  className="d-block rounded-circle p-0 m-3"
                  style={{ height: '25px', width: '25px', lineHeight: '25px' }}
                  variant="secondary"
                  onClick={() => moveItem(index, index + 1)}
                >
                  ↓
                </Button>
              )}
            </div>
          </div>
        ))}
        {items.length < maxItems && (
          <button type="button" className="btn btn-secondary" onClick={onAdd}>
            {t('Add Item')}
          </button>
        )}
      </div>
      <hr />
    </>
  );
};

export default DynamicForm;