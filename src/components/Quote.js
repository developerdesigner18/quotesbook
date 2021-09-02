import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { db, decrement, firebaseStorage, increment } from "../firebase/config";
import firebase from "firebase";

import { useTranslation } from "react-i18next";

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
import { Button, CardMedia, Modal } from "@material-ui/core";
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
  modalForm: {
    "& > *": {
      margin: theme.spacing(1),
      // width: "25ch",
    },
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: theme.palette.info.light,
    padding: "50px",
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
  loadDeleteAlert,
}) {
  const classes = useStyles();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [signInModal, setSignInModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);

  // Delete Quote from firestore & files from firebase storage
  const handleDelete = (quoteId, quoteImage, quoteAudio) => {
    // Delete quote from quotes collection
    db.collection("quotes")
      .doc(quoteId)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
        loadDeleteAlert(true);
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });

    // Delete image from firebase storage
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

    // Delete audio from firebase storage
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

    // Decrese createdCount of currentUser
    db.collection("users")
      .doc(currentUser.uid)
      .update({
        created: firebase.firestore.FieldValue.arrayRemove(quoteId),
        createdCount: decrement,
      })
      .then(() => console.log("current user created deleted..... "));

    // Remove favorited from other users

    db.collection("users")
      .where("favorited", "array-contains", quoteId)
      .get()
      .then((users) => {
        users.forEach((user) => {
          console.log("name..........", user.data().displayName, decrement);
          db.collection("users")
            .doc(user.data().uid)
            .update({
              favorited: firebase.firestore.FieldValue.arrayRemove(quoteId),
              favoritedCount: decrement,
            })
            .then(() => console.log("favorited deleted"));
        });
      });
  };

  // Favorite
  const [isFavorited, setIsFavorited] = useState(false);
  useEffect(() => {
    if (
      quoteFavorites.find((quoteFavorite) => quoteFavorite === currentUser?.uid)
    ) {
      setIsFavorited(true);
    }
  }, [quoteFavorites, currentUser?.uid]);

  const handleFavoriteClick = (currentUser, quoteId, quoteFavorites) => {
    if (!currentUser) {
      setSignInModal(true);
      return;
    }

    setIsFavorited(!isFavorited);

    // Add favorited and increase favoritedCount in users collection
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

      // Add uid from quotes collection
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
      // Remove uid from users collection
      db.collection("users")
        .doc(currentUser.uid)
        .update({
          favorited: firebase.firestore.FieldValue.arrayRemove(quoteId),
          favoritedCount: decrement,
        })
        .catch((error) => {
          console.error(error);
        });

      // Remove uid from quotes collection
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
  }, [quoteStars, currentUser?.uid]);

  const handleStarClick = (currentUser, quoteId, quoteStars) => {
    if (!currentUser) {
      setSignInModal(true);
      return;
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

  const { t } = useTranslation();

  return !quoteId ? (
    <QuoteSkeleton />
  ) : (
    <div>
      <Card className={classes.root} id={quoteId}>
        <CardHeader
          avatar={
            <Link
              to={`/author/${quote.uid}`}
              style={{ textDecoration: "none" }}
            >
              <Avatar className={classes.avatar}>
                {quote ? (
                  <img
                    src={quote.photoURL}
                    alt={quote.displayName}
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  "QB"
                )}
              </Avatar>
            </Link>
          }
          action={
            currentUser?.uid === quote?.uid ? (
              <IconButton>
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
                  <MenuItem
                    onClick={() => {
                      setDeleteModal(true);
                    }}
                  >
                    {t("delete")}
                  </MenuItem>
                  <Modal
                    open={deleteModal}
                    onClose={() => setDeleteModal(false)}
                  >
                    <div className={classes.modalForm}>
                      <Typography gutterBottom>
                        {t("areYouSureYouWantToDeleteThisQuote")}?
                      </Typography>
                      <Button
                        type="button"
                        onClick={() => {
                          handleDelete(quoteId, quoteImage, quoteAudio);
                        }}
                        variant="contained"
                        color="secondary"
                      >
                        {t("delete")}
                      </Button>
                    </div>
                  </Modal>
                </Menu>
              </IconButton>
            ) : null
          }
          title={`${quote.displayName?.split(" ")[0]} ${
            quote.displayName?.split(" ")[1]
              ? quote.displayName.split(" ")[1]?.charAt(0)
              : ""
          }`}
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
                variant="subtitle2"
                color="textSecondary"
                style={{
                  mixBlendMode: "difference",
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
          >
            <FavoriteIcon style={{ color: isFavorited && "red" }} />
          </IconButton>
          <span>{quoteFavorites?.length}</span>
          <Modal open={signInModal} onClose={() => setSignInModal(false)}>
            <div className={classes.modalForm}>
              <Typography gutterBottom>{t("signInToUseTheApp")}!</Typography>

              <Button
                onClick={() => history.push("/signin")}
                variant="contained"
                color="secondary"
              >
                {t("signIn")}
              </Button>
            </div>
          </Modal>
          <IconButton>
            <StarIcon
              onClick={() => handleStarClick(currentUser, quoteId, quoteStars)}
              style={{ color: isStarred && "gold" }}
            />
          </IconButton>
          <span>{quoteStars?.length}</span>
          <IconButton>
            <ShareIcon
              onClick={() => {
                setShareModal(true);
              }}
            />
          </IconButton>
          <Modal open={shareModal} onClose={() => setShareModal(false)}>
            <div style={{ position: "absolute", top: "45vh", left: "45vw" }}>
              <FacebookShareButton
                url={`http://localhost:3000/#${quoteId}`}
                quote={quote.text}
              >
                <FacebookIcon />
              </FacebookShareButton>
              <LinkedinShareButton url={`http://localhost:3000/#${quoteId}`}>
                <LinkedinIcon />
              </LinkedinShareButton>
            </div>
          </Modal>
        </CardActions>
      </Card>
    </div>
  );
}
