import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Nice Chat Bot, Ask Me Anything...",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);

  //input status
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    setMessagesData(newMessages);
    setIsTyping(true);

    console.log('newMessages', newMessages)
    const chat_record_id = document.getElementById("app_id").getAttribute("chat_record_id")

    const local_messages = newMessages.map(function (item, index, newMessages) {
        return {
          "content":item.message,
          "role":item.sender == "ChatGPT"?"assistant":"user"
        }
    })

    //首次提问则创建对话记录
    if(chat_record_id == 0){
      const createChatBody = {
        "user_name":document.getElementById("login_user").innerText,
        "chat_record":local_messages
      }
      console.log('createChatBody', createChatBody)
      await fetch(apiUrl + '/add_chat_record/',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(createChatBody)
        }
      ).then((data) => {
        return data.json();
      }).then((data) => {
        //console.log(data);
        if (data.code == 0) {
          document.getElementById("app_id").setAttribute("chat_record_id", data.data)
        }else{
          throw new Error('add chat record server error!')
        }
      });
    }
    await processMessageToChatGPT(newMessages);
  };

  async function setMessagesData(newMessages) {
    setMessages(newMessages);
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

    await fetch(apiUrl + '/chat_completion/',
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      let Message = data.msg
      if (data.code == 0) {
        Message = data.data
        let new_chat_messages = [...chatMessages, {
          message: Message,
          sender: "ChatGPT"
        }]

        console.log('new_chat_messages', new_chat_messages)
        //ChatGpt成功响应后，更新对话记录
        const local_update_messages = new_chat_messages.map(function (item, index, newMessages) {
            return {
              "content":item.message,
              "role":item.sender == "ChatGPT"?"assistant":"user"
            }
        })

        const updateChatBody = {
          "chat_record_id":document.getElementById("app_id").getAttribute("chat_record_id"),
          "chat_record_list":local_update_messages
        }
        console.log('updateChatBody', updateChatBody)
        fetch(apiUrl + '/update_chat_record/',
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(updateChatBody)
          }
        ).then((data) => {
          return data.json();
        }).then((data) => {
          if (data.code == 0) {
            console.log('update chat record', data.data);
          }else{
            throw new Error('update chat record server error!')
          }
        });

        setMessages(new_chat_messages);
        setIsTyping(false);
      }else{
        throw new Error('ChatGpt server response have error!')
      }
    });
  }

  return (
    <div className="App" id='app_id' chat_record_id = '0'>
      <div style={{ position:"relative", height: "800px", width: "1024px"  }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              loadingMorePosition="bottom"
              typingIndicator={isTyping ? <TypingIndicator content="Chat Is Typing..." /> : null}
            >
              {messages.map((message, i) => {
                //console.log(message)
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput attachButton={false} placeholder="Type Message Here..." onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App
