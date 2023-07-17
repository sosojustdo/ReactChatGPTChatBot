import { useState, useEffect } from "react";

import akaneAvatar from "../assets/akane.svg";
import eliotAvatar from "../assets/eliot.svg";
import emilyAvatar from "../assets/emily.svg";
import joeAvatar from "../assets/joe.svg";
import chatIcon from "../assets/chat.png";
import deleteIcon from "../assets/delete.png";

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Avatar, ConversationList, Conversation, MessageSeparator } from '@chatscope/chat-ui-kit-react';

const apiUrl = import.meta.env.VITE_API_URL;

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

async function selectChat(e){
    alert("selectChat:" + e.target.getAttribute('chat_record_id'))
}

async function deleteChat(e){
    alert("deleteChat:" + e.target.getAttribute('chat_record_id'))
}

const ChatHistory = () => {
    const [chat_history, setChatHistory] = useState([])
        useEffect(() => {
        queryUserChatRecord(setChatHistory)
    }, [])


    //console.log('ch', chat_history)
    const conversationItems = chat_history.map((item) =>
        <div key={item.chat_record_id}>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ textAlign: "left" }}>{item.chat_content}</p>
                <img style={{ minWidth: "20px", minHeight: "20px", width: "20px", height: "20px" }} src={deleteIcon}></img>
            </div>
            <MessageSeparator />
        </div>
    );

    return(
        <div>{conversationItems}</div>
    );
}

export default ChatHistory;
