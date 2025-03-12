import React from "react";
import { useTranslation } from 'react-i18next'
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = ({className}) => {
  const { t } = useTranslation()
  const { logout } = useAuth0()
  return (
    <button className={className} onClick={() => logout({ returnTo: window.location.origin })}>
      {t('actions.logout')}
    </button>
  );
};

export default LogoutButton;