import './Note.css'
import React, { Component } from 'react'
import { host } from './index'
import Dropzone from 'react-dropzone'
import { Link } from 'react-router-dom'

class Note extends Component {
  state = { dropzoneActive: false }

  onDragEnter() { this.setState({ dropzoneActive: true }) }
  onDragLeave() { this.setState({ dropzoneActive: false }) }
  
  upload_image(acceptedFiles, rejectedFiles) {
    // console.log(acceptedFiles)
    if (acceptedFiles.length > 0) {
      if (acceptedFiles.length > 1) {
        window.alert('You can upload only 1 file')
      }
      else {
        const file = acceptedFiles[0]
        let data = new FormData()
        data.append('file', file)

        let opts = { method: 'POST', body: data }
    
        fetch(host + 'space/' + this.props.space + '/' + this.props.hash + '/upload_image', opts)
          .then(response => { 
            if (response.ok) {
              this.props.add_image_to_state(file.name.split('.').slice(-1)[0])
            }
            else {
              window.alert('Response != OK')
            }
          })
      }
    }
    else {
      window.alert('You can upload only PNG, JPG, SVG')
    }
    this.setState({ dropzoneActive: false })
  }



// const Note = ({hash, html, editNote, deleteNote, selectionChanged, selectedNotes}) => {
  render() {
    const overlayStyle = {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      padding: '2.5em 0',
      background: 'rgba(0,0,0,0.5)',
      textAlign: 'center',
      color: '#fff'
    }


    let html = this.props.html


    let lines = html.split('\n')
    let first_line = lines[0]
    let linked_note_space = ''
    
    // linked notes starts with [space] lines
    if (/^\[.*\]$/.test(first_line)) {
      linked_note_space = first_line.slice(1, -1)
      html = lines.slice(1).join('\n')
    }

    const noteItem = 
      <section>
        <header className='note_header'>
          {/* <input type='checkbox' checked={selectedNotes.has(hash)} onChange={selectionChanged}></input> */}
          <code>{this.props.hash}</code>
          <a onClick={this.props.editNote}><code>[edit]</code></a>
          <a onClick={this.props.deleteNote}><code>[del]</code></a>
          {/* <hr/> */}
        </header>
        {
          this.props.image &&
          <a href =  {host + 'space/' + this.props.space + '/note/' + this.props.hash + '/' + this.props.image} >
            <img src={host + 'space/' + this.props.space + '/note/' + this.props.hash + '/' + this.props.image} alt='' />
          </a>
        }
        {linked_note_space && <Link to={'/space/' + linked_note_space}><h1>{linked_note_space}</h1></Link>}
        <div className='note_html' dangerouslySetInnerHTML={{__html: html}}></div>
      </section>
    
    if (this.props.image) {
      return noteItem
    }
    else {
      return (
        <Dropzone 
          disableClick
          style={{position: "relative"}}
          accept='image/jpeg, image/png, image/svg+xml'
          onDragEnter={this.onDragEnter.bind(this)}
          onDragLeave={this.onDragLeave.bind(this)}
          onDrop={(accepted, rejected) => this.upload_image(accepted, rejected)}
        >
          {noteItem}
          { this.state.dropzoneActive && <div style={overlayStyle}>Drop files...</div> }
        </Dropzone>
      )
    }

  }  

  // <Score active = {active}/>
}



// const Note = ({hash, html, editNote, deleteNote, selectionChanged, selectedNotes}) => {
//     return (
//       <Dropzone 
//       disableClick
//       style={{position: "relative"}}
//       accept='image/jpeg, image/png'
//       onDrop={(accepted, rejected) => this.onDrop(accepted, rejected)}
//       onDragEnter={this.onDragEnter.bind(this)}
//       onDragLeave={this.onDragLeave.bind(this)}
//       >
//         <section>
//         <header className='note_header'>
//           {/* <input type='checkbox' checked={selectedNotes.has(hash)} onChange={selectionChanged}></input> */}
//           <code>{hash}</code>
//           <a onClick={editNote}><code>[edit]</code></a>
//           <a onClick={deleteNote}><code>[del]</code></a>
//           {/* <hr/> */}
//         </header>
//         <div dangerouslySetInnerHTML={{__html: html}}></div>
//       </section>
      
//       { this.state.dropzoneActive && <div style={overlayStyle}>Drop files...</div> }
//       </Dropzone>
//     )
//     // <Score active = {active}/>
// }

export default Note