import { React, useState, useEffect } from 'react'

import {pubsub_topic_reload_new_chat, pubsub_topic_reload_select_chat} from "./Constant.jsx";
import './App.css'
import ChatGPTWarp from "./api/ChatGPTWarp.jsx";
import MessageCode from './components/MessageCode.jsx'

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import PubSub from 'pubsub-js';

const chatGptWarp = new ChatGPTWarp();
const codeRegex = /```(\w+)\n([^\`]*?)\n```/gm;

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

    //await processMessageToChatGPT(newMessages);
    await processMessageToChatGPTStream(newMessages);
  };

  async function processMessageToChatGPTStream(chatMessages) {
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
    chatGptWarp.requestChatGPTAndUpdateChatRecordStream(chatMessages, apiRequestBody, setMessages, setIsTyping, setInputValue)
  }

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
      <div style={{ position:"relative", height: "800px", width: "1024px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList loadingMorePosition="bottom" typingIndicator={isTyping ? <TypingIndicator content="Chat Is Typing..." /> : null}>
              {messages.map((message, i) => {
                const include_code = message.message.indexOf(("```")) != -1
                if(include_code){
                  const lang_array = []
                  const code_array = []
                  const codeMessages = message.message.match(codeRegex);
                  const parsed_code = codeMessages.map((block) => {
                    const [_, lang, code] = block.match(/```(\w+)\n([\s\S]+?)\n```/);
                    lang_array.push(lang)
                    code_array.push(code)
                    return {
                      lang,
                      code
                    };
                  });

                  const texts = message.message.split(codeRegex).filter(t => t.trim() && lang_array.indexOf(t) == -1);
                  /**
                  console.log('parsed-code', parsed_code)
                  console.log('texts', texts)
                  console.log('lang_array', lang_array)
                  console.log('code_array', code_array)
                  console.log('xx', texts[1] === parsed_code[0].code)
                   */

                  //remove warn:https://chatscope.io/storybook/react/?path=/story/documentation-recipes--page#changing-component-type-to-allow-place-it-in-container-slot
                  return <MessageCode as="Message2" key={i} texts={texts} code_array={code_array} lang_array={lang_array} />
                }else{
                  //console.log('plainTextMessage', message)
                  return <Message key={i} model={message} />
                }
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
