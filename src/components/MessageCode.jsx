import { React } from 'react'
import { Message } from '@chatscope/chat-ui-kit-react';
import PrismCode from './PrismCode.jsx'

const plugins = ["line-numbers","show-language"]

const MessageCode = ({texts, code_array, lang_array }) => {
    return (
      <div>
        {texts.map((text, i) => {
            const text_index = code_array.indexOf(text);
            if(text_index != -1){//代码块
              return <PrismCode key={i} language={lang_array[text_index]} code={code_array[text_index]} plugins={plugins}/>
            }else{//纯文本
              //return <Message key={i} model={text} />
              return <p>{text}</p>
            }
        })}
      </div>
    )
}

export default MessageCode
