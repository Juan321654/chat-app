import TextField from '@material-ui/core/TextField'
import './chat.css'

function Chat(props) {
 
  return (
    <div className="card">
      <form onSubmit={props.onSubmit}>
      <div className="render-chat">
        <h1>Chat Log</h1>
          {props.renderChat()}
        <div>
          <TextField
            name="message"
            onChange={e => props.onTextChange(e)}
            value={props.state.message}
            id="outlined-multiline-static"
            variant="outlined"
            label="Message"
          />

        </div>
      <button>Send Message</button>
      </div>
      </form>
    </div>
  )
}

export default Chat