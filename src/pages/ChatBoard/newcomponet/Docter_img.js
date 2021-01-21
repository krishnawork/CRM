import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import firebase from "../../../firebase";
let db = firebase.firestore();
function Docter_img({ id }) {
  const [docter, setdocter] = useState();
  useEffect(() => {
    if (id) {
      db.collection("Main_user")
        .doc(id)
        .get()
        .then((result) => {
          if (result) {
            setdocter(result.data());
            console.log("ddfdfdfdf", result.data());
          }
        });
    }
    return () => {};
  }, [id]);
  return (
    <>
      {docter ? (
        <h6>
          <Avatar
            alt={docter.User}
            src={docter.User_Img}
            style={{ marginRight: "10px", marginTop: "5px" }}
          />
        </h6>
      ) : (
        ""
      )}
      {docter ? <h6 style={{ fontWeight: "bold" }}>{docter.User_Name}</h6> : ""}
      {/* <Avatar alt={docter.User} src={docter.User_Img} />; */}
      {/* <h6>
        <Avatar
          alt={docter.User}
          src="/static/images/avatar/1.jpg"
          style={{ marginRight: "10px", marginTop: "5px" }}
        />
      </h6>
      <h6>{id}</h6> */}
    </>
  );
}

export default Docter_img;
