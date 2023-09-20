import { useState, useEffect } from "react";

import './History.css'
import LoginUser from './components/LoginUser';
import ChatHistoryList from './components/ChatHistoryList';
import ChatGPTWarp from "./api/ChatGPTWarp.jsx";

import { MessageSeparator } from '@chatscope/chat-ui-kit-react';

const chatGptWarp = new ChatGPTWarp();

const History = () => {
  const [chat_history, setChatHistory] = useState([])
  const [login_user_name, setLoginUserName] = useState('')

  useEffect(() => {
    chatGptWarp.queryLoginUser().then((lun) => {
      setLoginUserName(lun)
      chatGptWarp.queryUserChatRecord(lun).then((chat_history_array) => {
        setChatHistory(chat_history_array)
      })
    })
  }, [])

  return (
    <div className="App">
      <div style={{ position:"relative", height: "798px", padding:"0 10px", border:"1px solid #d1dbe3"}}>
          <LoginUser lun={login_user_name}/>
          <MessageSeparator>Chat History</MessageSeparator>
          <ChatHistoryList listData={chat_history} deleteData={setChatHistory}/>
      </div>
    </div>
  )
}

export default History
