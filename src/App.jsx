import { React, useState, useEffect, useRef } from 'react'

import {pubsub_topic_reload_new_chat, pubsub_topic_reload_select_chat} from "./Constant.jsx";
import './App.css'
import ChatGPTWarp from "./api/ChatGPTWarp.jsx";
import MessageCode from './components/MessageCode.jsx'
import MessageTable from './components/MessageTable.jsx';

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import PubSub from 'pubsub-js';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const chatGptWarp = new ChatGPTWarp();

const codeRegex = /```(\w+)\n([^\`]*?)\n```/gm;
const codeBlockRegex = /```(\w+)\n([\s\S]+?)\n```/;

function App() {

  const isStreamingRef = useRef(false);

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

  //reload app useState data
  useEffect(() => {outerReloadAppMessagesData(setMessages)})

  const handleSend = async (message) => {
    //replace html or css for copy content
    //bugfix:https://github.com/chatscope/chat-ui-kit-react/issues/22
    message = message.replace(/<[^>]*>|\s+/g, '');
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
    chatGptWarp.requestChatGPTAndUpdateChatRecordStream(chatMessages, apiRequestBody, setMessages, setIsTyping, isStreamingRef)
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
    chatGptWarp.requestChatGPTAndUpdateChatRecord(chatMessages, apiRequestBody, setMessages, setIsTyping)
  }

  const outerReloadAppMessagesData = async(setMessages) => {
    PubSub.subscribe(pubsub_topic_reload_new_chat, (msg, data) => {
      if(!isStreamingRef.current){
        setMessages(data)
        document.getElementById("app_id").setAttribute("chat_record_id", 0)
      }
    });

    PubSub.subscribe(pubsub_topic_reload_select_chat, (msg, data) => {
      //data format:{'selectChatMessages':selectChatMessages, 'chat_record_id':chat_record_id}
      if(!isStreamingRef.current){
        setMessages(data.selectChatMessages)
        document.getElementById("app_id").setAttribute("chat_record_id", data.chat_record_id)
      }
    });
  }

  const includeTable = (message) => {
    return (message.indexOf(("|:-")) != -1 && message.indexOf(("-:|")) != -1) || (message.indexOf(("|-")) != -1 && message.indexOf(("-|")) != -1)
  }

  return (
    <div className="App" id='app_id' chat_record_id = '0'>
      <div style={{ position:"relative", height: "800px", width: "100%" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList loadingMorePosition="bottom" typingIndicator={isTyping ? <TypingIndicator content="Chat Is Typing..." /> : null}>
              {messages.map((message, i) => {
                if(i == messages.length-1 && isStreamingRef.current){
                  return (
                    <SyntaxHighlighter key={i} as="Message2" language="auto" style={vs2015} customStyle={{ overflowX:"auto", borderRadius:"0.7em 0.7em 0.7em 0.7em", padding:"1.9em 0.9em", fontSize:".91em" }} wrapLongLines="true">
                      {message.message}
                    </SyntaxHighlighter>
                  );
                }else{
                  const include_code = message.message.indexOf(("```")) != -1
                  const include_table = includeTable(message.message)
                  if(include_code){
                    const lang_array = []
                    const code_array = []
                    const codeMessages = message.message.match(codeRegex);
                    if(codeMessages){
                      const parsed_code = codeMessages.map((block) => {
                        const [_, lang, code] = block.match(codeBlockRegex);
                        lang_array.push(lang)
                        code_array.push(code)
                        return {
                          lang,
                          code
                        };
                      });
                    }
                    const texts = message.message.split(codeRegex).filter(t => t.trim() && lang_array.indexOf(t) == -1);
                    //remove warn:https://chatscope.io/storybook/react/?path=/story/documentation-recipes--page#changing-component-type-to-allow-place-it-in-container-slot
                    return <MessageCode as="Message2" key={i} texts={texts} code_array={code_array} lang_array={lang_array} />
                  }else if(include_table){
                    return <MessageTable as="Message2" key={i} texts={message.message.split('\n\n')}/>
                  }else{
                    return <Message key={i} model={message} />
                  }
                }
              })}
            </MessageList>
            <MessageInput attachButton={false} placeholder="Type Message Here..." onSend={handleSend}/>
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App
