import ChatHistoryItem from "./ChatHistoryItem";

const ChatHistoryList = ({ listData, deleteData }) => {
    return(
        <div style={{ height:"720px", overflowY:"auto" }}>
            {listData.map((item, i) => {
                return(
                    <div key={i}>
                        <ChatHistoryItem chat_record_id={item.chat_record_id} chat_content={item.chat_content} deleteData={deleteData} />
                    </div>
                );
            })}
        </div>
    );
}

export default ChatHistoryList;
