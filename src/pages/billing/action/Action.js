import React from "react";

export const AddServiceAmount = (amount) => {
  return {
    type: "ADD_SERVICE_AMOUNT",
    payload: {
      amount: amount,
    },
  };
};
export const AddProgramAmount = (amount) => {
  return {
    type: "ADD_PROGRAM_AMOUNT",
    payload: {
      amount: amount,
    },
  };
};
export const AddPaidAmount = (amount) => {
  return {
    type: "ADD_PAID_AMOUNT",
    payload: {
      amount: amount,
    },
  };
};
export const AddServiceName = (name) => {
  return {
    type: "ADD_SERVICE_NAME",
    payload: {
      name: name,
    },
  };
};
export const AddServiceProductName = (name) => {
  return {
    type: "ADD_SERVICEPRODUCT_NAME",
    payload: {
      name: name,
    },
  };
};
export const AddServiceSession = (session) => {
  return {
    type: "ADD_SERVICE_SESSION",
    payload: {
      session: session,
    },
  };
};
export const AddProgramName = (name) => {
  return {
    type: "ADD_PROGRAM_NAME",
    payload: {
      name: name,
    },
  };
};
export const AddPaidTestName = (name) => {
  return {
    type: "ADD_PAIDTEST_NAME",
    payload: {
      name: name,
    },
  };
};
export const fname = (name) => {
  return {
    type: "ADD_FNAME",
    payload: {
      name: name,
    },
  };
};
export const lname = (name) => {
  return {
    type: "ADD_LNAME",
    payload: {
      name: name,
    },
  };
};
export const mnumber = (name) => {
  return {
    type: "ADD_MNUMBER",
    payload: {
      name: name,
    },
  };
};
