import { useState, useEffect } from 'react'

import {pubsub_topic_reload_new_chat, pubsub_topic_reload_select_chat} from "./Constant.jsx";
import './App.css'
import ChatGPTWarp from "./api/ChatGPTWarp.jsx";

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import PubSub from 'pubsub-js';
import Prism from 'prismjs';

const chatGptWarp = new ChatGPTWarp();

function App() {
  //MessageList
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Nice Chat Bot, Ask Me Anything...",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);

  //MessageInput
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("")
  const [sendDisabled, setSendDisabled] = useState(true)
  useEffect(() => {setSendDisabled(inputValue.length===0)},[inputValue])

  //reload app useState data
  useEffect(() => {outerReloadAppMessagesData(setMessages, setInputValue)}, [])

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);

    const chat_record_id = document.getElementById("app_id").getAttribute("chat_record_id")

    //首次提问则创建对话记录
    if(chat_record_id == 0){
      const createChatBody = {
        "user_name":document.getElementById("login_user").innerText,
        "chat_record":newMessages.map(function (item, index, newMessages) {
          return {
            "content":item.message,
            "role":item.sender == "ChatGPT"?"assistant":"user"
          }
        })
      }
      chatGptWarp.addChatRecord(createChatBody)
    }
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
    });

    const apiRequestBody = {
      "messages": [
        ...apiMessages
      ]
    }

    chatGptWarp.requestChatGPTAndUpdateChatRecord(chatMessages, apiRequestBody, setMessages, setIsTyping, setInputValue)
  }

  return (
    <div className="App" id='app_id' chat_record_id = '0'>
      <div style={{ position:"relative", height: "800px", width: "1024px"  }}>
        <MainContainer>
          <ChatContainer>
            <MessageList loadingMorePosition="bottom" typingIndicator={isTyping ? <TypingIndicator content="Chat Is Typing..." /> : null}>
              {messages.map((message, i) => {
                const code_message = message.message.indexOf(("```")) != -1
                if(code_message){
                  console.log('code_message', code_message)
                  const lines = message.message.split('\n')
                  lines.map((line, i) => {
                    console.log('line', line)
                    return <Message key={i} model={line} />
                  })
                }
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput sendDisabled={sendDisabled} onChange={(val) => setInputValue(val)} value={inputValue} attachButton={false} placeholder="Type Message Here..." onSend={handleSend} onPaste={(evt) => {
                evt.preventDefault();
                setInputValue(evt.clipboardData.getData("text"));
            }}/>
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

const outerReloadAppMessagesData = async(setMessages, setInputValue) => {
  PubSub.subscribe(pubsub_topic_reload_new_chat, (msg, data) => {
    setMessages(data)
    setInputValue('')
    document.getElementById("app_id").setAttribute("chat_record_id", 0)
  });

  PubSub.subscribe(pubsub_topic_reload_select_chat, (msg, data) => {
    //data format:{'selectChatMessages':selectChatMessages, 'chat_record_id':chat_record_id}
    setMessages(data.selectChatMessages)
    setInputValue('')
    document.getElementById("app_id").setAttribute("chat_record_id", data.chat_record_id)
  });
}

export default App
