import { useState, useEffect } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

async function queryUserChatRecord(setData){
    const response = await fetch(apiUrl + '/query_chat_record_user/',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"login_user_name":"Anonymous"})
    });

    const chat_history_array = []
    const jsonData = await response.json();
    jsonData.data.forEach(data => {
        const chat_record_id = data.id
        const chat_history_record = data.chat_history
        const element = chat_history_record.find(e => {
            return e.role == 'user'
        });
        chat_history_array.push({"chat_record_id":chat_record_id, "chat_content":element.content})
    });
    console.log('chat_history_array', chat_history_array)
    if(chat_history_array != null && chat_history_array.length > 0){
      setData(chat_history_array)
    }
}

const ChatHistory = () => {
    const [chat_history, setChatHistory] = useState([])
        useEffect(() => {
        queryUserChatRecord(setChatHistory)
    }, [])


    console.log('ch', chat_history)
    const listItems = chat_history.map((item, index) =>
        <li chat_record_id={item.chat_record_id}>{item.chat_content}</li>
    );
    return(
        <ul>{listItems}</ul>
    );
}

export default ChatHistory;
