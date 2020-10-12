import React from "react";
import { useHistory } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

const Auth0ProviderWithHistory = ({ children, domain, clientId, redirectUri }) => {
  console.info('Auth0ProviderWithHistory', domain, clientId, redirectUri)
  const history = useHistory();
  const onRedirectCallback = (appState) => {
    console.info('Auth0ProviderWithHistory history', history, appState)
    history.push(appState?.returnTo || window.location.pathname)
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