import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import firebase from "../../../firebase";
import "./userdetails.css";
import ChatRoom from "./ChatRoom";
import { useDispatch } from "react-redux";
import { AddServiceType, Selectservice } from "../action/Action";

let db = firebase.firestore();
//
const useStyles = makeStyles((theme) => ({
  main_container: {
    padding: theme.spacing(4),
    overflow: "auto",
    height: "90vh",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    borderRadius: 10,
    height: 50,
    cursor: "pointer",
  },
  psychology: {
    background: "linear-gradient(45deg, #8bc34a 30%, #a2cf6e 90%)",
    color: "white",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  },
  seassion: {
    background: "linear-gradient(45deg, #cddc39  30%, #d7e360 90%)",
    color: "white",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  },
  therapi: {
    background: "linear-gradient(45deg, #ff5722, 30%, #ff784e 90%)",
    color: "white",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  },
  white: {
    color: "white",
  },
}));
//

function UserDetails({ id }) {
  const [page, setpage] = useState(null);
  useEffect(() => {
    if (id) {
      setpage(<UserDetails2 id={id} />);
    }
  }, [id]);

  return <div>{page}</div>;
}

// ------------------------------------------------------
let UserDetails2 = ({ id }) => {
  let dispatch = useDispatch();
  const classes = useStyles();
  const [servicedata, setservicedata] = useState([]);
  const [programdata, setprogramdata] = useState([]);
  const [serviceLoading, setserviceLoading] = useState("Loading...");
  const [productLoading, setproductLoading] = useState("Loading...");
  useEffect(() => {
    db.collection("web_user")
      .doc(id)
      .collection("service")
      .orderBy("ChattimeDate", "desc")
      .onSnapshot((result) => {
        setservicedata([]);
        if (!result.empty) {
          result.forEach((d) => {
            setservicedata((old) => [...old, d]);
            console.log("id", d.id);
          });
        } else {
          setserviceLoading("Service Data Not Found");
        }
      });
    return () => {
      setserviceLoading("Loading...");
    };
  }, [id]);
  //
  useEffect(() => {
    db.collection("web_user")
      .doc(id)
      .collection("Programs")
      .onSnapshot((result) => {
        setprogramdata([]);
        if (!result.empty) {
          result.forEach((d) => {
            setprogramdata((old) => [...old, d]);
            console.log("sdsdsd", d.data());
          });
        } else {
          setproductLoading("Product Data Not Found");
        }
      });
    return () => {
      setproductLoading("Loading...");
    };
  }, [id]);

  let Serviceset = (id) => {
    dispatch(AddServiceType("service"));
    dispatch(Selectservice(id));
  };
  let Programset = (id) => {
    dispatch(AddServiceType("Programs"));
    dispatch(Selectservice(id));
  };
  return (
    <div>
      <div className={classes.main_container}>
        <h5 style={{ marginBottom: "30px" }}>Service Product</h5>
        <Grid container spacing={3}>
          {servicedata.length > 0
            ? servicedata.map((d, index) => {
                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    key={index}
                    className="hover_click"
                    onClick={() => Serviceset(d.id)}
                  >
                    <Card className={classes.root} variant="outlined">
                      <CardContent>
                        <Typography
                          className={classes.title}
                          color="textSecondary"
                          gutterBottom
                        >
                          service
                        </Typography>
                        <Typography variant="h5" component="h2">
                          {d.data().service_name}
                        </Typography>
                        <Typography
                          className={classes.pos}
                          color="textSecondary"
                        >
                          seassion:{d.data().seassion}
                          <br />
                          chatTime:{d.data().Chattime}
                          <br />
                          Book Date:{d.data().ChattimeDate}
                        </Typography>
                        <Typography variant="body2" component="p">
                          <br />
                          {d.data().service_type}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small">amount: {d.data().amount}</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })
            : serviceLoading}
        </Grid>
        <hr style={{ margin: "20px" }} />
        <h5 style={{ marginBottom: "30px" }}>Programs Product</h5>
        <Grid container spacing={3}>
          {programdata.length > 0
            ? programdata.map((d, index) => {
                return (
                  <Grid
                    item
                    xs={1}
                    sm={6}
                    key={index}
                    className="hover_click"
                    onClick={() => Programset(d.id)}
                  >
                    <Card className={classes.root} variant="outlined">
                      <CardContent>
                        <Typography
                          className={classes.title}
                          color="textSecondary"
                          gutterBottom
                        >
                          Programs
                        </Typography>
                        <Typography variant="h5" component="h2">
                          {d.data().service_name}
                        </Typography>
                        <Typography
                          className={classes.pos}
                          color="textSecondary"
                        >
                          seassion:{d.data().seassion}
                          <br />
                          chatTime:{d.data().Chattime}
                        </Typography>
                        <Typography variant="body2" component="p">
                          <br />
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small">amount: {d.data().amount}</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })
            : productLoading}
        </Grid>
      </div>
    </div>
  );
};

export default UserDetails;
