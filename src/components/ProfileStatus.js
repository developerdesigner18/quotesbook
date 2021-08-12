import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { db } from "../firebase/config";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Avatar, Divider, ListItem, ListItemIcon } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import FacebookIcon from "@material-ui/icons/Facebook";
import CreateIcon from "@material-ui/icons/Create";
import StarBorderIcon from "@material-ui/icons/StarBorder";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 300,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
}));

export default function ProfileStatus({ authorId }) {
  const classes = useStyles();

  const [author, setAuthor] = useState();

  useEffect(() => {
    db.collection("users")
      .doc(authorId)
      .onSnapshot((author) => setAuthor(author.data()));
  }, [authorId]);

  return !author ? (
    <Typography>Loading...</Typography>
  ) : (
    <div>
      <Divider />
      <ListItem
        component={Link}
        to={`/author/${author.uid}`}
        button
        key={author.uid}
      >
        <ListItemIcon>
          <Avatar className={classes.avatar}>
            {author.photoURL ? (
              <img
                src={author.photoURL}
                style={{ width: "100%" }}
                alt={author.displayName}
              />
            ) : (
              author.displayName.charAt(0)
            )}
          </Avatar>
        </ListItemIcon>
        <ListItemText primary={author.displayName} />
      </ListItem>
      <ListItem>
        <LinkedInIcon />
        <FacebookIcon />
      </ListItem>
      <ListItem>
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CreateIcon />
            <span>{author.created?.length}</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <StarBorderIcon />
            <span>{author.starred?.length}</span>
          </div>
        </div>
      </ListItem>
      <ListItem button>
        <Link
          to={`/author/${authorId}/favorite-quotes`}
          style={{ textDecoration: "none" }}
        >
          <Typography>{`Favorite Quotes (${author.favoritedCount})`}</Typography>
        </Link>
      </ListItem>
    </div>
  );
}
