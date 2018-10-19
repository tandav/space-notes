import React, { Component } from 'react'
import { host } from './index'

class SpaceHeader extends Component {


  eval_from_space(script) {
    let opts = { 
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ script: script })
    }
    fetch(host + `space/${this.props.space}/eval`, opts)
      .then(response => { if (!response.ok) window.alert(response.status) })
  }
    



  note_select_handle(event, note_hash) {
    console.log(note_hash, event.target.checked)
  }

  finder_here() {
    fetch(host + 'space/' + this.props.space + '/finder')
  }

  terminal_here() {
    fetch(host + 'space/' + this.props.space + '/terminal')
  }

  sublime_here() {
    fetch(host + 'space/' + this.props.space + '/sublime')
  }

  jupyter_here() {
    this.eval_from_space('open ${PWD/$HOME/http://localhost:8888/tree}')
  }

  render() {
    return (
      <header className='space_header'>
        <button onClick={this.props.new_note}>
          <img className='button_icon' src='/new.png' alt=''/>
          new note
        </button>
        <button onClick={this.props.empty_note}>
          {/* <img className='button_icon' src='/new.png'/> */}
          empty note
        </button>
        <button onClick={this.props.new_link_note}>
          <img className='button_icon' src='/link.png' alt=''/>
          new link note
        </button>
        <button onClick={() => this.finder_here()}>
          <img className='button_icon' src='/finder.png' alt=''/>
          Finder Here
        </button>
        <button onClick={() => this.terminal_here()}>
          <img className='button_icon' src='/terminal.png' alt=''/>
          Terminal Here
        </button>
        <button onClick={() => this.sublime_here()}>
          <img className='button_icon' src='/sublime.png' alt=''/>
          Sublime Here
        </button>
        <button onClick={() => this.jupyter_here()}>
          <img className='button_icon' src='/jupyter.png' alt=''/>
          Jupyter Here
        </button>
        { 
          this.props.space !== 'root' && 
          <button onClick={this.props.delete_space}>
            <img className='button_icon' src='/trash.png' alt=''/>
            delete space
          </button> 
        }
      </header>
    )
  }
}

export default SpaceHeader
