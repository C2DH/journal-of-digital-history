import React from 'react'
import { Link } from 'react-router-dom'
import { useToWithLang } from '../logic/language'

export default function LangLink({ to, disabled, ...props }) {
  const toWithLang = useToWithLang(to)
  if(disabled) {
    return <Link to={toWithLang} {...props} onClick={(e) => e.preventDefault()}/>
  }
  return <Link to={toWithLang} {...props} />
}
