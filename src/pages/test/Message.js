import React, { useState, useEffect } from "react";
import firebase from "../../firebase";
let db = firebase.firestore();

function Message({ email }) {
  const [selfdata, setselfdata] = useState();
  useEffect(() => {
    if (email) {
      setselfdata([]);
      db.collection("web_user")
        .doc(email)
        .collection("Paid")
        .where("Upload_file", "==", "")
        .onSnapshot((result) => {
          if (!result.empty) {
            setselfdata("Result Not Upload");
          } else {
            setselfdata("");
          }
        });
    }
    return () => {};
  }, [email]);
  return (
    <div>
      {/* {selfdata.length > 0
        ? selfdata.map((d) => {
            return <></>;
          })
        : ""} */}
      <p style={{ color: "red" }}>{selfdata}</p>
    </div>
  );
}

export default Message;
