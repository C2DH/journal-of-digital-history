import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';


export const getMatomoTracker = () => {
  if (typeof window !== 'undefined' && window.Matomo) {
    try {
      return window.Matomo.getAsyncTracker();
    } catch {
      return null;
    }
  }
  return null;
};


const MatomoOptOut = () => {

  const [isOptedOut, setIsOptedOut] = useState(getMatomoTracker() ? getMatomoTracker().isUserOptedOut() : false);
  const { t } = useTranslation();

  const handleChange = (e) => {
    const shouldOptOut = Boolean(e.target.checked);
    window._paq = window._paq || [];

    if (shouldOptOut) {
      window._paq.push(['optUserOut']);
    } else {
      window._paq.push(['forgetUserOptOut']);
    }

    setIsOptedOut(shouldOptOut);
  };
  
  return (
    <div className="matomo-optout my-3">
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="matomo-optout-checkbox"
          checked={isOptedOut}
          onChange={handleChange}
        />
        <label className="form-check-label" htmlFor="matomo-optout-checkbox">
          {t('matomoOptOut')}
        </label>
      </div>
    </div>
  )
}

export default MatomoOptOut;
