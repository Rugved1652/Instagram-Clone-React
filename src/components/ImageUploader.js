/* eslint-disable no-undef */
import React, { useState } from "react";
// import { Button } from "@material-ui/core";  
import { storage, db } from "../firebase";
import firebase from "firebase";
import './ImageUploader.css';

function ImageUploader({username}) {
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progress code
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        //Error message if anything goes Wrong....
        console.log(error);
        alert(error.message);
      },
      () => {
        //completeing the Upload function...
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            //post image inside db
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageurl: url,
              username: username,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="imageUpload">
        <progress className="imageupload__progressbar" value={progress} max="100"/>
        
          <input type="file" className="choosefilebutton"onChange={handleChange} />
        
      <input
        type="text"
        placeholder="Write a caption...."
        className="captionbar"
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />
      <button  className="uploadbutton" onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default ImageUploader;
