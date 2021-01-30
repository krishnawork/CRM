import firebase from "../../firebase";
let db = firebase.firestore();

export async function getid(ssss) {
  let id = new Promise((myResolve, myReject) => {
    db.collection("Demo")
      .doc(ssss)
      .get()
      .then((r) => {
        myResolve(r.data().i_id);
      })
      .catch(() => {
        myReject("somthing is wrong");
      });
  });
  return id;
}

export async function incress(ssss, value) {
  let id = new Promise((myResolve, myReject) => {
    db.collection("Demo")
      .doc(ssss)
      .set({
        i_id: value + 1,
      })
      .then((r) => {
        myResolve("number incress");
      })
      .catch(() => {
        myReject("number is not incress");
      });
  });
  return id;
}
