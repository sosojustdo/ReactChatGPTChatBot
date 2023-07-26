import { useState, useEffect } from "react";

import akaneAvatar from "../assets/akane.svg";
import eliotAvatar from "../assets/eliot.svg";
import emilyAvatar from "../assets/emily.svg";
import joeAvatar from "../assets/joe.svg";
import {pubsub_topic_reload_new_chat} from "../Constant.jsx";

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Avatar, ConversationHeader, Button } from '@chatscope/chat-ui-kit-react';

import PubSub from 'pubsub-js';

const apiUrl = import.meta.env.VITE_API_URL;

async function queryLoginUser(setData) {
  fetch(apiUrl + '/current_user/')
  .then(response => response.json())
  .then(result => {
    //console.log('login_user_name', result.data)
    if(result.data != ''){
      setData(result.data);
    }
  });
}

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
  useEffect(() => {queryLoginUser(setLoginUserName)}, [])

  return (
    <ConversationHeader>
        <Avatar src={joeAvatar} name={login_user_name} status="available" />
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
