import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock2 = ({codeBlock, language}) => {
  return (
    <SyntaxHighlighter language={language} style={vscDarkPlus} customStyle={{ borderRadius:"0.7em 0.7em 0.7em 0.7em", padding:"0.6em 0.9em", fontSize:".91em" }} showLineNumbers="true" wrapLongLines="true">
      {codeBlock}
    </SyntaxHighlighter>
  );
};

export default CodeBlock2
