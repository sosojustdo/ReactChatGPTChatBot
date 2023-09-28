import {pubsub_topic_reload_select_chat, pubsub_topic_reload_new_chat, initMessages} from "../Constant.jsx";
const apiUrl = import.meta.env.VITE_API_URL;

import PubSub from 'pubsub-js';

//请求chatgpt成功后更新对话记录-流式
export const requestChatGPTAndUpdateChatRecordStream = async(chatMessages, apiRequestBody, setMessages, setIsTyping, isStreamingRef) => {
    const response = await fetch(apiUrl + '/chat_completion_stream/',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "lun": sessionStorage.getItem("lun")
        },
        body: JSON.stringify(apiRequestBody)
    });

    // 循环处理流式数据
    const reader = response.body.getReader();
    const value_test_array = []
    let loop_message = ""
    while(true) {
        const {done, value} = await reader.read();
        if(done) {
            const full_message = value_test_array.join("")
            let new_chat_messages = [...chatMessages, {
                message: full_message,
                sender: "ChatGPT"
            }]

            const local_update_messages = new_chat_messages.map(function (item, index, newMessages) {
                return {
                "content":item.message,
                "role":item.sender == "ChatGPT"?"assistant":"user"
                }
            })

            const updateChatBody = {
                "chat_record_id":document.getElementById("app_id").getAttribute("chat_record_id"),
                "chat_record_list":local_update_messages
            }

            fetch(apiUrl + '/update_chat_record/',
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "lun": sessionStorage.getItem("lun")
                },
                body: JSON.stringify(updateChatBody)
            }
            ).then((data) => {
                return data.json();
            }).then((data) => {
                if (data.code == 0) {
                    //console.log('update chat record', data.data);
                }else{
                    throw new Error('update chat record server error!')
                }
            });
            setIsTyping(false);
            isStreamingRef.current = false;
            break;
        }

        const valueText = new TextDecoder().decode(value);
        //console.log(valueText)
        value_test_array.push(valueText)
        loop_message = loop_message + valueText
        const loop_new_chat_messages = [...chatMessages, {
            message: loop_message,
            sender: "ChatGPT"
        }]
        setMessages(loop_new_chat_messages)
        isStreamingRef.current = true;
    }
}


//请求chatgpt成功后更新对话记录
export const requestChatGPTAndUpdateChatRecord = async(chatMessages, apiRequestBody, setMessages, setIsTyping) => {
    await fetch(apiUrl + '/chat_completion/',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "lun": sessionStorage.getItem("lun")
        },
        body: JSON.stringify(apiRequestBody)
    }).then((data) => {
        return data.json();
    }).then((data) => {
        let Message = data.msg
        if (data.code == 0) {
            Message = data.data
            let new_chat_messages = [...chatMessages, {
                message: Message,
                sender: "ChatGPT"
            }]

            //console.log('new_chat_messages', new_chat_messages)

            //ChatGpt成功响应后，更新对话记录
            const local_update_messages = new_chat_messages.map(function (item, index, newMessages) {
                return {
                "content":item.message,
                "role":item.sender == "ChatGPT"?"assistant":"user"
                }
            })

            const updateChatBody = {
                "chat_record_id":document.getElementById("app_id").getAttribute("chat_record_id"),
                "chat_record_list":local_update_messages
            }

            //console.log('updateChatBody', updateChatBody)
            fetch(apiUrl + '/update_chat_record/',
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "lun": sessionStorage.getItem("lun")
                },
                body: JSON.stringify(updateChatBody)
            }
            ).then((data) => {
                return data.json();
            }).then((data) => {
                if (data.code == 0) {
                    //console.log('update chat record', data.data);
                }else{
                    throw new Error('update chat record server error!')
                }
            });
            setMessages(new_chat_messages);
            setIsTyping(false);
        }else{
            throw new Error('ChatGpt server response have error!')
        }
    });
}


//保存对话
export const addChatRecord = async(createChatBody) => {
    await fetch(apiUrl + '/add_chat_record/',
    {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "lun": sessionStorage.getItem("lun")
        },
        body: JSON.stringify(createChatBody)
    }
    ).then((data) => {
        return data.json();
    }).then((data) => {
        //console.log(addChatRecord, data);
        if (data.code == 0) {
            document.getElementById("app_id").setAttribute("chat_record_id", data.data)
        }else{
            throw new Error('add chat record server error!')
        }
    });
}

//根据chat_record_id删除某次对话的记录
export const deleteChat = async(chat_record_id, deleteData) => {
    await fetch(apiUrl + '/delete_chat_record/',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "lun": sessionStorage.getItem("lun")
        },
        body: JSON.stringify({"chat_record_id":chat_record_id})
    }
    ).then((data) => {
        return data.json();
    }).then((data) => {
        if (data.code == 0) {
            deleteData(function(prev) {
                return prev.filter(item => item.chat_record_id != chat_record_id)
            })
            PubSub.publish(pubsub_topic_reload_new_chat, [initMessages]);
        }else{
            throw new Error('delete chat history server error!')
        }
    });
}

//根据chat_record_id查询某次对话的记录
export const selectChat = async(chat_record_id) => {
    await fetch(apiUrl + '/query_chat_record/',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "lun": sessionStorage.getItem("lun")
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

//根据当前登录用户获取历史对话记录
export const queryUserChatRecord = async(login_user_name) => {
    let chat_history_array = []
    await fetch(apiUrl + '/query_chat_record_user/',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "lun": sessionStorage.getItem("lun")
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

//同步查询当前登录人信息
export const queryLoginUser = () => {
    let login_user_name = ''
    fetch(apiUrl + '/current_user/')
    .then(data => data.json())
    .then(data => {
        if (data.code == 0) {
            login_user_name = data.data
        }else{
            throw new Error('queryLoginUser server error!')
        }
    });
    return login_user_name != ''?login_user_name:'anonymous'
}
