import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const CodeBlock1 = ({codeBlock, language}) => {
  return (
    <SyntaxHighlighter language={language} style={vs2015} customStyle={{ overflowX:"auto", borderRadius:"0.7em 0.7em 0.7em 0.7em", padding:"0.6em 0.9em", fontSize:".91em" }} wrapLongLines="true">
      {codeBlock}
    </SyntaxHighlighter>
  );
};

export default CodeBlock1
