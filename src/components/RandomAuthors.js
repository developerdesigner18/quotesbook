import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import { db } from "../firebase/config";

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

export default function RandomAuthors() {
  const classes = useStyles();

  const [randomAuthors, setRandomAuthors] = useState([]);

  useEffect(() => {
    const unsub = db
      .collection("users")
      .where("createdCount", ">=", 0)
      .orderBy("createdCount", "asc")
      .limit(8)
      .onSnapshot((users) => {
        let usersData = [];
        users.forEach((user) => {
          usersData.push(user.data());
        });
        setRandomAuthors(usersData);
      });
    return () => unsub();
  }, []);

  return (
    <Card className={classes.root}>
      <Typography variant="subtitle2" color="textSecondary" align="center">
        Top Authors
      </Typography>

      {randomAuthors.map((randomAuthor) => (
        <Link
          to={`/author/${randomAuthor.uid}`}
          style={{ textDecoration: "none" }}
        >
          <CardContent
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              borderBottom: "1px solid rgba(128, 128, 128, 0.1)",
            }}
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
        </Link>
      ))}
    </Card>
  );
}
