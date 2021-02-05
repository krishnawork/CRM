import { combineReducers } from "redux";

let serviceAmount = 0;
let programAmount = 0;
let paidAmount = 0;
const ServiceAmount = (servceamount = serviceAmount, action) => {
  if (action.type === "ADD_SERVICE_AMOUNT") {
    return action.payload.amount;
  } else {
    return servceamount;
  }
};
const ProgramAmount = (programamount = programAmount, action) => {
  if (action.type === "ADD_PROGRAM_AMOUNT") {
    return action.payload.amount;
  } else {
    return programamount;
  }
};
const PaidTestAmount = (paidamamount = paidAmount, action) => {
  if (action.type === "ADD_PAID_AMOUNT") {
    return action.payload.amount;
  } else {
    return paidamamount;
  }
};
const ServiceName = (servicename = "", action) => {
  if (action.type === "ADD_SERVICE_NAME") {
    return action.payload.name;
  } else {
    return servicename;
  }
};
const ServiceProductName = (serviceproductname = "", action) => {
  if (action.type === "ADD_SERVICEPRODUCT_NAME") {
    return action.payload.name;
  } else {
    return serviceproductname;
  }
};
const ServiceSession = (servicesession = "", action) => {
  if (action.type === "ADD_SERVICE_SESSION") {
    return action.payload.session;
  } else {
    return servicesession;
  }
};

const ProgramName = (programname = "", action) => {
  if (action.type === "ADD_PROGRAM_NAME") {
    return action.payload.name;
  } else {
    return programname;
  }
};
const PaidTestName = (paidtestname = "", action) => {
  if (action.type === "ADD_PAIDTEST_NAME") {
    return action.payload.name;
  } else {
    return paidtestname;
  }
};
const SelectEmail = (selectemail = "", action) => {
  if (action.type === "ADD_Email_NAME") {
    return action.payload.name;
  } else {
    return selectemail;
  }
};

const FName = (fname = "", action) => {
  if (action.type === "ADD_FNAME") {
    return action.payload.name;
  } else {
    return fname;
  }
};
const LName = (lname = "", action) => {
  if (action.type === "ADD_LNAME") {
    return action.payload.name;
  } else {
    return lname;
  }
};
const MNumber = (mnumber = "", action) => {
  if (action.type === "ADD_MNUMBER") {
    return action.payload.name;
  } else {
    return mnumber;
  }
};

const Updatebillemail = (updatebillemail = "", action) => {
  if (action.type === "ADD_UPDATE_EMAIL") {
    return action.payload.email;
  } else {
    return updatebillemail;
  }
};
const Updatebillid = (updatebillid = "", action) => {
  if (action.type === "ADD_UPDATE_ID") {
    return action.payload.id;
  } else {
    return updatebillid;
  }
};
const Editbill = (editbill = false, action) => {
  if (action.type === "EDIT_BILL") {
    return action.payload.id;
  } else {
    return editbill;
  }
};

export default combineReducers({
  servceamount: ServiceAmount,
  programamount: ProgramAmount,
  paidamamount: PaidTestAmount,
  servicename: ServiceName,
  serviceproductname: ServiceProductName,
  servicesession: ServiceSession,
  programname: ProgramName,
  paidtestname: PaidTestName,
  selectemail: SelectEmail,
  fname: FName,
  lname: LName,
  mnumber: MNumber,
  updatebillemail: Updatebillemail,
  updatebillid: Updatebillid,
  editbill: Editbill,
});
