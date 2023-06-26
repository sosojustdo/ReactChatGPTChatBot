import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import History from './History'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

ReactDOM.createRoot(document.getElementById('history')).render(
  <React.StrictMode>
    <History />
  </React.StrictMode>,
)
