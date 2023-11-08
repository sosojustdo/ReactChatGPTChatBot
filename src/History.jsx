import { useState, useEffect } from "react";

import {joeModel} from "./components/Users.jsx";
import './History.css';
import ChatHistoryList from './components/ChatHistoryList';
import {queryLoginUser,queryUserChatRecord} from "./api/ChatGptProxy.jsx";
import {pubsub_topic_reload_new_chat, initMessages} from "./Constant.jsx";

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MessageSeparator, Avatar, ConversationHeader, Button } from '@chatscope/chat-ui-kit-react';

import PubSub from 'pubsub-js';

const newChat = async () => {
  PubSub.publish(pubsub_topic_reload_new_chat, [initMessages]);
}

const History = () => {
  const [chat_history, setChatHistory] = useState([])
  const [lun, setLun] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const login_user_name = await queryLoginUser(setLun)
        const records = await queryUserChatRecord(login_user_name);
        setChatHistory(records)
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchData();
  }, [])

  return (
    <div className="App">
      <div style={{ position:"relative", height: "798px", padding:"0 10px", border:"1px solid #d1dbe3"}}>
          <ConversationHeader.Content>
            <div style={{ display:"flex", flexDirection:"row", justifyContent:"space-evenly", alignItems:"center" }}>
              <Avatar style={{ marginTop:"5px" }} src={joeModel.avatar} name={lun} status="available" />
              <span style={{ textAlign: "left"}} id="login_user">{lun}</span>
              <Button onClick={newChat} style={{ backgroundColor:"#c6e3fa" }}>New Chat</Button>
            </div>
          </ConversationHeader.Content>
          <MessageSeparator>Chat History</MessageSeparator>
          <ChatHistoryList listData={chat_history} deleteData={setChatHistory}/>
      </div>
    </div>
  )
}

export default History
