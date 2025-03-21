import React from 'react'
import { Nav } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { useToWithLang } from '../logic/language'

export default function LangNavLink({ to, ...props }) {
  const toWithLang = useToWithLang(to)
  return <Nav.Link as={NavLink} to={toWithLang} end={to === '/'} {...props} />
}
