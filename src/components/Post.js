import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "../firebase";
import firebase from "firebase";

function Post({ user, postId, username, caption, imageurl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);
  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__Avatar"
          alt={username}
          src="/static/avatar/1.jpg"
        ></Avatar>
        <h3 className="username">{username}</h3>
      </div>
      <img className="post__image" src={imageurl} alt="" />
      <h4 className="post__text">
        <strong>{username}</strong> {caption}
      </h4>

      <div className="post_comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong>&nbsp;{": "}
            {comment.text}
          </p>
        ))
    }
    </div>
    {user &&(
      <form className="post__commentbox">
        <input
          type="text"
          className="post__input"
          placeholder="Add a commment"
          as
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className="post__button"
          type="submit"
          disabled={!comment}
          onClick={postComment}
        >
          Post
        </button>
      </form>
      )}
    </div>
  );
}

export default Post;
