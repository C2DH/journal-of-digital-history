import React from 'react'
import Auth0 from '../Auth0'
import { useAuth0 } from "@auth0/auth0-react";

export default function UserProfile() {
  const { user, isLoading, isAuthenticated, error } = useAuth0();
  if (isLoading) {
    return (
      <div className="nav-item">
        <div className="navbar-text">Loading ...</div>
      </div>
    )
  }
  console.info(isAuthenticated, error, user)
  if (!isAuthenticated) {
    return (
      <div className="nav-item">
      <Auth0.LoginButton/>
      </div>
    )
  }
  return (
    isAuthenticated && (
      <div className="nav-item">
        <div className="navbar-text d-flex align-items-center">
          <div>{user.nickname}</div>
          <Auth0.LogoutButton className="mx-2 btn-link" />
          <img src={user.picture} alt={user.name} style={{height:'20px'}}/>
        </div>
      </div>
    )
  );
};

