import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Divider, ListItem, ListItemText } from "@material-ui/core";

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

export default function GuestUser() {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <ListItem>
        <ListItemText>
          You're unique. <br />
          <Link to="/signin">Sign in</Link> to create your awesome quotes.
        </ListItemText>
      </ListItem>
      <ListItem>
        <Button variant="contained" color="primary" size="small">
          Share
        </Button>
      </ListItem>
    </div>
  );
}
