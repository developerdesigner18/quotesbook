import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { db } from "../firebase/config";

import { ProfileStatusSkeleton } from "./Skeletons";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {
  Avatar,
  Button,
  Divider,
  Grid,
  IconButton,
  ListItem,
  ListItemIcon,
  Modal,
  TextField,
} from "@material-ui/core";
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
  modalForm: {
    "& > *": {
      margin: theme.spacing(1),
      // width: "25ch",
    },
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: theme.palette.info.light,
    padding: "50px",
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

export default function ProfileStatus({ authorId, currentUser }) {
  const classes = useStyles();

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const [author, setAuthor] = useState();

  useEffect(() => {
    db.collection("users")
      .doc(authorId)
      .onSnapshot((author) => setAuthor(author.data()));
  }, [authorId]);

  const handleProfileURLChange = () => {
    console.log("object");
  };

  return !author ? (
    <ProfileStatusSkeleton />
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
      <ListItem button divider>
        <Typography
          component={Link}
          to={`/author/${authorId}/favorite-quotes`}
          style={{ textDecoration: "none" }}
          color="inherit"
        >{`Favorite Quotes (${author.favoritedCount})`}</Typography>
      </ListItem>
      {currentUser.uid === authorId && (
        <ListItem button autoFocus onClick={handleOpenModal}>
          <Typography>Edit Profile</Typography>
        </ListItem>
      )}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <form className={classes.modalForm} noValidate autoComplete="off">
          {/* <Avatar
            variant="square"
            src={currentUser.photoURL}
            className={classes.large}
          /> */}
          <label>
            <Avatar
              src={currentUser.photoURL}
              variant="square"
              className={classes.large}
            />
            <input type="file" onChange={handleProfileURLChange} />
          </label>

          <TextField
            id="standard-basic"
            label="Full Name"
            defaultValue={currentUser.displayName}
          />
          <div className={classes.margin}>
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item>
                <LinkedInIcon />
              </Grid>
              <Grid item>
                <TextField id="input-with-icon-grid" label="LinkedIn Link" />
              </Grid>
            </Grid>
          </div>
          <div className={classes.margin}>
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item>
                <FacebookIcon />
              </Grid>
              <Grid item>
                <TextField id="input-with-icon-grid" label="Facebook Link" />
              </Grid>
            </Grid>
          </div>
          <Button variant="contained" color="primary" size="small">
            Save
          </Button>
        </form>
      </Modal>
    </div>
  );
}
