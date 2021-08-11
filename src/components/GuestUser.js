import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import {
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";

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
