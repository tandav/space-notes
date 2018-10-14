import React, { Component } from 'react'
import Note from './Note'
import Files from './Files'
import SpaceHeader from './SpaceHeader'
import { host } from './index'
import { Redirect } from 'react-router-dom'
import './Space.css'
import NotFound from './NotFound';


// https://github.com/reactjs/rfcs/issues/26#issuecomment-365744134
// http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/

class Space extends Component {
  state = {
    notes: undefined,
    files: undefined,
    selectedNotes: new Set([]),
    redirect: '',
    page_not_found: false,
    space: undefined,
  }

  fetch_space(space) {
    // fetch files and notes of current space
    fetch(host + 'space/' + space)
      .then(response => { 
        if (response.ok) { return response.json() }
        else if (response.status === 404) { this.setState({page_not_found: true}) }
      })
      .then(json => this.setState({
        notes: json.notes,
        files: json.files,
      }))
  }

  componentDidMount() {
    this.fetch_space(this.props.match.params.space)
  }

  static getDerivedStateFromProps(next_props, prev_state)  {
    if (next_props.match.params.space !== prev_state.space) {
      return {
        space: next_props.match.params.space,
        notes: undefined,
        files: undefined,
      }
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    if (this.state.space !== prevProps.match.params.space) {
      // this.fetch_space(this.props.match.params.space)
      this.fetch_space(this.state.space)
    }
  }

  new_note() {
    // console.log(this.props.match.params.space)

    let opts = { 
      method: 'POST',
    }
    fetch(host + `${this.props.match.params.space}/note`, opts)
      .then(response => { if (response.ok) return response.json()})
      .then(new_note_json => this.setState(prevState => {
        return {
          notes: [...prevState.notes, new_note_json]
        }
      }))
  }

  empty_note() {
    let opts = { 
      method: 'POST',
    }
    fetch(host + `${this.props.match.params.space}/empty_note`, opts)
      .then(response => { if (response.ok) return response.json()})
      .then(new_note_json => this.setState(prevState => {
        return {
          notes: [...prevState.notes, new_note_json]
        }
      }))
  }


  new_link_note() {
    const new_space_name = window.prompt('Enter new space name')
    if (new_space_name) {
      let opts = { 
        method: 'POST',
      }
      fetch(host + 'space/' + this.props.match.params.space + '/' + new_space_name, opts)
        .then(response => { if (response.ok) return response.json()})
        .then(link_note_json => {
          this.setState(prevState => {
            return {
              notes: [...prevState.notes, link_note_json]
            }
          })
          window.open(`/space/${new_space_name}`)
        })
    }
  }

  delete_space() {
    if (window.confirm(`Are you sure you want to delete space ${this.props.space}?`)) {
      let opts = { 
        method: 'DELETE',
      }
      fetch(host + 'space/' + this.props.match.params.space, opts)
      .then(response => { 
        if (response.ok) {
          // this.setState({redirect: '/space/root'})
          this.props.history.push('/space/root')
          // console.log('Redirect...')
          // return <Redirect to='/space/root' />
        }
      })
    }
  }


  edit(hash) {
    console.log(hash)
    let opts = { 
      method: 'PATCH',
    }
    fetch(host + this.props.match.params.space + '/' + hash, opts)
      .then(response => { if (response.ok) return response.text()})
      .then(edited_html => {
        console.log(edited_html)
        this.setState(prevState => {
          return { 
            notes: prevState.notes.map(note => {
              if (note.hash === hash) {
                note.html = edited_html
              }
              return note
            })
          }
        })
      })
  }

  delete(hash) {
    if (window.confirm(`Are you sure you want to delete note ${hash}?`)) {
      let opts = { 
        method: 'DELETE',
      }
      fetch(host + this.props.match.params.space + '/' + hash, opts)
      .then(response => { 
        if (response.ok) {
          // delete deleted note from state
          this.setState(prevState => {
            return {
              notes: prevState.notes.filter(note => note.hash !== hash)
            }
          })
        }
      })
    }
  }

  add_image_to_state(note_hash, extension) {
    console.log(note_hash, extension)
    // const hash = image.split('.').slice(0, -1).join('.')
    this.setState(prevState => {
      // console.log('FROMsetState', hash)

      return { 
        notes: prevState.notes.map(note => {
          console.log(note.hash === note_hash)
          if (note.hash === note_hash) {
            note.image = note_hash + '.' + extension
          }
          return note
        })
      }
    })

  }



  render() {
    if (this.state.page_not_found) {
      return <NotFound message={`Space ${this.props.match.params.space} Not Found`} />
    }
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    else {
      document.title = this.props.match.params.space
      return this.state.notes ? (
        <div className='space'>
          <SpaceHeader 
            space ={this.props.match.params.space}
            new_note = { () => this.new_note() }
            empty_note = { () => this.empty_note() }
            new_link_note = { () => this.new_link_note() }
            delete_space = { () => this.delete_space() }
          />
          { this.state.files.length > 0 && <Files files={this.state.files} space={this.props.match.params.space}/> }
          <div className='notes'>
            {
              this.state.notes.map(note => 
                <Note 
                  hash = {note.hash}
                  space = {this.props.match.params.space}
                  html = {note.html}
                  image = {note.image}
                  editNote = {() => this.edit(note.hash)}
                  deleteNote = {() => this.delete(note.hash)}
                  selectedNotes = {this.state.selectedNotes}
                  selectionChanged ={() => this.note_select_handle(note.hash)}
                  upload_image = {this.upload_image}
                  add_image_to_state = {extension => this.add_image_to_state(note.hash, extension)}
                  key = {note.hash}
                />
              )
            }
          </div>            
        </div>
        ) : <h1>Loading...</h1>
    }
  }
}

export default Space
