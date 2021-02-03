import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import TextField from '@material-ui/core/TextField'
import './chat.css'

//this connects to the server index.js
const socket = io.connect('http://localhost:4000')

function App() {
  const [state, setState] = useState({ 
    message: '', 
    name: '', 
    username: ''})
  const [chat, setChat] = useState([])

  useEffect(() => {
    socket.on('message', ({ name, message, username }) => {
      setChat([...chat, { name, message, username }])
      // console.log(message);
    })
  })
  

  const onTextChange = e => {
    setState({ ...state, 
      [e.target.name]: e.target.value, 
      [e.target.username]: e.target.value})
  }

  const onMessageSubmit = e => {
    e.preventDefault()
    const { name, message, username } = state
    socket.emit('message', { name, message, username })
    setState({ message: '', name, username })
  }

  const renderChat = () => {
    return chat.map(({ name, message, username }, index) => (
      <div key={index}>
        <h3>
          {username}: <span>{message}</span>
        </h3>
      </div>
    ))
  }

  return (
    <div className="card">

      <form onSubmit={onMessageSubmit}>
        <h1>Make an user</h1>

        <div className="name-field">
          <TextField
            name="name"
            onChange={e => onTextChange(e)}
            value={state.name}
            label="Name"
          />
        </div>
        <div className="name-field">
          <TextField
            name="username"
            onChange={e => onTextChange(e)}
            value={state.username}
            label="Username"
          />
        </div>

        <div>
          <TextField
            name="message"
            onChange={e => onTextChange(e)}
            value={state.message}
            id="outlined-multiline-static"
            variant="outlined"
            label="Message"
          />
        </div>

        <button>Send Message</button>
      </form>

      <div className="render-chat">
        <h1>Chat Log</h1>
        {renderChat()}
      </div>
    </div>
  )
}

export default App