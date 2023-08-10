import { React } from 'react'
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
              //return <p key={i} style={{backgroundColor:"#c6e3fa", borderRadius:"0.7em 0.7em 0.7em 0.7em", padding:"0.6em 0.9em", whiteSpace:"pre-wrap", fontSize:".91em"}}>{text}</p>
              return <div key={i} style={{ marginTop:"5px"}} className='cs-message__content'>{text}</div>
            }
        })}
      </div>
    )
}

export default MessageCode
