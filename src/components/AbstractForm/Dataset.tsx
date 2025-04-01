import React from 'react';
import { useTranslation } from 'react-i18next';

const DatasetForm = ({ datasets, onChange, onAdd, onRemove, errors }) => {
  const { t } = useTranslation();

  return (
    <div className="dataset-form">
      <h3 className="progressiveHeading">{t('pages.abstractSubmission.DataSectionTitle')}</h3>
      {datasets.map((dataset, index) => (
        <div key={index} className="dataset-item">
          <div className="form-group">
            <label htmlFor={`dataset-link-${index}`}>Link URL</label>
            <input
              type="text"
              className="form-control"
              id={`dataset-link-${index}`}
              value={dataset.link}
              onChange={(e) => onChange(index, 'link', e.target.value)}
            />
            {errors?.[index]?.link && <div className="text-danger">{errors[index].link}</div>}
          </div>
          <div className="form-group">
            <label htmlFor={`dataset-description-${index}`}>Description</label>
            <textarea
              className="form-control"
              id={`dataset-description-${index}`}
              value={dataset.description}
              onChange={(e) => onChange(index, 'description', e.target.value)}
            ></textarea>
            {errors?.[index]?.description && (
              <div className="text-danger">{errors[index].description}</div>
            )}
          </div>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onRemove(index)}
            disabled={datasets.length === 1}
          >
            Remove Dataset
          </button>
        </div>
      ))}
      {datasets.length < 10 && (
        <button type="button" className="btn btn-secondary" onClick={onAdd}>
          Add Dataset
        </button>
      )}
    </div>
  );
};

export default DatasetForm;