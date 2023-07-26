import { useState, useEffect } from "react";

import deleteIcon from "../assets/delete.png";
import {pubsub_topic_reload_select_chat} from "../Constant.jsx";
import { MessageSeparator } from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

import PubSub from 'pubsub-js';
const apiUrl = import.meta.env.VITE_API_URL;



const ChatHistoryItem = ({ chat_record_id, chat_content, deleteData }) => {
    const selectChat = async(e) => {
        //console.log("selectChatHistory:", e.target.getAttribute("crd"))
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
                PubSub.publish(pubsub_topic_reload_select_chat, {'selectChatMessages':selectChatMessages, 'chat_record_id':chat_record_id});
            }else{
                throw new Error('select chat history server error!')
            }
        });
    }

    const deleteChat = async(e) => {
        //console.log("deleteChatHistory:", e.target.getAttribute("crd"))
        const crd = e.target.getAttribute("crd")
        await fetch(apiUrl + '/delete_chat_record/',
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({"chat_record_id":crd})
        }
        ).then((data) => {
            return data.json();
        }).then((data) => {
            if (data.code == 0) {
                deleteData(function(prev) {
                    return prev.filter(item => item.chat_record_id != crd)
                })
            }else{
                throw new Error('delete chat history server error!')
            }
        });
    }

    return (
        <div>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ textAlign: "left", width: "100%" }} crd = {chat_record_id} onClick={selectChat}>{chat_content}</p>
                <img style={{ minWidth: "20px", minHeight: "20px", width: "20px", height: "20px" }} crd = {chat_record_id} src={deleteIcon} onClick={deleteChat}></img>
            </div>
            <MessageSeparator />
        </div>
    );
}

export default ChatHistoryItem
