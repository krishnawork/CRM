import firebase from "firebase";
import "firebase/auth";

var firebaseConfig = {
  apiKey: "AIzaSyD5RX24N59XOCf11wLHNo9vf6mbwDWHPfU",
  authDomain: "chat-2write.firebaseapp.com",
  projectId: "chat-2write",
  storageBucket: "chat-2write.appspot.com",
  messagingSenderId: "979570073937",
  appId: "1:979570073937:web:71a712ff5010eabbfdb370",
  measurementId: "G-63PRF3YCGC",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

let auth = firebase.auth();
let provider = new firebase.auth.GoogleAuthProvider();
var provider2 = new firebase.auth.FacebookAuthProvider();

export { auth, provider, provider2 };
export default firebase;
