import { useState, useEffect } from "react";

import './History.css'
import LoginUser from './components/LoginUser';
import ChatHistoryList from './components/ChatHistoryList';
import ChatGPTWarp from "./api/ChatGPTWarp.jsx";

import { MessageSeparator } from '@chatscope/chat-ui-kit-react';

const chatGptWarp = new ChatGPTWarp();

const History = () => {
  const [chat_history, setChatHistory] = useState([])
  useEffect(() => {
    const login_user_name = document.getElementById("login_user").innerText
    chatGptWarp.queryUserChatRecord(login_user_name).then(data => {
      //console.log('queryUserChatRecord', data)
      setChatHistory(data)
    })
  }, [])

  return (
    <div className="App">
      <div style={{ position:"relative", height: "800px", width: "400px", border:"1px solid #80808045" }}>
          <LoginUser/>
          <MessageSeparator>Chat History</MessageSeparator>
          <ChatHistoryList listData={chat_history} deleteData={setChatHistory}/>
      </div>
    </div>
  )
}

export default History
