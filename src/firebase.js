// For Firebase JS SDK v7.20.0 and later, measurementId is optional


import firebase from "firebase";
const firebaseApp =firebase.initializeApp({
  
        apiKey: "AIzaSyA6C2SflIwV9pUv-hS6y6Vx8sAy6VzMX0I",
        authDomain: "instagram-clone-bd5f9.firebaseapp.com",
        databaseURL: "https://instagram-clone-bd5f9-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "instagram-clone-bd5f9",
        storageBucket: "instagram-clone-bd5f9.appspot.com",
        messagingSenderId: "355746109795",
        appId: "1:355746109795:web:b464b5dd25d3b25847db56",
        measurementId: "G-5TKM4HWLX4"

});

const db =firebaseApp.firestore();
const auth=firebase.auth();
const storage=firebase.storage();


export {db,auth,storage};