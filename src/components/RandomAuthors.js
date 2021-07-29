import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Avatar } from "@material-ui/core";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import FacebookIcon from "@material-ui/icons/Facebook";
import CreateIcon from "@material-ui/icons/Create";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { Link } from "react-router-dom";
import { db } from "../firebase/config";

const useStyles = makeStyles({
  root: {
    maxWidth: 200,
    marginTop: "20px",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 12,
  },
  pos: {
    marginBottom: 12,
  },
  avatar: {
    width: "25px",
    height: "25px",
    marginRight: "10px",
  },
});

export default function RandomAuthors({ currentUser }) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  const [randomAuthors, setRandomAuthors] = useState([]);

  useEffect(() => {
    db.collection("users")
      .where("created", ">", 1)
      .orderBy("created", "asc")
      .limit(8)
      .get()
      .then((users) => {
        let usersData = [];
        users.forEach((user) => {
          usersData.push(user.data());
        });
        setRandomAuthors(usersData);
      });
  }, []);

  return (
    <Card className={classes.root}>
      {randomAuthors.map((randomAuthor) => (
        <CardContent
          style={{ display: "flex", alignItems: "center", padding: "10px" }}
        >
          <Avatar aria-label="recipe" className={classes.avatar}>
            {randomAuthor.photoURL ? (
              <img
                src={randomAuthor.photoURL}
                alt="user's profile picture"
                style={{ width: "100%" }}
              />
            ) : (
              randomAuthor.displayName.charAt(0)
            )}
          </Avatar>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterLeft
          >
            {randomAuthor.displayName}
          </Typography>
        </CardContent>
      ))}
    </Card>
  );
}
