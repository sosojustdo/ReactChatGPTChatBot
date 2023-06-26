import { useState } from 'react'
import './History.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message} from '@chatscope/chat-ui-kit-react';

function History() {
  const [login_user_name, setLoginUserName] = useState('admin');

  return (
    <div className="App">
      <div style={{ position:"relative", height: "800px", width: "400px", border:"1px solid #80808045" }}>
          <div style={{ textAlign:"center"}}>
            <p>Long User:{login_user_name}</p>
            <button id="new_chat">New Chat</button>
          </div>
      </div>
    </div>
  )
}

export default History
