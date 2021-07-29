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
import { Link, useParams } from "react-router-dom";
import { db } from "../firebase/config";

const useStyles = makeStyles({
  root: {
    maxWidth: 200,
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

export default function ProfileStatus({ currentUser }) {
  // console.log("logged in user", currentUser.uid);
  const classes = useStyles();

  // Fetched Users' collection
  const [allUsers, setAllUsers] = useState([]);
  const [fetchedUser, setFetchedUser] = useState({});

  useEffect(() => {
    if (allUsers.length) {
      setFetchedUser(allUsers.find((user) => user.uid == currentUser.uid));
    }
  }, [allUsers]);

  useEffect(() => {
    let usersData = [];
    db.collection("users").onSnapshot((snap) => {
      snap.forEach((users) => {
        usersData.push(users.data());
      });
      setAllUsers(usersData);
    });
  }, []);

  return currentUser ? (
    <Card className={classes.root}>
      <CardContent>
        <Avatar aria-label="recipe" className={classes.avatar}>
          {currentUser ? (
            currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="user's profile picture"
                style={{ width: "100%" }}
              />
            ) : (
              currentUser.displayName.charAt(0)
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
          {currentUser.displayName}
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
            <span>{fetchedUser.created}</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <StarBorderIcon />
            <span>1001</span>
          </div>
        </div>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" size="small">
          Share
        </Button>
      </CardActions>
    </Card>
  ) : (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="body2" component="p">
          You're unique <Link to="/">Login</Link> to create your awesome quotes.
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" size="small">
          Share
        </Button>
      </CardActions>
    </Card>
  );
}
