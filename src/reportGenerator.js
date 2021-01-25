import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";

// Date Fns is used to format the dates we receive
// from our API call
import { format } from "date-fns";

// define a generatePDF function that accepts a tickets argument
const generatePDF = (tickets) => {
  let lastname;
  let firstname;
  if (localStorage.getItem("isLoggedIn")) {
    lastname = JSON.parse(localStorage.getItem("userData")).last_name;
  } else {
    lastname = "";
  }
  if (localStorage.getItem("isLoggedIn")) {
    firstname = JSON.parse(localStorage.getItem("userData")).first_name;
  } else {
    firstname = "";
  }

  // initialize jsPDF
  const doc = new jsPDF();

  // define the columns we want and their titles
  // const tableColumn = ["Question"];
  // define an empty array of rows
  const tableRows = [];
  // for each ticket pass all its data into an array
  // tickets.forEach(ticket => {
  //   const ticketData = [
  //     ticket.question,
  //   ];
  //   tableRows.push(ticketData);
  // });

  if (
    localStorage.getItem("type") != "HTP" &&
    localStorage.getItem("type") != "CAT" &&
    localStorage.getItem("type") != "ROR" &&
    localStorage.getItem("type") != "TAT"
  ) {
    const tableColumn = ["Question", "Answer"];
    tickets.forEach((ticket) => {
      const ticketData = [ticket.question, ticket.answer];
      tableRows.push(ticketData);
    });
    doc.autoTable(tableColumn, tableRows, { startY: 20 });
  } else if (localStorage.getItem("type") == "HTP") {
    var x = 190,
      y = 27;
    const tableColumn = ["Question"];
    tickets.forEach((ticket) => {
      const ticketData = [ticket.question];
      tableRows.push(ticketData);
    });
    tickets.forEach((ticket) => {
      doc.addImage(ticket.answer, "JPEG", x, y, 15, 10);
      y = y + 11;
    });
    doc.autoTable(tableColumn, tableRows, {
      startY: 20,
      columnStyles: { 0: { columnWidth: 170 } },
    });
  } else {
    var x = 20,
      y = 35;
    const tableColumn = ["Answer"];

    tickets.forEach((ticket) => {
      const ticketData = [ticket.answer];
      tableRows.push(ticketData);
    });
    tickets.forEach((ticket) => {
      doc.addImage(ticket.question, "JPEG", x, y, 15, 15);
      y = y + 25;
    });
    doc.autoTable(tableColumn, tableRows, {
      startY: 20,
      columnStyles: { 0: { columnWidth: 120 } },
      margin: { left: 60 },
      styles: { rowHeight: 15 },
    });
  }
  // startY is basically margin-top
  const date = Date().split(" ");

  // we use a date string to generate our filename.
  const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
  // ticket title. and margin-top + margin-left
  // doc.addImage("../assets/images/google-icon.png", "JPEG", 15, 40, 180, 180);
  doc.text("Test result of " + lastname + " " + firstname, 14, 15);
  // we define the name of our PDF file.
  var blobPDF = doc.output("datauristring");
  var blob = doc.output();
  var formData = new FormData();
  formData.append("pdf", blob);

  doc.save(`report_${dateStr}.pdf`);
};

export default generatePDF;
