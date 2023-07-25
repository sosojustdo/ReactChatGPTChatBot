
import { useState, useEffect } from "react";

import './History.css'
import LoginUser from './components/LoginUser';
import ChatHistoryList from './components/ChatHistoryList';
const apiUrl = import.meta.env.VITE_API_URL;

import { MessageSeparator } from '@chatscope/chat-ui-kit-react';

async function queryUserChatRecord(setData){
  const response = await fetch(apiUrl + '/query_chat_record_user/',
  {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({"login_user_name":document.getElementById("login_user").innerText})
  });

  const chat_history_array = []
  const jsonData = await response.json();
  jsonData.data.forEach(data => {
      const chat_record_id = data.id
      const chat_history_record = data.chat_history
      const chat_record_num = chat_history_record.length
      const element = chat_history_record.find(e => {
          return e.role == 'user'
      });
      chat_history_array.push({"chat_record_id":chat_record_id, "chat_content":element.content, "chat_record_num":chat_record_num})
  });
  //console.log('chat_history_array', chat_history_array)
  if(chat_history_array != null && chat_history_array.length > 0){
    setData(chat_history_array)
  }
}

const History = () => {
  const [chat_history, setChatHistory] = useState([])
  useEffect(() => {queryUserChatRecord(setChatHistory)}, [])

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
