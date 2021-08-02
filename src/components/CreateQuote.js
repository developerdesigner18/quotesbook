import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CreateIcon from "@material-ui/icons/Create";
import ImageIcon from "@material-ui/icons/Image";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import AddIcon from "@material-ui/icons/Add";
import clsx from "clsx";
import SelectCatagory from "../materialComponents/SelectCatagory";

import {
  Avatar,
  Button,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
} from "@material-ui/core";

import "./CreateQuote.css";
import { db, firebaseStorage, timeStamp } from "../firebase/config";
import firebase from "firebase";
import { Delete } from "@material-ui/icons";

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
  const imageTypes = ["image/png", "image/jpeg"];
  const [imageError, setImageError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [progress, setProgress] = useState(0);

  // Audio Upload
  // const audioTypes = ["audio/mp3"];
  // const [audioError, setAudioError] = useState(null);
  // const [selectedAudio, setSelectedAudio] = useState(null);

  // Firebase db
  let quotesRef = db.collection("quotes");
  let usersRef = db.collection("users").doc(currentUser.uid);
  const increment = firebase.firestore.FieldValue.increment(1);

  const handleQuoteSubmit = () => {
    console.log("object");
    if (!quote.length && !selectedImage) {
      return alert("Please quote something!");
    }

    // Upload to Firebase Storage

    // Image
    if (selectedImage && imageTypes.includes(selectedImage.type)) {
      setImageError("");
      const imageStoreRef = firebaseStorage.ref(
        `images/${Date.now() + selectedImage.name}`
      );
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
            stars: 0,
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
          stars: 0,
          createdAt: timeStamp,
        });
        usersRef.update({
          created: increment,
        });
      }
    }

    // Audio
    // if (selectedAudio && audioTypes.includes(selectedAudio.type)) {
    //   setAudioError("");
    //   const audioStoreRef = firebaseStorage.ref(
    //     `audio/${Date.now() + selectedAudio.name}`
    //   );
    //   audioStoreRef.put(selectedAudio).then(() => {
    //     audioStoreRef.getDownloadURL().then((url) => {});
    //   });
    // }

    setQuote("");
    setSelectedImage(null);
    // setSelectedAudio(null);
    setProgress(0);
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
                    currentUser.displayName?.charAt(0)
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

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Card className={classes.card}>
          <CardContent>
            <div style={{ marginBottom: "20px" }}>
              <Avatar aria-label="recipe" className={classes.avatar}>
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="user's profile picture"
                    style={{ width: "100%" }}
                  />
                ) : (
                  currentUser.displayName?.charAt(0)
                )}
              </Avatar>
              {/* <SelectCatagory /> */}
            </div>
            <textarea
              onChange={(e) => setQuote(e.target.value)}
              value={quote}
              name="quote-text"
              id="quote-text"
              maxLength="250"
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
              <div onClick={() => setSelectedImage(null)}>
                {selectedImage && (
                  <Button>
                    <div>{selectedImage.name}</div>
                    <Delete />
                  </Button>
                )}
              </div>
              {imageError && <div>{imageError}</div>}
              {/* 
              <label>
                <AudiotrackIcon className={classes.icon} />
                <input
                  type="file"
                  onChange={(e) => {
                    setSelectedAudio(e.target.files[0]);
                  }}
                />
              </label>

              <div onClick={() => setSelectedAudio(null)}>
                {selectedAudio && (
                  <Button>
                    <div>{selectedAudio?.name}</div>
                    <Delete />
                  </Button>
                )}
              </div>

              {audioError && <div>{audioError}</div>}
               */}
            </div>
            <label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input type="submit" value="Quote" />
                <Button
                  onClick={handleQuoteSubmit}
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  <AddIcon className={classes.icon} />
                  Quote
                </Button>
              </div>
            </label>
          </CardContent>
        </Card>
      </Collapse>
    </div>
  );
}
