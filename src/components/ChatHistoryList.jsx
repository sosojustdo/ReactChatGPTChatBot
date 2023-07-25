import { useState, useEffect } from "react";

import {pubsub_topic_reload_select_chat, pubsub_topic_delete_chat_history} from "../Constant.jsx";
import ChatHistoryItem from "./ChatHistoryItem";

import PubSub from 'pubsub-js';

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

const selectChat = async(e) => {
    //console.log("selectChat:", e.target.getAttribute("crd"))
    const chat_record_id = e.target.getAttribute("crd")
    await fetch(apiUrl + '/query_chat_record/',
    {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({"chat_record_id":chat_record_id})
    }
    ).then((data) => {
        return data.json();
    }).then((data) => {
        if (data.code == 0) {
            const selectChatMessages = []
            data.data.forEach(data => {
                const sender = data.role == 'assistant'?'ChatGPT':'user'
                const chat_item = {"message":data.content, "sender":sender}
                if(sender == 'user'){
                    chat_item['direction'] = 'outgoing'
                }
                selectChatMessages.push(chat_item)
            });
            //console.log('selectChatMessages', selectChatMessages)
            PubSub.publish(pubsub_topic_reload_select_chat, selectChatMessages);
        }else{
            throw new Error('select chat record server error!')
        }
    });
}

const deleteChat = async(e) => {
    //console.log("deleteChat:", e.target.getAttribute("crd"))
    const chat_record_id = e.target.getAttribute("crd")
    await fetch(apiUrl + '/delete_chat_record/',
    {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({"chat_record_id":chat_record_id})
    }
    ).then((data) => {
        return data.json();
    }).then((data) => {
        if (data.code == 0) {
            PubSub.publish(pubsub_topic_delete_chat_history, chat_record_id);
        }else{
            throw new Error('delete chat record server error!')
        }
    });
}

const ChatHistoryList = () => {
    const [chat_history, setChatHistory] = useState([])
    useEffect(() => {queryUserChatRecord(setChatHistory)}, [])

    return(
        <ChatHistoryItem chat_history={chat_history} selectChat={setChatHistory} deleteChat={setChatHistory}/>
    );
}

export default ChatHistoryList;
