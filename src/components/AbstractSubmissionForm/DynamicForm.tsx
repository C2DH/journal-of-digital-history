import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import parse from 'html-react-parser';

import { getErrorByItemAndByField } from '../../logic/errors';
import {
  DynamicFormItem,
  DynamicFormProps,
  ErrorField,
  FieldEmptyHandler,
} from '../../interfaces/abstractSubmission';
import CloseButtonItem from '../Buttons/CloseButtonItem';
import ArrowUpButtonItem from '../Buttons/ArrowUpButtonItem';
import ArrowDownButtonItem from '../Buttons/ArrowDownButtonItem';

import '../../styles/components/AbstractSubmissionForm/DynamicForm.scss';

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
  const { t } = useTranslation();
  const [missing, setIsMissing] = useState<ErrorField>({});

  useEffect(() => {
    if (missingFields) {
      setIsMissing((prev) => ({
        ...prev,
        ...missingFields,
      }));
    }
  }, [missingFields]);

  const handleFieldEmpty: FieldEmptyHandler = (index, fieldName) => {
    setIsMissing((prev) => ({
      ...prev,
      [`${index}-${fieldName}`]: true,
    }));
  };
  console.log("🚀 ~ file: DynamicForm.tsx:18 ~ id:", id)
  return (
    <>
      <h3 className="progressiveHeading">{title}</h3>
      <p>{explanation}</p>
      <div className="dynamic-list-form">
        {items.map((item: DynamicFormItem, index: number) => (
          <div
            key={index}
            className="list-item d-flex align-items-top mb-2 ps-2 pe-1 pb-2 pt-0 border border-dark rounded shadow-sm"
          >
            <div className="w-100 mt-2">
              {fieldConfig.map(({ label, fieldName, type = 'text', placeholder, required }) => {
                const error = getErrorByItemAndByField(errors, id, index, fieldName);
                const isMissing =
                  missing[`${index}-${fieldName}`] || missingFields?.[`${id}/${index}/${fieldName}`];

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
                          isMissing ? (error ? 'is-invalid' : 'is-valid') : ''
                        }`}
                        id={`${fieldName}-${index}`}
                        value={item[fieldName]}
                        onChange={(e) => {
                          onChange(index, fieldName, e.target.value);
                          handleFieldEmpty(index, fieldName);
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
                            onChange(index, fieldName, e.target.checked);
                            handleFieldEmpty(index, fieldName);
                          }}
                        />
                        <label className="form-check-label" htmlFor={`${fieldName}-${index}`}>
                          {parse(t(`pages.abstractSubmission.${label}`))}
                        </label>
                      </div>
                    ) : (
                      <input
                        type={type}
                        className={`form-control ${
                          isMissing
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
                          onChange(index, fieldName, e.target.value);
                          handleFieldEmpty(index, fieldName);
                        }}
                        placeholder={t(`pages.abstractSubmission.placeholder.${placeholder}`)}
                      />
                    )}
                    {isMissing &&
                      (error ||
                        (fieldName === 'confirmEmail' && confirmEmailError) ||
                        (fieldName === 'githubId' && confirmGithubError)) && (
                        <div className="text-error form-text">
                          {fieldName === 'confirmEmail' && confirmEmailError
                            ? t('pages.abstractSubmission.errors.confirmEmailMismatch')
                            : fieldName === 'githubId' && confirmGithubError
                            ? t(
                                `pages.abstractSubmission.errors.${id}.${fieldName}.confirmInvalidGithub`,
                              )
                            : t(`pages.abstractSubmission.errors.${id}.${fieldName}.${error}`)}
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
            <div className="flex-shrink-1">
              {id === 'contact' ? (
                <div className="empty-space"> </div>
              ) : (
                <CloseButtonItem
                  index={index}
                  onRemove={(index) => {
                    onRemove(index);
                  }}
                />
              )}
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
  );
};

export default DynamicForm;