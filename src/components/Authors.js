import { useState, useEffect } from "react";
import { CardActions, makeStyles } from "@material-ui/core";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { db } from "../firebase/config";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "36ch",
    backgroundColor: theme.palette.background.paper,
    textDecoration: "none",
    "&:hover": {
      color: theme.palette.info.dark,
    },
  },
  inline: {
    display: "inline",
  },
}));

const Authors = () => {
  const classes = useStyles();

  const [users, setUsers] = useState();

  useEffect(() => {
    db.collection("users")
      // .where("createdCount", ">", 0)
      .orderBy("createdCount", "asc")
      .onSnapshot((snap) => {
        let data = [];
        snap.forEach((snap) => {
          data.push({ ...snap.data() });
        });
        setUsers(data);
      });
  }, []);

  return (
    <div>
      {users &&
        users.map((user) => (
          <List
            component={Link}
            to={`/author/${user.uid}`}
            className={classes.root}
          >
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={user.photoURL} />
              </ListItemAvatar>
              <ListItemText
                primary={user.displayName}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      {"Favorite Quote"}
                    </Typography>
                    {
                      " — You will face many defeats in life, but never let yourself be defeated."
                    }
                    <CardActions style={{ paddingLeft: "0" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginRight: "12px",
                        }}
                      >
                        <BorderColorIcon
                          style={{
                            fontSize: "18px",
                            marginRight: "10px",
                          }}
                        />
                        <Typography>{user.createdCount}</Typography>
                      </div>
                    </CardActions>
                  </>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </List>
        ))}
    </div>
  );
};

export default Authors;
