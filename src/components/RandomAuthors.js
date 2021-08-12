import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { Link } from "react-router-dom";

import { AuthorSkeleton } from "./Skeletons";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Avatar, Divider, List, ListItem } from "@material-ui/core";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

const useStyles = makeStyles((theme) => ({
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
}));

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
    <div>
      <Divider />
      <Typography align="center" color="textSecondary" variant="subtitle1">
        Top Authors
      </Typography>
      {!randomAuthors.length ? (
        [1, 2, 3, 4].map((skeleton) => <AuthorSkeleton />)
      ) : (
        <List>
          {randomAuthors.map((randomAuthor) => (
            <ListItem
              component={Link}
              to={`/author/${randomAuthor.uid}`}
              button
              key={randomAuthor.uid}
            >
              <ListItemIcon>
                <Avatar className={classes.avatar}>
                  {randomAuthor.photoURL ? (
                    <img
                      src={randomAuthor.photoURL}
                      style={{ width: "100%" }}
                      alt={randomAuthor.displayName}
                    />
                  ) : (
                    randomAuthor.displayName.charAt(0)
                  )}
                </Avatar>
              </ListItemIcon>
              <ListItemText primary={randomAuthor.displayName} />
            </ListItem>
          ))}
        </List>
      )}
      <Divider />
    </div>
  );
}
