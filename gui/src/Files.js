import React, { Component } from 'react'
import { host } from './index'
import './Files.css'

class Files extends Component {
  eval_from_space(script) {
    let opts = { 
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ script: script })
    }
    fetch(host + `space/${this.props.space}/eval`, opts)
      .then(response => { if (!response.ok) window.alert(response.status) })
  }
  
  open_in_finder  (filename) { this.eval_from_space(`open -R "${filename}"`) }
  open_in_terminal(filename) { this.eval_from_space(`open -a Terminal "${filename}"`) }
  open_in_sublime (filename) { this.eval_from_space(`open -a "Sublime Text" "${filename}"`) }

  render() {
    return (
      <div className='files'>
      <hr/>
      <h2>Files</h2>
      <table className='filelist'>
      <tbody>

      { 
        this.props.files.map(file => 
          <tr className='file_row' key={file.name} >
            <td>{ file.type === 'file' ?
              <img className='file_folder_icon' align='center' src='/file.png' alt=''/>
              :
              <img className='file_folder_icon' align='center' src='/folder.png' alt=''/>
            }
          </td>
          <td>{ file.name }</td>
          <td>
            <img 
              className='file_folder_icon' 
              align='center' 
              src='/finder.png'
              onClick={ () => this.open_in_finder(file.name) }
              alt=''
            />
          </td>                      
          <td>
            {
              file.type === 'folder' && 
              <img
                className='file_folder_icon'
                align='center'
                src='/terminal.png'
                onClick={ () => this.open_in_terminal(file.name) }
                alt=''
              />
            }
          </td>
          <td>
            <img
              className='file_folder_icon'
              align='center'
              src='/sublime.png'
              onClick={ () => this.open_in_sublime(file.name) }
              alt=''
            />
          </td>
        </tr>
        )
      }
      </tbody>
      </table>
      <hr/>
    </div>
    )
  }
}

export default Files
