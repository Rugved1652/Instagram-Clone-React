/* eslint-disable no-unused-vars */
import "./App.css";
import React, { useState, useEffect } from "react";
import Post from "./components/Post";
import { auth, db } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import ImageUploader from "./components/ImageUploader";
import "./components/ImageUploader";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setopenSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user logged in...
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
          //dont-update username
        } else {
          //i fwe created some one...
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        //if user has logged out...
        setUser(null);
      }
    });
  }, [user, username]);

  useEffect(() => {
    db.collection("posts").orderBy('timestamp','desc').onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
  }, []);
  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
  };
  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setopenSignIn(false);
  };

  return (
    <div className="App">
{/* <h1>hey we are going to make an instagram clone</h1> */}
      <div className="app__header">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
                className="app__headerImage"
              />
            </center>
            <Input
              value={username}
              placeholder="Username"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              value={email}
              placeholder="Email"
              type="text"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              value={password}
              placeholder="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="button__signup" type="submit" onClick={signUp}>
              Signup
            </Button>
          </form>
        </div>
      </Modal>
      {/* <h1>hey we are going to make an instagram clone</h1> */}
      <Modal open={openSignIn} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
                className="app__headerImage"
              />
            </center>
            <Input
              value={email}
              placeholder="Email"
              type="text"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              value={password}
              placeholder="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="button__signup" type="submit" onClick={signIn}>
              SignIn
            </Button>
          </form>
        </div>
      </Modal>
      
        <img
          src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
          className="app__headerImage"
        />
         {user ? (
        <Button onClick={() => auth.signOut()}>Log-Out</Button>
      ) : (
        <div className="app__loginContainer">
          <Button onClick={() => setopenSignIn(true)}>Sign-In</Button>
          <Button onClick={() => setOpen(true)}>Sign-up</Button>
        </div>
      )}
      </div>
     
        <div className="app_post">

      {posts.map(({ id, post }) => (
        <Post
          key={id}
          postId={id }
          user={user}
          username={post.username}
          caption={post.caption}
          imageurl={post.imageurl}
        />
        ))}

        </ div>

      <div className="ImageUploader">
        
      {user?.displayName ? (
        <ImageUploader username={user.displayName} />
        ) : (
          <h2>sorry you need to log in to upload </h2>
          )}
          </div>
    </div>
  );
}

export default App;
