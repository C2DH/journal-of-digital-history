import parse from 'html-react-parser'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  DynamicFormItem,
  DynamicFormProps,
  ErrorField,
  FieldEmptyHandler,
} from '../../../interfaces/abstractSubmission'
import { findErrorByKeyword, getErrorByItemAndByField } from '../../../logic/errors'
import ArrowDownButtonItem from '../../Buttons/ArrowDownButtonItem'
import ArrowUpButtonItem from '../../Buttons/ArrowUpButtonItem'
import CloseButtonItem from '../../Buttons/CloseButtonItem'
import Tooltip from '../../Tooltip'
import Affiliation from './Affiliation'

import '../../../styles/components/AbstractSubmissionForm/DynamicForm.scss'

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
  confirmGithubError,
  missingFields,
}: DynamicFormProps) => {
  const { t } = useTranslation()
  const [tooltipPlacement, setTooltipPlacement] = useState<'auto' | 'right'>('right')
  const [missing, setIsMissing] = useState<ErrorField>({})

  const atLeastOneGithubIdError = findErrorByKeyword(errors, 'atLeastOneGithubId')
  const atLeastOnePrimaryContact = findErrorByKeyword(errors, 'atLeastOnePrimaryContact')
  const requireConfirmEmailForPrimaryContact = findErrorByKeyword(
    errors,
    'requireConfirmEmailForPrimaryContact',
  )

  const getError = (fieldname: string, isMissing: boolean, error?: string) => {
    switch (true) {
      case fieldname === 'primaryContact' && isMissing && !!atLeastOnePrimaryContact:
        return 'atLeastOnePrimaryContact'

      case fieldname === 'confirmEmail' && isMissing && !!requireConfirmEmailForPrimaryContact:
        return 'requireConfirmEmailForPrimaryContact'

      case fieldname === 'githubId' && isMissing && !!atLeastOneGithubIdError:
        return 'atLeastOneGithubId'

      case fieldname === 'githubId' && !!confirmGithubError:
        return 'confirmInvalidGithub'

      case isMissing && !!error:
        return error

      default:
        return null
    }
  }

  useEffect(() => {
    if (missingFields) {
      setIsMissing((prev) => ({
        ...prev,
        ...missingFields,
      }))
    }
  }, [missingFields])

  useEffect(() => {
    const updatePlacement = () => {
      if (window.innerWidth < 768) {
        setTooltipPlacement('auto')
      } else {
        setTooltipPlacement('right')
      }
    }
    updatePlacement()
    window.addEventListener('resize', updatePlacement)
    return () => {
      window.removeEventListener('resize', updatePlacement)
    }
  }, [])

  const handleFieldEmpty: FieldEmptyHandler = (index, fieldname) => {
    setIsMissing((prev) => ({
      ...prev,
      [`${index}-${fieldname}`]: true,
    }))
  }

  return (
    <div>
      <h3 className="progressiveHeading">{title}</h3>
      <p>{explanation}</p>
      <div className="dynamic-list-form">
        {items.map((item: DynamicFormItem, index: number) => (
          <div key={index} className="list-item">
            <div className="fields-area">
              {fieldConfig.map(
                ({ label, fieldname, type = 'text', placeholder, required, helptext, tooltip }) => {
                  if (fieldname === 'confirmEmail' && !item.primaryContact) {
                    return null
                  }
                  const error = getErrorByItemAndByField(errors, id, index, fieldname)
                  const isMissing =
                    missing[`${index}-${fieldname}`] ||
                    missingFields?.[`${id}/${index}/${fieldname}`]

                  return (
                    <div className="form-group-custom" key={label}>
                      {type !== 'checkbox' && (
                        <label
                          htmlFor={`${fieldname}-${index}`}
                          className="d-flex align-items-center"
                        >
                          {t(`pages.abstractSubmission.${label}`)}
                          {required && <span className="text-accent"> *</span>}
                        </label>
                      )}
                      {type === 'textarea' ? (
                        <div className="input-group-custom">
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
                            data-test={`form-textarea-${id}-${fieldname}-${index}`}
                            rows={5}
                          ></textarea>
                          <div className="empty-space"></div>
                        </div>
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
                            data-test={`form-checkbox-${id}-${fieldname}-${index}`}
                          />
                          <label className="form-check-label" htmlFor={`${fieldname}-${index}`}>
                            {parse(t(`pages.abstractSubmission.${label}`))}
                          </label>
                        </div>
                      ) : fieldname === 'affiliation' ? (
                        <Affiliation
                          index={index}
                          value={item[fieldname]}
                          onChange={(val) => {
                            onChange(index, fieldname, val)
                            handleFieldEmpty(index, fieldname)
                          }}
                          placeholder={t(`pages.abstractSubmission.placeholder.${placeholder}`)}
                        />
                      ) : (
                        <div className="input-group-custom">
                          <input
                            type={type}
                            className={`my-1 form-control ${
                              isMissing
                                ? getError(fieldname, isMissing, error)
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
                            data-test={`form-control-${id}-${fieldname}-${index}`}
                          />
                          {tooltip && (
                            <Tooltip
                              tooltip={t(`pages.abstractSubmission.tooltips.${tooltip}`)}
                              tooltipPlacement={tooltipPlacement}
                              fieldname={fieldname}
                              index={index}
                            />
                          )}
                          {!tooltip && <div className="empty-space"></div>}
                        </div>
                      )}
                      <div
                        className="text-error form-text"
                        data-test={`error-message-${id}-${fieldname}-${index}`}
                      >
                        {(() => {
                          const errorKeyword = getError(fieldname, isMissing, error)
                          if (!errorKeyword) return null
                          return t(
                            `pages.abstractSubmission.errors.${id}.${fieldname}.${errorKeyword}`,
                          )
                        })()}
                      </div>
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
              {!(id === 'authors' && items.length === 1) && (
                <CloseButtonItem
                  index={index}
                  onRemove={(index) => {
                    onRemove(index)
                  }}
                />
              )}
              {index > 0 && moveItem && <ArrowUpButtonItem index={index} moveItem={moveItem} />}
              {index < items.length - 1 && moveItem && (
                <ArrowDownButtonItem index={index} moveItem={moveItem} />
              )}
            </div>
          </div>
        ))}
        {items.length < maxItems && (
          <button
            type="button"
            className="btn btn-outline-dark btn-sm"
            onClick={onAdd}
            data-test={`button-add-item-${id}`}
          >
            {t(`actions.${buttonLabel}`)}
          </button>
        )}
      </div>
    </div>
  )
}

export default DynamicForm
