const apiUrl = import.meta.env.VITE_API_URL;

//根据当前登录用户获取历史对话记录
function queryUserChatRecord(login_user_name){
    const chat_history_array = []
    fetch(apiUrl + '/query_chat_record_user/',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"login_user_name":login_user_name})
        }
    ).then((data) => {
        return data.json();
    }).then((data) => {
        if (data.code == 0) {
            data.data.forEach(data => {
                const chat_record_id = data.id
                const chat_history_record = data.chat_history
                const chat_record_num = chat_history_record.length
                const element = chat_history_record.find(e => {
                    return e.role == 'user'
                });
                chat_history_array.push({"chat_record_id":chat_record_id, "chat_content":element.content, "chat_record_num":chat_record_num})
            });
        }else{
            throw new Error('queryUserChatRecord server error!')
        }
    })
    return chat_history_array
}

export {queryUserChatRecord}
