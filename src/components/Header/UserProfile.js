import React from 'react'
import Auth0 from '../Auth0'
import { Dropdown } from 'react-bootstrap'
import { useAuth0 } from '@auth0/auth0-react';

export default function UserProfile() {
  const { user, isLoading, isAuthenticated, error } = useAuth0();
  if (error) {
    console.warn(error);
  }
  if (isLoading) {
    return (
      <div className="nav-item">
        <div className="navbar-text">...</div>
      </div>
    )
  }
  if (!isAuthenticated) {
    return (
      <div className="nav-item">
      <Auth0.LoginButton/>
      </div>
    )
  }
  return (
    isAuthenticated && (
      <Dropdown className="nav-item" drop="down">
      <Dropdown.Toggle as="a" className="nav-link p-0">
        <img src={user.picture} alt={user.name} style={{height:'36px', borderRadius:'50%'}}/>
      </Dropdown.Toggle>
      <Dropdown.Menu className='dropdown-menu-right'>
        <Dropdown.Item>
          <Auth0.LogoutButton />
        </Dropdown.Item>
        <Dropdown.Item>
        {user.nickname}
        </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  );
};

