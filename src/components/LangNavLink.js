import React from 'react'
import { NavLink } from 'react-router-dom'
import { useToWithLang } from '../logic/language'

export default function LangNavLink({ to, ...props }) {
  const toWithLang = useToWithLang(to)
  return <NavLink to={toWithLang} {...props} />
}