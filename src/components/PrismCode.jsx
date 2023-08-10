import React, { useRef, useEffect } from 'react'
//import Prism from "prismjs";
import Prism from "../prism.js";

import '../prism.js'
import '../prism.css'

const PrismCode = ({ code, language, plugins }) => {
    const ref = useRef(null)
    useEffect(() => {
        if (ref && ref.current) {
        Prism.highlightElement(ref.current)
        }
    }, [code])

    return (
        <pre className={plugins.join(" ")}>
            <code ref={ref} className={`prism-code language-${language}`}>
                {code}
            </code>
        </pre>
    );
}

export default PrismCode;
