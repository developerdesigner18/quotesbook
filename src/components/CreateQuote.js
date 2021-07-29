import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CreateIcon from "@material-ui/icons/Create";
import ImageIcon from "@material-ui/icons/Image";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import AddIcon from "@material-ui/icons/Add";
import clsx from "clsx";
import "./CreateQuote.css";

import {
  Avatar,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
} from "@material-ui/core";

import "./CreateQuote.css";
import { db, imageStore, timeStamp } from "../firebase/config";
import firebase from "firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  icon: {
    cursor: "pointer",
  },
  card: {
    width: "345px",
    marginBottom: "20px",
  },
  collapse: {},
}));

export default function CreateQuote({ currentUser }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Quote Upload
  const [quote, setQuote] = useState("");

  // Image Upload
  const [imageError, setImageError] = useState(null);

  const types = ["image/png", "image/jpeg"];

  const [selectedImage, setSelectedImage] = useState(null);

  // Audio Upload
  const [audioError, setAudioError] = useState(null);

  const audioTypes = ["audio/mp3"];

  const [selectedAudio, setSelectedAudio] = useState(null);

  // Firebase db
  let quotesRef = db.collection("quotes");

  const increment = firebase.firestore.FieldValue.increment(1);
  let usersRef = db.collection("users").doc(currentUser.uid);

  const handleQuoteSubmit = () => {
    if (!quote.length && !selectedImage) {
      return alert("Please quote something!");
    }

    // Upload to Firebase Storage
    if (selectedImage && types.includes(selectedImage.type)) {
      setImageError("");
      const imageStoreRef = imageStore.ref(Date.now() + selectedImage.name);
      imageStoreRef.put(selectedImage).then(() => {
        // Get the url
        imageStoreRef.getDownloadURL().then((url) => {
          // Store to the Firestore Database
          quotesRef.add({
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            text: quote,
            image: url,
            favorites: 0,
            createdAt: timeStamp,
          });
          usersRef.update({
            created: increment,
          });
        });
      });
    } else {
      if (selectedImage) {
        setImageError("Please select an image file (png or jpg).");
      } else {
        quotesRef.add({
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          text: quote,
          image: null,
          favorites: 0,
          createdAt: timeStamp,
        });
        usersRef.update({
          created: increment,
        });
      }
    }
    setQuote("");
    setSelectedImage(null);
    setExpanded(!expanded);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Card className={classes.card}>
        <div className="createQuote">
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" className={classes.avatar}>
                {currentUser ? (
                  currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="user's profile picture"
                      style={{ width: "100%" }}
                    />
                  ) : (
                    currentUser.displayName.charAt(0)
                  )
                ) : (
                  "QB"
                )}
              </Avatar>
            }
          />
          <p>Create your Quote</p>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <CreateIcon />
          </IconButton>
        </div>
      </Card>
      <Collapse
        className={classes.collapse}
        in={expanded}
        timeout="auto"
        unmountOnExit
      >
        <CardContent
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <textarea
            onChange={(e) => setQuote(e.target.value)}
            value={quote}
            name="quote-text"
            id="quote-text"
            cols="30"
            rows="5"
            placeholder="What do you want to quote about?"
          ></textarea>
          <div>
            <label>
              <ImageIcon className={classes.icon} />
              <input
                type="file"
                onChange={(e) => setSelectedImage(e.target.files[0])}
              />
            </label>
            {selectedImage && <div>{selectedImage.name}</div>}
            {imageError && <div>{imageError}</div>}
            <label>
              <AudiotrackIcon className={classes.icon} />
              <input
                type="file"
                onChange={(e) => {
                  setSelectedAudio(e.target.files[0]);
                }}
              />
            </label>
            {audioError && <div>{audioError}</div>}
          </div>
          <label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <AddIcon className={classes.icon} />
              <span>Quote</span>
            </div>
            <input onClick={handleQuoteSubmit} type="submit" value="Quote" />
          </label>
        </CardContent>
      </Collapse>
    </div>
  );
}
