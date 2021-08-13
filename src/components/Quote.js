import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import tinycolor from "tinycolor2";

import { db, decrement, firebaseStorage, increment } from "../firebase/config";
import firebase from "firebase";

import { QuoteSkeleton } from "./Skeletons";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
} from "react-share";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import StarIcon from "@material-ui/icons/Star";
import ShareIcon from "@material-ui/icons/Share";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { CardMedia, Modal } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import { Equalizer } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 445,
    [theme.breakpoints.down("sm")]: {
      maxWidth: 340,
    },
    marginBottom: "20px",
    textAlign: "left",
  },
  media: {
    width: "100%",
    margin: "0 auto",
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  audio: {
    marginTop: "10px",
  },
  equalizer: {
    cursor: "pointer",
    float: "right",
  },
  textBackground: {
    width: "100%",
    height: "200px",

    display: "grid",
    placeItems: "center",
    padding: "20px",
  },
}));

export default function Quote({
  currentUser,
  quote,
  quoteImage,
  quoteAudio,
  quoteFavorites,
  quoteStars,
  quoteId,
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const history = useHistory();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Edit quote
  // const handleEdit = (quoteId, quoteImage, quoteAudio) => {
  //   console.log("object");

  // };

  // Delete Quote from firestore & files from firebase storage
  const handleDelete = (quoteId, quoteImage, quoteAudio) => {
    if (window.confirm("Are you sure to delete this quote?")) {
      db.collection("quotes")
        .doc(quoteId)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });

      quoteImage &&
        firebaseStorage
          .refFromURL(quoteImage)
          .delete()
          .then(() => {
            console.log("Image successfully deleted!");
          })
          .catch((error) => {
            console.error("Error removing image: ", error);
          });

      quoteAudio &&
        firebaseStorage
          .refFromURL(quoteAudio)
          .delete()
          .then(() => {
            console.log("Audio successfully deleted!");
          })
          .catch((error) => {
            console.error("Error removing audio: ", error);
          });

      db.collection("users")
        .doc(currentUser.uid)
        .update({
          created: firebase.firestore.FieldValue.arrayRemove(quoteId),
          createdCount: decrement,
        });
    }
  };

  // Favorite
  const [isFavorited, setIsFavorited] = useState(false);
  useEffect(() => {
    if (
      quoteFavorites.find((quoteFavorite) => quoteFavorite === currentUser.uid)
    ) {
      setIsFavorited(true);
    }
  }, [quoteFavorites, currentUser.uid]);

  const handleFavoriteClick = (currentUser, quoteId, quoteFavorites) => {
    if (!currentUser.uid) {
      alert("Please sign in to use the app!");
      return history.push("/signin");
    }

    setIsFavorited(!isFavorited);

    if (!quoteFavorites.includes(currentUser.uid)) {
      db.collection("users")
        .doc(currentUser.uid)
        .update({
          favorited: firebase.firestore.FieldValue.arrayUnion(quoteId),
          favoritedCount: increment,
        })
        .catch((error) => {
          console.error(error);
        });

      db.collection("quotes")
        .doc(quoteId)
        .update({
          favorites: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
          favoritesCount: increment,
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      db.collection("users")
        .doc(currentUser.uid)
        .update({
          favorited: firebase.firestore.FieldValue.arrayRemove(quoteId),
          favoritedCount: decrement,
        })
        .catch((error) => {
          console.error(error);
        });

      db.collection("quotes")
        .doc(quoteId)
        .update({
          favorites: firebase.firestore.FieldValue.arrayRemove(currentUser.uid),
          favoritesCount: decrement,
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  // Star
  const [isStarred, setIsStarred] = useState(false);

  useEffect(() => {
    if (quoteStars.find((quoteStar) => quoteStar === currentUser.uid)) {
      setIsStarred(true);
    }
  }, [quoteStars, currentUser.uid]);

  const handleStarClick = (currentUser, quoteId, quoteStars) => {
    if (!currentUser.uid) {
      alert("Please sign in to use the app!");
      return history.push("/signin");
    }

    setIsStarred(!isStarred);

    if (!quoteStars.includes(currentUser.uid)) {
      db.collection("users")
        .doc(currentUser.uid)
        .update({
          starred: firebase.firestore.FieldValue.arrayUnion(quoteId),
          starredCount: increment,
        })
        .catch((error) => {
          console.error(error);
        });

      db.collection("quotes")
        .doc(quoteId)
        .update({
          stars: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
          starsCount: increment,
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      db.collection("users")
        .doc(currentUser.uid)
        .update({
          starred: firebase.firestore.FieldValue.arrayRemove(quoteId),
          starredCount: decrement,
        })
        .catch((error) => {
          console.error(error);
        });

      db.collection("quotes")
        .doc(quoteId)
        .update({
          stars: firebase.firestore.FieldValue.arrayRemove(currentUser.uid),
          starsCount: decrement,
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  // Text-To-Speech

  // Initialize new SpeechSynthesisUtterance object
  let speech = new SpeechSynthesisUtterance();

  const handleSpeech = () => {
    // Set the text property with the value of the textarea
    speech.text = quote.text;

    // Start Speaking
    window.speechSynthesis.speak(speech);
  };

  return !quoteId ? (
    <QuoteSkeleton />
  ) : (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Link to={`/author/${quote.uid}`} style={{ textDecoration: "none" }}>
            <Avatar aria-label="recipe" className={classes.avatar}>
              {quote ? (
                <img
                  src={quote.photoURL}
                  alt={quote.displayName}
                  style={{ width: "100%" }}
                />
              ) : (
                "QB"
              )}
            </Avatar>
          </Link>
        }
        action={
          currentUser.uid === quote?.uid ? (
            <IconButton aria-label="settings">
              <MoreVertIcon
                aria-controls="fade-menu"
                aria-haspopup="true"
                onClick={handleClick}
              />

              <Menu
                id="fade-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
              >
                {/* <MenuItem
                  onClick={() => handleEdit(quoteId, quoteImage, quoteAudio)}
                >
                  Edit
                </MenuItem> */}
                <MenuItem
                  onClick={() => handleDelete(quoteId, quoteImage, quoteAudio)}
                >
                  Delete
                </MenuItem>
              </Menu>
            </IconButton>
          ) : null
        }
        title={`${quote.displayName?.split(" ")[0]} ${quote.displayName
          ?.split(" ")[1]
          .charAt(0)}.`}
        subheader={new Date(quote.createdAt?.seconds * 1000).toDateString()}
      />

      <CardContent>
        {quote.text && (
          <Equalizer className={classes.equalizer} onClick={handleSpeech} />
        )}
        {quote.image ? (
          <Typography variant="body2" color="textSecondary" component="p">
            {quote.text}
          </Typography>
        ) : (
          <div
            className={classes.textBackground}
            style={{
              backgroundColor: `${quote.textBackgroundColor}`,
            }}
          >
            <Typography
              align="center"
              variant="span"
              color="textSecondary"
              style={{
                color: `${tinycolor(quote.textBackgroundColor)
                  .complement()
                  .toHexString()}`,
              }}
            >
              {quote.text}
            </Typography>
          </div>
        )}
      </CardContent>
      {quote.image ? (
        <CardMedia className={classes.media} image={quote.image} />
      ) : (
        ""
      )}

      {quote.audio && (
        <audio className={classes.audio} controls src={quote.audio} />
      )}
      <CardActions disableSpacing>
        <IconButton
          onClick={() =>
            handleFavoriteClick(currentUser, quoteId, quoteFavorites)
          }
          aria-label="add to favorites"
        >
          <FavoriteIcon style={{ color: isFavorited && "red" }} />
        </IconButton>
        <span>{quoteFavorites?.length}</span>
        <IconButton
          onClick={() => handleStarClick(currentUser, quoteId, quoteStars)}
          aria-label="add to favorites"
        >
          <StarIcon style={{ color: isStarred && "gold" }} />
        </IconButton>
        <span>{quoteStars?.length}</span>
        <IconButton onClick={handleOpenModal}>
          <ShareIcon aria-controls="panel2bh-content" id="panel2bh-header" />
        </IconButton>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div style={{ position: "absolute", top: "45vh", left: "45vw" }}>
            <FacebookShareButton url={`http://google.com`} quote={quote.text}>
              <FacebookIcon />
            </FacebookShareButton>
            <LinkedinShareButton url={`http://google.com`}>
              <LinkedinIcon />
            </LinkedinShareButton>
          </div>
        </Modal>
      </CardActions>
    </Card>
  );
}
