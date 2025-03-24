import React, { useState } from 'react';
import Ajv from 'ajv';
import ajvformat from 'ajv-formats';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FormData, ValidationErrors } from './interface/abstractSubmission';
import { schema } from './schema';

function AbstractSubmissionForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    abstract: '',
    contact: {
      firstName: '',
      lastName: '',
      affiliation: '',
      email: '',
      orcidUrl: '',
      githubId: '',
    },
    termsAccepted: false,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ajv = new Ajv();
    ajvformat(ajv);
    const validate = ajv.compile(schema);
    const isValid = validate(formData);

    if (!isValid) {
      setErrors(validate.errors as unknown as ValidationErrors);
    } else {
      console.log('Form submitted successfully:', formData);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = event.target;
    const checked = type === 'checkbox' ? (event.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => {
      if (id in prev.contact) {
        return {
          ...prev,
          contact: {
            ...prev.contact,
            [id]: value,
          },
        };
      }

      return {
        ...prev,
        [id]: type === 'checkbox' ? checked : value,
      };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="container my-5">
      <h3 className="progressiveHeading">
        {t('pages.abstractSubmission.TitleAndAbstractSectionTitle')}
      </h3>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          className="form-control"
          id="title"
          value={formData.title}
          onChange={handleInputChange}
        />
        {errors.title && <div className="text-danger">{errors.title[0].message}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="abstract">Abstract</label>
        <textarea
          className="form-control"
          id="abstract"
          value={formData.abstract}
          onChange={handleInputChange}
        ></textarea>
        {errors.abstract && <div className="text-danger">{errors.abstract[0].message}</div>}
      </div>
      <hr />
      <h3 className="progressiveHeading">
        {t('pages.abstractSubmission.ContactPointSectionTitle')}
      </h3>
      <div className="form-group">
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          className="form-control"
          id="firstName"
          value={formData.contact.firstName}
          onChange={handleInputChange}
        />
        {errors.firstName && <div className="text-danger">{errors.firstName[0].message}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          className="form-control"
          id="lastName"
          value={formData.contact.lastName}
          onChange={handleInputChange}
        />
        {errors.lastName && <div className="text-danger">{errors.lastName[0].message}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="affiliation">Affiliation</label>
        <input
          type="text"
          className="form-control"
          id="affiliation"
          value={formData.contact.affiliation}
          onChange={handleInputChange}
        />
        {errors.affiliation && <div className="text-danger">{errors.affiliation[0].message}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          className="form-control"
          id="email"
          value={formData.contact.email}
          onChange={handleInputChange}
        />
        {errors.email && <div className="text-danger">{errors.email[0].message}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="orcidUrl">ORCID URL</label>
        <input
          type="text"
          className="form-control"
          id="orcidUrl"
          value={formData.contact.orcidUrl}
          onChange={handleInputChange}
        />
        {errors.orcidUrl && <div className="text-danger">{errors.orcidUrl[0].message}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="githubId">GitHub Id</label>
        <input
          type="text"
          className="form-control"
          id="githubId"
          value={formData.contact.githubId}
          onChange={handleInputChange}
        />
        {errors.githubId && <div className="text-danger">{errors.githubId[0].message}</div>}
      </div>
      <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="termsAccepted"
          checked={formData.termsAccepted}
          onChange={handleInputChange}
        />
        <label className="form-check-label" htmlFor="termsAccepted">
          {t('pages.abstractSubmission.TermsAcceptance')}
          &nbsp;
          <Link to="/terms" target="_blank">
            Terms of Use
          </Link>
        </label>
        {errors.termsAccepted && <div className="text-danger">{errors.termsAccepted[0].message}</div>}
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}

export default AbstractSubmissionForm;