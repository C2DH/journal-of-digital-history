import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getErrorByItemAndByField } from './errors'
import { Author, Contact, Dataset, DynamicFormProps } from '../../interfaces/abstractSubmission'
import CloseButtonItem from '../Buttons/CloseButtonItem'
import ArrowUpButtonItem from '../Buttons/ArrowUpButtonItem'
import ArrowDownButtonItem from '../Buttons/ArrowDownButtonItem'

const DynamicForm = ({
  id,
  items = [],
  onChange,
  onAdd,
  onRemove,
  moveItem,
  errors,
  confirmEmailError,
  confirmGithubError,
  
  fieldConfig,
  title,
  explanation,
  buttonLabel,
  maxItems = 10,
}: DynamicFormProps) => {
  const { t } = useTranslation()
  const [touched, setTouched] = useState({})

  const handleFieldTouch = (index: number, fieldName: string) => {
    setTouched((prev) => ({
      ...prev,
      [`${index}-${fieldName}`]: true,
    }))
  }

  return (
    <>
      <h3 className="progressiveHeading">{title}</h3>
      <p>{explanation}</p>
      <div className="dynamic-list-form">
        {items.map((item: Dataset | Author | Contact, index: number) => (
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
              {fieldConfig.map(({ label, fieldName, type = 'text', placeholder, required }) => {
                const error = getErrorByItemAndByField(errors, id, index, fieldName)
                const isTouched = touched[`${index}-${fieldName}`]

                return (
                  <div className="form-group" key={label}>
                    {type !== 'checkbox' && (
                      <label htmlFor={`${fieldName}-${index}`}>
                        {t(`pages.abstractSubmission.${label}`)}
                        {required && <span className="text-accent"> *</span>}
                      </label>
                    )}
                    {type === 'textarea' ? (
                      <textarea
                        className={`form-control ${
                          isTouched ? (error ? 'is-invalid' : 'is-valid') : ''
                        }`}
                        id={`${fieldName}-${index}`}
                        value={item[fieldName]}
                        onChange={(e) => {
                          onChange(index, fieldName, e.target.value)
                          handleFieldTouch(index, fieldName)
                        }}
                        placeholder={t(`pages.abstractSubmission.placeholder.${placeholder}`)}
                        rows={5}
                      ></textarea>
                    ) : type === 'checkbox' ? (
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`${fieldName}-${index}`}
                          checked={Boolean(item[fieldName])}
                          onChange={(e) => {
                            onChange(index, fieldName, e.target.checked)
                            handleFieldTouch(index, fieldName)
                          }}
                        />
                        <label className="form-check-label" htmlFor={`${fieldName}-${index}`}>
                          {t(`pages.abstractSubmission.${label}`)}
                        </label>
                      </div>
                    ) : (
                      <input
                        type={type}
                        className={`form-control ${
                          isTouched
                            ? error ||
                            (fieldName === 'confirmEmail' && confirmEmailError) ||
                            (fieldName === 'githubId' && confirmGithubError)
                              ? 'is-invalid'
                              : 'is-valid'
                            : ''
                        }`}
                        id={`${fieldName}-${index}`}
                        value={item[fieldName]}
                        onChange={(e) => {
                          onChange(index, fieldName, e.target.value)
                          handleFieldTouch(index, fieldName)
                        }}
                        placeholder={t(`pages.abstractSubmission.placeholder.${placeholder}`)}
                      />
                    )}
                    {isTouched &&
                      (error ||
                        (fieldName === 'confirmEmail' && confirmEmailError) ||
                        (fieldName === 'githubId' && confirmGithubError)) && (
                        <div className="text-error form-text">
                          {fieldName === 'confirmEmail' && confirmEmailError
                            ? t('pages.abstractSubmission.errors.confirmEmailMismatch')
                            : fieldName === 'githubId' && confirmGithubError
                            ? t(`pages.abstractSubmission.errors.${id}.${fieldName}.confirmInvalidGithub`)
                            : t(`pages.abstractSubmission.errors.${id}.${fieldName}.${error}`)}
                        </div>
                      )}
                  </div>
                )
              })}
            </div>
            <div className="flex-shrink-1">
              <CloseButtonItem
                index={index}
                onRemove={(index) => {
                  onRemove(index)
                }}
              />
              {index > 0 && <ArrowUpButtonItem index={index} moveItem={moveItem} />}
              {index < items.length - 1 && (
                <ArrowDownButtonItem index={index} moveItem={moveItem} />
              )}
            </div>
          </div>
        ))}
        {items.length < maxItems && (
          <button type="button" className="btn btn-outline-dark btn-sm" onClick={onAdd}>
            {t(`actions.${buttonLabel}`)}
          </button>
        )}
      </div>
    </>
  )
}

export default DynamicForm
