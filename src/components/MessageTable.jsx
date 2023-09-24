import { React } from 'react'

const tableRegex  = /\|(.|\n)+?\|\n/g;

const MessageTable = ({texts}) => {
    return (
      <div style={{ marginTop:"5px", backgroundColor:"#c6e3fa", borderRadius:"0.7em 0.7em 0.7em 0.7em", padding:"0.6em 0.9em", maxWidth:"85%"}}>
        {texts.map((text, i) => {
            const is_table = tableRegex.test(text);
            if(is_table){
              const rows = text.split('\n')
              const table_columns = ['对比项'].concat(rows[0].split('|').filter(t => t.trim() && t != '' && t != '\n'))
              const table_data = rows.slice(2)
              return <InnerTable table_columns={table_columns} table_data={table_data}></InnerTable>
            }else{
              return <p key={i} style={{backgroundColor:"#c6e3fa", borderRadius:"0.7em 0.7em 0.7em 0.7em", padding:"0.6em 0.9em", fontSize:".91em"}}>{text}</p>
            }
        })}
      </div>
    )
}

const InnerTable = ({table_columns, table_data}) => {
  return (
    <table style={{ borderCollapse:"collapse" }}>
      <thead>
        <tr>
          {table_columns.map((column, c) => (
            <th key={c}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table_data.map((row, i) => (
          <tr key={i}>
            {row.split('|').map((td, j) => (
              <td key={j}>{td}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default MessageTable
