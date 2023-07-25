import './History.css'

import LoginUser from './components/LoginUser';
import ChatHistoryList from './components/ChatHistoryList';

import { MessageSeparator } from '@chatscope/chat-ui-kit-react';

const History = () => {
  return (
    <div className="App">
      <div style={{ position:"relative", height: "800px", width: "400px", border:"1px solid #80808045" }}>
          <LoginUser/>
          <MessageSeparator>Chat History</MessageSeparator>
          <ChatHistoryList/>
      </div>
    </div>
  )
}

export default History
