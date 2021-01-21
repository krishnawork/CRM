import { combineReducers } from "redux";
let useremail = null;
let selectservicetype = null;
let select_service = null;
let Chat = null;
let seassion = null;

const User = (UserEmail = useremail, action) => {
  if (action.type === "ADD_EMAIL") {
    return action.payload.userEmail;
  }
  return UserEmail;
};

const Servicetype = (service = selectservicetype, action) => {
  if (action.type === "ADD_SERVICETYPE") {
    return action.payload.Service_type;
  }
  return service;
};

const SelectService = (Selectservice = select_service, action) => {
  if (action.type === "Select_SERVICE") {
    return action.payload.selectService;
  }
  return Selectservice;
};

const Chatstart = (chatstart = Chat, action) => {
  if (action.type === "CHAT") {
    return action.payload.chat;
  }
  return chatstart;
};

const Chat_Session = (chatseassion = seassion, action) => {
  if (action.type === "CHATSEASSION") {
    return action.payload.chatseassion;
  }
  return chatseassion;
};

export default combineReducers({
  User_Email_id: User,
  Select_Servicetype: Servicetype,
  Select_Service: SelectService,
  Chat: Chatstart,
  ChatSession: Chat_Session,
});
