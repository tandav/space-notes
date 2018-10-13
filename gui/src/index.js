import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

export const host = 'http://localhost:5000/'


ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
  ,document.getElementById('root')
)
