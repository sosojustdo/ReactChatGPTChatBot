import { useState } from 'react'
import './History.css'

import LoginUser from './components/LoginUser';
import NewChatButton from './components/NewChatButton';
import ChatHistory from './components/ChatHistory';

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

function History() {
  return (
    <div className="App">
      <div style={{ position:"relative", height: "800px", width: "400px", border:"1px solid #80808045" }}>
          <div style={{ textAlign:"center"}}>
            <LoginUser/>
            <NewChatButton/>
          </div>
          <hr style={{ marginTop:"20px", border:"0.8px solid #80808045" }} />
      </div>
    </div>
  )
}

export default History
