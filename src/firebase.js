import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyBiivvt6Nn6R2SYJEMsghtZPm65DtRvCYk",
    authDomain: "contacts-9100c.firebaseapp.com",
    databaseURL: "https://contacts-9100c-default-rtdb.firebaseio.com",
    projectId: "contacts-9100c",
    storageBucket: "contacts-9100c.appspot.com",
    messagingSenderId: "86702163266",
    appId: "1:86702163266:web:457cf7ce50dd10fb47f4db"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase;