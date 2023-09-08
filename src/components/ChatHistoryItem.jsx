import deleteSvg from "../assets/delete.svg";
import ChatGPTWarp from "../api/ChatGPTWarp.jsx";

import { MessageSeparator } from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

const chatGptWarp = new ChatGPTWarp();

const ChatHistoryItem = ({ chat_record_num, chat_record_id, chat_content, deleteData }) => {
    const selectChat = async(e) => {
        chatGptWarp.selectChat(chat_record_id)
    }

    const deleteChat = async(e) => {
        chatGptWarp.deleteChat(chat_record_id, deleteData)
    }

    return (
        <div>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", alignItems: "center", justifyContent: "space-between" }}>
                <span>({chat_record_num})</span>
                <p style={{ textAlign: "left", width: "100%", wordBreak:"break-word" }} onClick={selectChat}>{chat_content}</p>
                <img style={{ minWidth: "25px", minHeight: "25px", width: "25px", height: "25px" }} src={deleteSvg} onClick={deleteChat}></img>
            </div>
            <MessageSeparator />
        </div>
    );
}

export default ChatHistoryItem
