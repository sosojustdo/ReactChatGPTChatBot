import { React } from 'react'
import CodeBlock1 from './CodeBlock1.jsx'
import CodeBlock2 from './CodeBlock2.jsx'

const MessageCode = ({texts, code_array, lang_array }) => {
    return (
      <div style={{ marginTop:"5px", backgroundColor:"#c6e3fa", borderRadius:"0.7em 0.7em 0.7em 0.7em", padding:"0.6em 0.9em", maxWidth:"85%"}}>
        {texts.map((text, i) => {
            const text_index = code_array.indexOf(text);
            if(text_index != -1){
              return <CodeBlock1 key={i} language={lang_array[text_index]} codeBlock={code_array[text_index]} />
            }else{
              return <p key={i} style={{backgroundColor:"#c6e3fa", borderRadius:"0.7em 0.7em 0.7em 0.7em", padding:"0.6em 0.9em", fontSize:".91em"}}>{text}</p>
            }
        })}
      </div>
    )
}

export default MessageCode
