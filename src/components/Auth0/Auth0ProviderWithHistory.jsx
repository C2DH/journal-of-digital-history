import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'


const Auth0ProviderWithHistory = ({ children, domain, clientId, redirectUri, disabled }) => {
  const navigate = useNavigate();
  const onRedirectCallback = (appState) => {
    console.info('Auth0ProviderWithHistory history', navigate, appState)
    navigate(appState?.returnTo || window.location.pathname)
  }
  if (disabled) {
    return (
      <div className="Auth0Provider-disabled">{children}</div>
    )
  }
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={redirectUri}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
