
import {joeModel} from "./Users.jsx"

import {pubsub_topic_reload_new_chat, initMessages} from "../Constant.jsx";

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Avatar, ConversationHeader, Button } from '@chatscope/chat-ui-kit-react';
import PubSub from 'pubsub-js';

const newChat = async () => {
  PubSub.publish(pubsub_topic_reload_new_chat, [initMessages]);
}

const LoginUser = ({ lun }) => {
  return (
      <ConversationHeader.Content>
        <div style={{ display:"flex", flexDirection:"row", justifyContent:"space-evenly", alignItems:"center" }}>
          <Avatar style={{ marginTop:"5px" }} src={joeModel.avatar} name={lun} status="available" />
          <span style={{ textAlign: "left"}} id="login_user">{lun}</span>
          <Button onClick={newChat} style={{ backgroundColor:"#c6e3fa" }}>New Chat</Button>
        </div>
      </ConversationHeader.Content>
  );
};

export default LoginUser;
