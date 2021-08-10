import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Avatar } from "@material-ui/core";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import FacebookIcon from "@material-ui/icons/Facebook";
import CreateIcon from "@material-ui/icons/Create";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { db } from "../firebase/config";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
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
});

export default function ProfileStatus({ authorId }) {
  const classes = useStyles();

  const [author, setAuthor] = useState();

  useEffect(() => {
    db.collection("users")
      .doc(authorId)
      .onSnapshot((author) => setAuthor(author.data()));
  }, [authorId]);

  return !author ? (
    <h1>Loading...</h1>
  ) : (
    <Card className={classes.root}>
      <CardContent>
        <Avatar aria-label="recipe" className={classes.avatar}>
          {author ? (
            author.photoURL ? (
              <img
                src={author.photoURL}
                alt="author's profile picture"
                style={{ width: "100%" }}
              />
            ) : (
              author.displayName?.charAt(0)
            )
          ) : (
            "QB"
          )}
        </Avatar>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          {author.displayName}
        </Typography>
        <LinkedInIcon />
        <FacebookIcon />
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
        <Link to={`/author/${authorId}/favorite-quotes`}>
          <Typography>{`Favorite Quotes (${author.favoritedCount})`}</Typography>
        </Link>
      </CardContent>
    </Card>
  );
}
