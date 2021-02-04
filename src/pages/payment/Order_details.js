import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";
import firebase from "../../firebase";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
let db = firebase.firestore();

//
const useStyles = makeStyles((theme) => ({
  root: {},
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

function Paid_test_details({ email, setsetbill }) {
  const classes = useStyles();
  const [Loadind, setLoadind] = useState(null);
  const [selfdata, setselfdata] = useState([]);
  const [offlineselfdata, setofflineselfdata] = useState([]);

  useEffect(() => {
    if (email) {
      setselfdata([]);
      db.collection("All_order")
        .doc(email)
        .collection("Offline")
        .orderBy("BillNo", "desc")
        .onSnapshot((result) => {
          setofflineselfdata([]);
          if (!result.empty) {
            result.forEach((d) => {
              setofflineselfdata((old) => [...old, d]);
            });
          } else {
            setLoadind("Data Not Found");
          }
        });
    }
    return () => {
      setLoadind("Loading");
    };
  }, [email]);

  let setbillid = (id) => {
    setsetbill(id);
  };

  return (
    <div>
      <div>
        {/*  */}
        {offlineselfdata.length > 0
          ? offlineselfdata.map((d, index) => {
              return (
                <div
                  key={index}
                  style={{
                    display: "inline-block",
                    width: " 100%",
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
                        <div style={{ float: "left" }}>
                          BillNo : {d.data().BillNo}
                        </div>
                        <div style={{ float: "right" }}>Offline Bill</div>
                        <div style={{ clear: "both" }}></div>
                      </Typography>

                      <Typography className={classes.pos} color="textSecondary">
                        {d.data().servicename
                          ? `Service Name:` + d.data().servicename
                          : ""}
                        <br />
                        {d.data().programname
                          ? `Program Name:` + d.data().programname
                          : ""}
                        <br />
                        {d.data().paidtestname
                          ? `PaidTest Name:` + d.data().paidtestname
                          : ""}
                        <br />
                      </Typography>

                      <Typography variant="body2" component="p">
                        Total amount : {d.data().TotalAmoutn}
                        <br />
                        Recieved amount : {d.data().payAmount}
                        <br />
                        {d.data().pandingAmount > 0
                          ? `Pending amount : ${d.data().pandingAmount}`
                          : ""}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      {/* <button onClick={() => setbillid(d.id)}>Edit</button> */}
                      {d.data().pandingAmount > 0 ? (
                        <Button
                          // style={{ position: "relative", width: "100px" }}
                          color="primary"
                          onClick={() => setbillid(d.id)}
                        >
                          Edit{" "}
                          {/* <EditIcon
                            style={{
                              position: "absolute",
                              fontSize: "15px",
                              top: "0",
                              right: "10",
                            }}
                          /> */}
                        </Button>
                      ) : (
                        ""
                      )}
                    </CardActions>
                  </Card>
                </div>
              );
            })
          : Loadind}
        {/*  */}
      </div>
    </div>
  );
}

export default Paid_test_details;
