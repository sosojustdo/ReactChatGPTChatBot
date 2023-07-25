import { useState, useEffect } from "react";

import deleteIcon from "../assets/delete.png";

import { MessageSeparator } from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

const ChatHistoryItem = ({chat_history, selectChat, deleteChat}) => {

    const conversationItems = chat_history.map((item, i) =>
        <div key={i}>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ textAlign: "left", width: "100%" }} crd = {item.chat_record_id} onClick={selectChat}>{item.chat_content}</p>
                <img style={{ minWidth: "20px", minHeight: "20px", width: "20px", height: "20px" }} crd = {item.chat_record_id} src={deleteIcon} onClick={deleteChat}></img>
            </div>
            <MessageSeparator />
        </div>
    );

    return (
        <div>{conversationItems}</div>
    );

}


export default ChatHistoryItem
