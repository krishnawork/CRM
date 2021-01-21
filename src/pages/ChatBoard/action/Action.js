import React from "react";
export const AddEmail = (email) => {
  return {
    type: "ADD_EMAIL",
    payload: {
      userEmail: email,
    },
  };
};

export const AddServiceType = (service) => {
  return {
    type: "ADD_SERVICETYPE",
    payload: {
      Service_type: service,
    },
  };
};

export const Selectservice = (selectservice) => {
  return {
    type: "Select_SERVICE",
    payload: {
      selectService: selectservice,
    },
  };
};

export const Chat_start = (id) => {
  return {
    type: "CHAT",
    payload: {
      chat: id,
    },
  };
};

export const Chat_seassion = (id) => {
  return {
    type: "CHATSEASSION",
    payload: {
      chatseassion: id,
    },
  };
};
