import React, { Component } from 'react'
import { host } from './index'

class SpaceHeader extends Component {


  
    



  note_select_handle(event, note_hash) {
    console.log(note_hash, event.target.checked)
  }

  finder_here() {
    fetch(host + 'space/' + this.props.space + '/finder')
  }

  terminal_here() {
    fetch(host + 'space/' + this.props.space + '/terminal')
  }

  render() {
    return (
      <header>
        <button onClick={this.props.new_note}>
          <img className='button_icon' align='center' src='/new.png'/>
          new note
        </button>
        <button onClick={this.props.new_link_note}>
          <img className='button_icon' align='center' src='/link.png'/>
          new link note
        </button>
        <button onClick={() => this.finder_here()}>
          <img className='button_icon' align='center' src='/finder.png'/>
          Finder Here
        </button>
        <button onClick={() => this.terminal_here()}>
          <img className='button_icon' align='center' src='/terminal.png'/>
          Terminal Here
        </button>
        { 
          this.props.space !== 'root' && 
          <button onClick={this.props.delete_space}>
            <img className='button_icon' align='center' src='/trash.png'/>
            delete space
          </button> 
        }
      </header>
    )
  }
}

export default SpaceHeader
