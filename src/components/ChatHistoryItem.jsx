import deleteIcon from "../assets/delete.png";
import ChatGPTWarp from "../api/ChatGPTWarp.jsx";

import { MessageSeparator } from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

const chatGptWarp = new ChatGPTWarp();

const ChatHistoryItem = ({ chat_record_id, chat_content, deleteData }) => {
    const selectChat = async(e) => {
        chatGptWarp.selectChat(chat_record_id)
    }

    const deleteChat = async(e) => {
        chatGptWarp.deleteChat(chat_record_id, deleteData)
    }

    return (
        <div>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ textAlign: "left", width: "100%" }} onClick={selectChat}>{chat_content}</p>
                <img style={{ minWidth: "20px", minHeight: "20px", width: "20px", height: "20px" }} src={deleteIcon} onClick={deleteChat}></img>
            </div>
            <MessageSeparator />
        </div>
    );
}

export default ChatHistoryItem
