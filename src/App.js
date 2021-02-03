import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import io from 'socket.io-client'
import Chat from './components/chat/Chat'

//this connects to the server index.js
const socket = io.connect('http://localhost:4000')


export default function App() {
  const [state, setState] = useState({ 
    message: '', 
    name: '', 
    username: ''})
  const [chat, setChat] = useState([])

  useEffect(() => {
    socket.on('message', ({ name, message, username }) => {
      setChat([...chat, { name, message, username }])
      console.log(message);
    })
  },[])
  

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
    <div>
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
      </form>
      </div>

      <Chat onTextChange={onTextChange} state={state} renderChat={renderChat} onSubmit={onMessageSubmit}/>
    </div>
  )
}
