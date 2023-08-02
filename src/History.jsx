import { useState, useEffect } from "react";

import './History.css'
import LoginUser from './components/LoginUser';
import ChatHistoryList from './components/ChatHistoryList';
import ChatGPTWarp from "./api/ChatGPTWarp.jsx";
import PrismCode from './components/PrismCode.jsx'

import { MessageSeparator } from '@chatscope/chat-ui-kit-react';

const chatGptWarp = new ChatGPTWarp();

const code = `
  import java.io.BufferedWriter;
  import java.io.FileWriter;
  import java.io.IOException;

  public class FileWriteExample {
      public static void main(String[] args) {
          String fileName = "example.txt";
          String content = "Hello, World!";

          try (BufferedWriter writer = new BufferedWriter(new FileWriter(fileName))) {
              writer.write(content);
              System.out.println("内容成功写入文件。");
          } catch (IOException e) {
              e.printStackTrace();
          }
      }
  }
`
const language = "java"
//const plugins = ["toolbar", "copy-to-clipboard", "line-numbers", "show-language", "autoloader"]
const plugins = ["toolbar", "copy-to-clipboard", "line-numbers"]

const History = () => {
  const [chat_history, setChatHistory] = useState([])
  useEffect(() => {
    chatGptWarp.queryLoginUser().then((lun) => {
      chatGptWarp.queryUserChatRecord('admin').then((chat_history_array) => {
        setChatHistory(chat_history_array)
      })
    })
  }, [])

  return (
    <div className="App">
      <div style={{ position:"relative", height: "800px", width: "400px", border:"1px solid #80808045" }}>
          <LoginUser/>
          <MessageSeparator>Chat History</MessageSeparator>
          <ChatHistoryList listData={chat_history} deleteData={setChatHistory}/>
          <PrismCode code={code} language={language} plugins={plugins}/>
      </div>
    </div>
  )
}

export default History
