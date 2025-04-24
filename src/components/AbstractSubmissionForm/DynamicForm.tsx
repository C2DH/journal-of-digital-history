import { useState, useEffect } from 'react'
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
}: DynamicFormProps) => {
  const { t } = useTranslation()
  const [missing, setIsMissing] = useState<ErrorField>({})
  const atLeastOneGithubIdError = errors?.find((error) => error.keyword === 'atLeastOneGithubId')
    ? parse(t('pages.abstractSubmission.errors.authors.atLeastOneGithubId'))
    : null
  const atLeastOnePrimaryContact = errors?.find(
    (error) => error.keyword === 'atLeastOnePrimaryContact',
  )
    ? parse(t('pages.abstractSubmission.errors.authors.atLeastOnePrimaryContact'))
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
      <div className="dynamic-list-form">
        {items.map((item: DynamicFormItem, index: number) => (
          <div key={index} className="list-item">
            <div className="fields-area mt-0">
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
                    <div className="form-group my-1" key={label}>
                      {type !== 'checkbox' && (
                        <label
                          htmlFor={`${fieldname}-${index}`}
                          className="d-flex align-items-center"
                        >
                          {t(`pages.abstractSubmission.${label}`)}
                          {required && <span className="text-accent"> *</span>}
                          {tooltip && (
                            <span
                              className="tooltip-icon material-symbols-outlined ms-2"
                              data-tooltip={t(`pages.abstractSubmission.tooltips.${tooltip}`)}
                            >
                              {'help'}
                            </span>
                          )}
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
                            data-test={`form-check-input-${id}-${fieldname}-${index}`}
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
                          } my-1`}
                          id={`${fieldname}-${index}`}
                          value={item[fieldname]}
                          onChange={(e) => {
                            onChange(index, fieldname, e.target.value)
                            handleFieldEmpty(index, fieldname)
                          }}
                          placeholder={t(`pages.abstractSubmission.placeholder.${placeholder}`)}
                          data-test={`form-control-${id}-${fieldname}-${index}`}
                        />
                      )}
                      <div
                        className="text-error form-text"
                        data-test={`error-message-${id}-${fieldname}`}
                      >
                        {fieldname === 'confirmEmail' && confirmEmailError
                          ? t('pages.abstractSubmission.errors.confirmEmailMismatch')
                          : fieldname === 'githubId' && confirmGithubError
                          ? t(`pages.abstractSubmission.errors.${id}.githubId.confirmInvalidGithub`)
                          : fieldname === 'githubId' && isMissing && atLeastOneGithubIdError
                          ? atLeastOneGithubIdError
                          : fieldname === 'primaryContact' && isMissing && atLeastOnePrimaryContact
                          ? atLeastOnePrimaryContact
                          : isMissing && error
                          ? t(`pages.abstractSubmission.errors.${id}.${fieldname}.${error}`)
                          : null}
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
              {index > 0 && (
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
    </>
  )
}

export default DynamicForm
