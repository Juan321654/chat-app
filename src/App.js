import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import io from 'socket.io-client'
import Airtable from 'airtable';

import Chat from './components/chat/Chat'

//TODO - add airtable and link input to setState on both socket.io and airtable to keep the records
//     - filter message content depending on active name and username

//this connects to the server index.js
const BASEID = process.env.REACT_APP_BASEID
const KEY = process.env.REACT_APP_KEY
const base = new Airtable({ apiKey: KEY }).base(BASEID)
const socket = io.connect('http://localhost:4000')


export default function App() {
  const [state, setState] = useState({ 
    message: '', 
    name: '', 
    username: ''});
    const [chat, setChat] = useState([]);
    const [airTableData, setAirTableData] = useState([]);
    const [airUserMessage, setAirUserMessage] = useState([]);

  // get the data from socket.io
  useEffect(() => {
    socket.on('message', ({ name, message, username }) => {
      setChat([...chat, { name, message, username }])
      console.log(message);
    })
  }, [chat])

  // get the data from the Airtable db
  useEffect(() => {
    base("table")
      .select({ view: 'Grid view' })
      .eachPage((records, fetchNextPage) => {
        console.log(records);
        setAirTableData(records);
        fetchNextPage();
      });
    base("usermessage")
      .select({ view: 'Grid view' })
      .eachPage((records, fetchNextPage) => {
        console.log(records);
        setAirUserMessage(records);
        fetchNextPage();
      });
  }, []);
  
  // Displays the name and username for the chat log
  const onTextChange = e => {
    setState({ ...state, 
      [e.target.name]: e.target.value, 
      [e.target.username]: e.target.value})
  }

  // when send message is clicked it will update the state
  const onMessageSubmit = e => {
    e.preventDefault()
    const { name, message, username } = state
    socket.emit('message', { name, message, username })
    setState({ message: '', name, username })
  }

  // renders the chat with the user name/message etc
  const renderChat = () => {
    return chat.map(({ name, message, username }, index) => (
      <div key={index}>
        <h3>
          {username}: <span>{message}</span>
        </h3>
      </div>
    ))
  }
  // mapping through message from air table
  const mappedUserData = airUserMessage.map(msg => (
    <div key={msg.id}>
      <p>{msg.fields.content}</p>
    </div>
  ))



  return (
    <div>
      {/* {mappedUserData} */}
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

      <Chat 
      onTextChange={onTextChange} 
      state={state} 
      renderChat={renderChat} 
      onSubmit={onMessageSubmit}
      mappedMessages={mappedUserData}
      />
    </div>
  )
}
