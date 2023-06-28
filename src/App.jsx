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
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setIsTyping(true);
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

    await fetch(apiUrl + 'chat_completion/',
    {
      method: "POST",
      headers: {
        //"Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      let Message = data.msg
      if (data.code == 0) {
        Message = data.data
      }
      setMessages([...chatMessages, {
        message: Message,
        sender: "ChatGPT"
      }]);
      setIsTyping(false);
    });
  }

  return (
    <div className="App">
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
