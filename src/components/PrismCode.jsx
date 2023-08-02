import { React, useRef, useEffect } from 'react';
import Prism from "prismjs";

import 'prismjs/plugins/toolbar/prism-toolbar'
import 'prismjs/plugins/toolbar/prism-toolbar.css'

import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard'
//import 'prismjs/plugins/show-language/prism-show-language'
//import 'prismjs/plugins/autoloader/prism-autoloader'

import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-java'
import "prismjs/themes/prism-okaidia.css";

/**
import('prismjs').then(prism => {
    // 设置语言
    prism.languages = "java"
    // 设置插件
    prism.plugins = "line-numbers"

    // 然后进行高亮
    prism.highlightAll()

    console.log('prismjs dynamic loading', 123)
})
*/

const PrismCode = ({ code, language, plugins }) => {
    /**
    const ref = useRef(null);
    useEffect(() => {
        if (ref && ref.current) {
            import('prismjs').then(prism => {
                // 设置语言
                prism.languages = language
                // 设置插件
                prism.plugins = plugins
                // 然后进行高亮
                prism.highlightAll(ref.current)
            })
        }
    }, [code]);
     */

    useEffect(() => {
        Prism.languages = language
        Prism.plugins = plugins
        Prism.highlightAll();
    }, []);

    return (
        <pre className={plugins.join(" ")}>
            <code className={`language-${language}`}>
                {code}
            </code>
        </pre>
    );
}

export default PrismCode;
