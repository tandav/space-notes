import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = props => {
  let message = props.message ? props.message : '404 Page Not Found'
  return (
    <div>
      <h1 style={{ color: 'white', fontSize: '10rem' }}>{message}</h1>
      <Link to='/space/root'>root space</Link>
    </div>
  )
}

export default NotFound
