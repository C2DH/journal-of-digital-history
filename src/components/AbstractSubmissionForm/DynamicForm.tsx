import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import parse from 'html-react-parser'

import { getErrorByItemAndByField } from '../../logic/errors'
import {
  DynamicFormItem,
  DynamicFormProps,
  ErrorField,
  FieldEmptyHandler,
} from '../../interfaces/abstractSubmission'
import CloseButtonItem from '../Buttons/CloseButtonItem'
import ArrowUpButtonItem from '../Buttons/ArrowUpButtonItem'
import ArrowDownButtonItem from '../Buttons/ArrowDownButtonItem'

import '../../styles/components/AbstractSubmissionForm/DynamicForm.scss'

const DynamicForm = ({
  id,
  title,
  explanation,
  buttonLabel,
  fieldConfig,
  items = [],
  maxItems = 10,
  onChange,
  onAdd,
  onRemove,
  moveItem,
  errors,
  confirmEmailError,
  confirmGithubError,
  missingFields,
  isSubmitAttempted
}: DynamicFormProps) => {
  const { t } = useTranslation()
  const [missing, setIsMissing] = useState<ErrorField>({})
  const atLeastOneGithubIdError = errors?.find((error) => error.keyword === 'atLeastOneGithubId')
    ? parse(t('pages.abstractSubmission.errors.authors.atLeastOneGithubId'))
    : null
  useEffect(() => {
    if (missingFields) {
      setIsMissing((prev) => ({
        ...prev,
        ...missingFields,
      }))
    }
  }, [missingFields])

  const handleFieldEmpty: FieldEmptyHandler = (index, fieldname) => {
    setIsMissing((prev) => ({
      ...prev,
      [`${index}-${fieldname}`]: true,
    }))
  }

  return (
    <>
      <h3 className="progressiveHeading">{title}</h3>
      <p>{explanation}</p>
      {id === 'authors' && atLeastOneGithubIdError && (
          <div className={`text-${isSubmitAttempted? 'error': 'accent'} mt-2`}>{atLeastOneGithubIdError}</div>
      )}
      <div className="dynamic-list-form">
        {items.map((item: DynamicFormItem, index: number) => (
          <div
            key={index}
            className="list-item"
          >
            <div className="fields-area">
              {fieldConfig.map(
                ({ label, fieldname, type = 'text', placeholder, required, helptext }) => {
                  const error = getErrorByItemAndByField(errors, id, index, fieldname)
                  const isMissing =
                    missing[`${index}-${fieldname}`] ||
                    missingFields?.[`${id}/${index}/${fieldname}`]

                  return (
                    <div className="form-group" key={label}>
                      {type !== 'checkbox' && (
                        <label htmlFor={`${fieldname}-${index}`}>
                          {t(`pages.abstractSubmission.${label}`)}
                          {required && <span className="text-accent"> *</span>}
                        </label>
                      )}
                      {type === 'textarea' ? (
                        <textarea
                          className={`form-control ${
                            isMissing ? (error ? 'is-invalid' : 'is-valid') : ''
                          }`}
                          id={`${fieldname}-${index}`}
                          value={item[fieldname]}
                          onChange={(e) => {
                            onChange(index, fieldname, e.target.value)
                            handleFieldEmpty(index, fieldname)
                          }}
                          placeholder={t(`pages.abstractSubmission.placeholder.${placeholder}`)}
                          rows={5}
                        ></textarea>
                      ) : type === 'checkbox' ? (
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`${fieldname}-${index}`}
                            checked={Boolean(item[fieldname])}
                            onChange={(e) => {
                              onChange(index, fieldname, e.target.checked)
                              handleFieldEmpty(index, fieldname)
                            }}
                          />
                          <label className="form-check-label" htmlFor={`${fieldname}-${index}`}>
                            {parse(t(`pages.abstractSubmission.${label}`))}
                          </label>
                        </div>
                      ) : (
                        <input
                          type={type}
                          className={`form-control ${
                            isMissing
                              ? error ||
                                (fieldname === 'confirmEmail' && confirmEmailError) ||
                                (fieldname === 'githubId' && confirmGithubError)
                                ? 'is-invalid'
                                : 'is-valid'
                              : ''
                          }`}
                          id={`${fieldname}-${index}`}
                          value={item[fieldname]}
                          onChange={(e) => {
                            onChange(index, fieldname, e.target.value)
                            handleFieldEmpty(index, fieldname)
                          }}
                          placeholder={t(`pages.abstractSubmission.placeholder.${placeholder}`)}
                        />
                      )}
                      {isMissing && error && (
                        <div className="text-error form-text">
                          {fieldname === 'confirmEmail' && confirmEmailError
                            ? t('pages.abstractSubmission.errors.confirmEmailMismatch')
                            : fieldname === 'githubId' && confirmGithubError
                            ? t(
                                `pages.abstractSubmission.errors.${id}.githubId.confirmInvalidGithub`,
                              )
                            : t(`pages.abstractSubmission.errors.${id}.${fieldname}.${error}`)}
                        </div>
                      )}
                      {helptext && (
                        <div className="text-muted form-text">
                          {parse(t(`pages.abstractSubmission.${helptext}`))}
                        </div>
                      )}
                    </div>
                  )
                },
              )}
            </div>
            <div className="action-buttons">
              {id === 'contact' ? (
                <div className="empty-space"></div>
              ) : (
                <CloseButtonItem
                  index={index}
                  onRemove={(index) => {
                    onRemove(index)
                  }}
                />
              )}
              {index > 0 && moveItem && <ArrowUpButtonItem index={index} moveItem={moveItem} />}
              {index < items.length - 1 && moveItem &&(
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
