import React, { useState, useEffect } from "react";
import firebase from "../../firebase";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import FileSaver from "file-saver";
import generatePDF from "../../reportGenerator";
let db = firebase.firestore();
let store = firebase.storage();
//
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    borderRadius: 10,
    height: 50,
    cursor: "pointer",
  },

  white: {
    color: "white",
  },
}));
//

function Paid_test_details({ email }) {
  const classes = useStyles();
  const [Loadind, setLoadind] = useState("Loading");
  const [selfdata, setselfdata] = useState([]);
  useEffect(() => {
    if (email) {
      setselfdata([]);
      db.collection("All_order")
        .doc(email)
        .collection("order")
        .orderBy("BillNo", "asc")
        .onSnapshot((result) => {
          setselfdata([]);
          if (!result.empty) {
            result.forEach((d) => {
              setselfdata((old) => [...old, d]);
            });
          } else {
            setLoadind("Data Not Available");
          }
        });
    }
    return () => {
      setLoadind("Loading");
    };
  }, [email]);

  return (
    <div>
      <div>
        {selfdata.length > 0
          ? selfdata.map((d, index) => {
              return (
                <div
                  key={index}
                  style={{
                    display: "inline-block",
                    width: " 400px",
                    margin: "10px",
                  }}
                >
                  <Card className={classes.root} variant="outlined">
                    <CardContent>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        BillNo : {d.data().BillNo}
                      </Typography>

                      <Typography variant="h5" component="h2">
                        {d.data().service_name ? d.data().service_name : ""}
                        {d.data().test_name ? d.data().test_name : ""}
                      </Typography>
                      <Typography className={classes.pos} color="textSecondary">
                        type: <br />
                        {d.data().service_type ? d.data().service_type : ""}
                        {d.data().test_type ? d.data().test_type : ""}
                        <br />
                      </Typography>
                      <Typography variant="body2" component="p">
                        recieved amount : {d.data().amount}
                        <br />
                        {d.data().pending_amount
                          ? `pending amount : ${d.data().pending_amount}`
                          : ""}
                      </Typography>
                    </CardContent>
                    <CardActions></CardActions>
                  </Card>
                </div>
              );
            })
          : Loadind}
      </div>
    </div>
  );
}

export default Paid_test_details;
