import React, { Component } from 'react'
import Space from './Space'
import { Switch, Route, Link } from 'react-router-dom'
import { host } from './index'
import './App.css'
import NotFound from './NotFound'

class App extends Component {

  new_space() {
    const new_space_name = window.prompt('Enter new space name')
    if (new_space_name) {
      let opts = { 
        method: 'POST',
      }
      fetch(host + new_space_name, opts)
      .then(response => {
        if (response.ok) {
          window.open(`/space/${new_space_name}`)
        }
      })
      // .then(response => { if (response.ok) return response.text()})
      // .then(new_space_hash => {
      //   window.open(`/space/${new_space_hash}`)
      // })
    }
  }

  render() {
    return (
      <div className='App'>
        <header>
          <Link to='/space/root'><button>root</button></Link>
          <button onClick={() => this.new_space()}>
            <img className='button_icon' align='center' src='/new.png' alt=''/>
            new space
          </button>
        </header>
        <Switch> { /* render 1st matched route */ }
          <Route path='/space/:space' component={Space} />
          <Route path='/404' component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </div>
    )
  }
}

export default App
