import React, { useState } from "react";
import firebase from "firebase";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CreateIcon from "@material-ui/icons/Create";
import ImageIcon from "@material-ui/icons/Image";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import AddIcon from "@material-ui/icons/Add";
import clsx from "clsx";

import {
  Avatar,
  Button,
  CardContent,
  CardHeader,
  CircularProgress,
  Collapse,
  IconButton,
  Typography,
} from "@material-ui/core";

import "./CreateQuote.css";
import { db, firebaseStorage, increment, timeStamp } from "../firebase/config";
import { Delete } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down("sm")]: {
      maxWidth: 340,
    },
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  icon: {
    cursor: "pointer",
  },
  card: {
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
  const [imageProgress, setImageProgress] = useState(0);

  // onChange image input
  const handleImageChange = (e) => {
    let selected = e.target.files[0];
    if (selected && imageTypes.includes(selected.type)) {
      setImageError(null);
      setSelectedImage(selected);
    } else {
      setSelectedImage(null);
      setImageError("Please select a valid image file(png, jpeg).");
    }
  };

  // Audio Upload
  const audioTypes = ["audio/mpeg"];
  const [audioError, setAudioError] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [audioProgress, setAudioProgress] = useState(0);

  // onChange audio input
  const handleAudioChange = (e) => {
    let selected = e.target.files[0];
    if (selected && audioTypes.includes(selected.type)) {
      setAudioError(null);
      setSelectedAudio(selected);
    } else {
      setSelectedAudio(null);
      setAudioError("Please select a valid audio file(mpeg).");
    }
  };

  // Get image url from firebase storage
  async function getImageUrl() {
    return new Promise((resolve, reject) => {
      const imageStorageRef = firebaseStorage.ref(
        `images/${Date.now() + selectedImage?.name}`
      );
      // Put image to the storage
      imageStorageRef.put(selectedImage).on(
        "state_changed",
        (snap) => {
          let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
          setImageProgress(percentage);
        },
        (error) => {
          console.log(error.message);
        },
        () => {
          // Get the image download url
          imageStorageRef.getDownloadURL().then((url) => {
            resolve(url);
          });
        }
      );
    });
  }

  // Get audio url from firebase storage
  async function getAudioUrl() {
    return new Promise((resolve, reject) => {
      const audioStorageRef = firebaseStorage.ref(
        `audio/${Date.now() + selectedAudio?.name}`
      );
      audioStorageRef.put(selectedAudio).on(
        "state_changed",
        (snap) => {
          let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
          setAudioProgress(percentage);
        },
        (error) => {
          console.log(error);
        },
        () => {
          // Get the audio download url
          audioStorageRef.getDownloadURL().then((url) => {
            // Store all submitted datas to the database
            resolve(url);
          });
        }
      );
    });
  }

  const handleQuoteSubmit = async () => {
    if (!quote.length && !selectedImage && !selectedAudio) {
      return alert("Please quote something!");
    }

    if (quote || selectedImage || selectedAudio) {
      // Put all datas to the firestore
      db.collection("quotes")
        .add({
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          text: quote ? quote : "",
          image: selectedImage ? await getImageUrl() : null,
          audio: selectedAudio ? await getAudioUrl() : null,
          favorites: [],
          stars: [],
          createdAt: timeStamp,
        })
        .then((ref) =>
          db.collection("users").update({
            created: firebase.firestore.FieldValue.arrayUnion(ref.id),
          })
        );
    }

    // Reset all states after submit a quote
    setQuote("");

    setSelectedImage(null);
    setImageError(null);
    setImageProgress(0);

    setSelectedAudio(null);
    setAudioError(null);
    setAudioProgress(0);

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
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <Typography variant="h6">Create your Quote</Typography>
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
            <div style={{ display: "flex" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label>
                    <ImageIcon className={classes.icon} />
                    <input type="file" onChange={handleImageChange} />
                  </label>
                  <div onClick={() => setSelectedImage(null)}>
                    {selectedImage && (
                      <Button>
                        <div>{selectedImage.name}</div>
                        <Delete />
                      </Button>
                    )}
                  </div>
                </div>
                {imageError && <div>{imageError}</div>}
                {imageProgress > 0 && (
                  <CircularProgress variant="static" value={imageProgress} />
                )}
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label>
                    <AudiotrackIcon className={classes.icon} />
                    <input type="file" onChange={handleAudioChange} />
                  </label>

                  <div onClick={() => setSelectedAudio(null)}>
                    {selectedAudio && (
                      <Button>
                        <div>{selectedAudio.name}</div>
                        <Delete />
                      </Button>
                    )}
                  </div>
                </div>
                {audioError && <div>{audioError}</div>}
                {audioProgress > 0 && (
                  <CircularProgress variant="static" value={audioProgress} />
                )}
              </div>
            </div>
            <label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input type="submit" value="Quote" style={{ padding: "0" }} />
                <Button
                  onClick={handleQuoteSubmit}
                  variant="contained"
                  color="primary"
                  size="small"
                  style={{ marginTop: "8px" }}
                >
                  <AddIcon className={classes.icon} />
                  Post Quote
                </Button>
              </div>
            </label>
          </CardContent>
        </Card>
      </Collapse>
    </div>
  );
}
