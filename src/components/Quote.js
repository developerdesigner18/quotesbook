import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
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
import { CardMedia } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import { db, decrement, firebaseStorage, increment } from "../firebase/config";
import firebase from "firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 345,
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
  avatar: {
    // backgroundColor: red[500],
  },
  favorited: {
    color: "red",
  },
  starred: {
    color: "gold",
  },
}));

export default function Quote({
  quote,
  quoteImage,
  quoteAudio,
  quoteId,
  quoteCreatedAt,
  currentUser,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (quoteId, quoteImage, quoteAudio) => {
    const quoteRef = db.collection("quotes").doc(quoteId);

    const decrement = firebase.firestore.FieldValue.increment(-1);
    let usersRef = db.collection("users").doc(currentUser.uid);

    if (window.confirm("Are you sure to delete this quote?")) {
      quoteRef
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

      usersRef.update({
        created: decrement,
      });
    }
  };

  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  // console.log(isFavorited);

  const handleFavoriteClick = (currentUser) => {
    if (!isFavorited) {
      // User's favorited
      db.collection("users").doc(currentUser.uid).update({
        favorited: increment,
      });

      // In quote favorite
      db.collection("quotes").doc(quoteId).update({
        favorites: increment,
      });
      db.collection("quotes").doc(quoteId).collection("favoriters").add({
        displayName: currentUser.displayName,
        uid: currentUser.uid,
        isFavorited: isFavorited,
      });
    } else {
      // User's favorited
      db.collection("users").doc(currentUser.uid).update({
        favorited: decrement,
      });
      // In quote favorite
      db.collection("quotes").doc(quoteId).update({
        favorites: decrement,
      });
      if (
        !db
          .collection("quotes")
          .doc(quoteId)
          .collection("favoriters")
          .doc(currentUser.uid)
      ) {
        db.collection("quotes")
          .doc(quoteId)
          .collection("favoriters")
          .doc("LA")
          .set({
            displayName: currentUser.displayName,
            uid: currentUser.uid,
            isFavorited: !isFavorited,
          });
      }
    }
    db.collection("quotes")
      .doc(quoteId)
      .get()
      .then((favorites) => {
        setFavoriteCount(favorites.data().favorites);
      });
  };

  // Star
  const [starCount, setStarCount] = useState(0);
  const [isStarred, setIsStarred] = useState(false);

  const handleStarClick = () => {
    setIsStarred(!isStarred);

    const increment = firebase.firestore.FieldValue.increment(1);
    const decrement = firebase.firestore.FieldValue.increment(-1);

    if (!isStarred) {
      // User's starred
      db.collection("users").doc(currentUser.uid).update({
        starred: increment,
      });

      // In quote star
      db.collection("quotes").doc(quoteId).update({
        stars: increment,
      });
    } else {
      // User's starred
      db.collection("users").doc(currentUser.uid).update({
        starred: decrement,
      });
      // In quote star
      db.collection("quotes").doc(quoteId).update({
        stars: decrement,
      });
    }
    db.collection("quotes")
      .doc(quoteId)
      .get()
      .then((stars) => {
        setStarCount(stars.data().stars);
      });
  };

  useEffect(() => {
    db.collection("quotes")
      .doc(quoteId)
      .get()
      .then((favorites) => {
        setFavoriteCount(favorites.data().favorites);
      });
  }, []);

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {quote ? (
              <img
                src={quote.photoURL}
                alt="user's profile picture"
                style={{ width: "100%" }}
              />
            ) : (
              "QB"
            )}
          </Avatar>
        }
        action={
          currentUser.uid === quote.uid ? (
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
                <MenuItem onClick={handleClose}>Edit</MenuItem>
                <MenuItem
                  onClick={() => handleDelete(quoteId, quoteImage, quoteAudio)}
                >
                  Delete
                </MenuItem>
              </Menu>
            </IconButton>
          ) : null
        }
        title={quote.displayName}
        // subheader={new Date(quote.createdAt._seconds * 1000).toLocaleDateString(
        //   "en-US"
        // )}
      />

      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {quote.text}
        </Typography>
      </CardContent>
      {quote.image ? (
        <CardMedia className={classes.media} image={quote.image} />
      ) : (
        ""
      )}
      <CardActions disableSpacing>
        <IconButton
          onClick={() => handleFavoriteClick(currentUser)}
          aria-label="add to favorites"
        >
          <FavoriteIcon className={isFavorited && classes.favorited} />
        </IconButton>
        <span>{favoriteCount}</span>
        <IconButton onClick={handleStarClick} aria-label="add to favorites">
          <StarIcon className={isStarred && classes.starred} />
        </IconButton>
        <span>{starCount}</span>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          {/* <ExpandMoreIcon /> */}
        </IconButton>
      </CardActions>
      {/* <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Method:</Typography>
          <Typography paragraph>
            Heat 1/2 cup of the broth in a pot until simmering, add saffron and
            set aside for 10 minutes.
          </Typography>
          <Typography paragraph>
            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet
            over medium-high heat. Add chicken, shrimp and chorizo, and cook,
            stirring occasionally until lightly browned, 6 to 8 minutes.
            Transfer shrimp to a large plate and set aside, leaving chicken and
            chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes,
            onion, salt and pepper, and cook, stirring often until thickened and
            fragrant, about 10 minutes. Add saffron broth and remaining 4 1/2
            cups chicken broth; bring to a boil.
          </Typography>
          <Typography paragraph>
            Add rice and stir very gently to distribute. Top with artichokes and
            peppers, and cook without stirring, until most of the liquid is
            absorbed, 15 to 18 minutes. Reduce heat to medium-low, add reserved
            shrimp and mussels, tucking them down into the rice, and cook again
            without stirring, until mussels have opened and rice is just tender,
            5 to 7 minutes more. (Discard any mussels that don’t open.)
          </Typography>
          <Typography>
            Set aside off of the heat to let rest for 10 minutes, and then
            serve.
          </Typography>
        </CardContent>
      </Collapse> */}
    </Card>
  );
}
