import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import firebase from "../../firebase";
let db = firebase.firestore();
//
const useStyles = makeStyles({
  table: {
    width: "100%",
  },
});
function TestCount({ toptest }) {
  const classes = useStyles();
  const [paid, setpaid] = useState([]);
  const [sorting, setsorting] = useState(null);

  useEffect(() => {
    console.log("paidtest", paid);
    if (toptest) {
      if (toptest.length > 0) {
        toptest.map((d) => {
          let count = paid.map((v) => {
            if (d.test_name === v.name) {
              return { ...v, count: v.count + 1 };
            } else {
              return v;
            }
          });
          setpaid(count);
        });
      }
    }
  }, [toptest]);
  useEffect(() => {
    let sort = paid.sort((x, y) => {
      return y.count - x.count;
    });
    setsorting(sort);
    console.log("sort", sort);
  }, [paid]);

  useEffect(() => {
    db.collection("Paid")
      .get()
      .then((result) => {
        if (!result.empty) {
          result.forEach((data, key) => {
            setpaid((old) => [...old, { name: data.id, count: 0 }]);
          });
        }
      });
  }, []);
  return (
    <>
      <Col xl={6}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Test Name</TableCell>
                <TableCell align="right">Total Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sorting?.slice(0, 5).map((d) => {
                return (
                  <>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {d.name}
                      </TableCell>
                      <TableCell align="right">{d.count}</TableCell>
                    </TableRow>
                  </>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Col>
      <Col xl={6}></Col>
    </>
  );
}

export default TestCount;
