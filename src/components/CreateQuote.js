import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CreateIcon from "@material-ui/icons/Create";
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

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

export default function CreateQuote({ user }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Quote Upload
  const [quote, setQuote] = useState("");

  // Image Upload
  const [error, setError] = useState(null);

  const types = ["image/png", "image/jpeg"];

  const [selected, setSelected] = useState(null);
  console.log(selected);

  const [uploadedImage, setUploadedImage] = useState();
  console.log("uploaded name", uploadedImage);

  const handleImageChange = (e) => {
    let selected = e.target.files[0];
    setSelected(selected);
  };

  // Firebase db
  let quoteBookRef = db.collection("quotebook");

  const handleQuoteSubmit = () => {
    // Upload to Firebase Storage
    if (selected && types.includes(selected.type)) {
      setError("");
      const imageStoreRef = imageStore.ref(selected.name);
      imageStoreRef.put(selected);
    } else {
      setError("Please select an image file (png or jpg).");
    }

    // Retrieve the Image url
    imageStore
      .ref(selected.name)
      .getDownloadURL()
      .then((url) => {
        console.log("url", url);

        // Store to the Firestore Database
        quoteBookRef.add({
          uid: user.uid,
          displayName: user.displayName,
          text: quote,
          image: url ? url : null,
          createdAt: timeStamp,
        });
      });

    setQuote("");
    setSelected(null);
  };

  return (
    <div>
      <div className="createQuote">
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {user.displayName.charAt(0)}
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
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent style={{ width: "10rem", margin: "0 auto" }}>
          <textarea
            onChange={(e) => setQuote(e.target.value)}
            name="quote-text"
            id="quote-text"
            cols="30"
            rows="5"
            placeholder="What do you want to quote about?"
          ></textarea>
          <div>
            <input type="file" onChange={handleImageChange} />
            {error && <div>{error}</div>}
            {/* {image && <div>{image.name}</div>} */}
            <input onClick={handleQuoteSubmit} type="submit" value="Quote" />
          </div>
        </CardContent>
      </Collapse>
    </div>
  );
}
