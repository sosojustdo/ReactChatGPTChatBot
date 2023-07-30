import { useState, useEffect } from "react";

import {joeModel} from "./Users.jsx"

import {pubsub_topic_reload_new_chat} from "../Constant.jsx";
import ChatGPTWarp from "../api/ChatGPTWarp.jsx";

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Avatar, ConversationHeader, Button } from '@chatscope/chat-ui-kit-react';
import PubSub from 'pubsub-js';

const chatGptWarp = new ChatGPTWarp();

const newChat = async () => {
  const initMessages = {
    message: "Hello, I'm Nice Chat Bot, Ask Me Anything...",
    sentTime: "just now",
    sender: "ChatGPT"
  }
  PubSub.publish(pubsub_topic_reload_new_chat, [initMessages]);
}

const LoginUser = () => {
  const [login_user_name, setLoginUserName] = useState('admin')
  useEffect(() => {
    chatGptWarp.queryLoginUser().then(data => {
      //console.log('login_user_name', data)
      setLoginUserName(data)
    })
  }, [])

  return (
    <ConversationHeader>
        <Avatar src={joeModel.avatar} name={login_user_name} status="available" />
        <ConversationHeader.Content>
          <div>
            <span style={{ textAlign: "left"}} id="login_user">{login_user_name}</span>
            <Button login_user_name={login_user_name} onClick={newChat} border>New Chat</Button>
          </div>
        </ConversationHeader.Content>
    </ConversationHeader>
  );
};

export default LoginUser;
