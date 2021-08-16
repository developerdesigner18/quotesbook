import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { db, firebaseStorage } from "../firebase/config";

import { auth } from "../firebase/config";

import { ProfileStatusSkeleton } from "./Skeletons";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {
  Avatar,
  Button,
  Divider,
  Grid,
  ListItem,
  ListItemIcon,
  Modal,
  TextField,
  Tooltip,
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
    margin: theme.spacing(1),
    cursor: "pointer",
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

  // New Avatar Upload
  const avatarTypes = ["image/png", "image/jpeg"];
  const [avatarError, setAvatarError] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatarProgress, setAvatarProgress] = useState(0);

  // onChange Avatar input
  const handleAvatarChange = (e) => {
    let selected = e.target.files[0];
    if (selected && avatarTypes.includes(selected.type)) {
      setAvatarError(null);
      setSelectedAvatar(selected);
    } else {
      setSelectedAvatar(null);
      setAvatarError("Please select a valid image file(png, jpeg).");
    }
  };

  // Get Avatar url from firebase storage
  async function getAvatarURL() {
    return new Promise((resolve, reject) => {
      const photoURLRef = firebaseStorage.ref(
        `photoURL/${Date.now() + selectedAvatar.name}`
      );
      // Put avatar to the storage
      photoURLRef.put(selectedAvatar).on(
        "state_changed",
        (snap) => {
          let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
          setAvatarProgress(percentage);
        },
        (error) => {
          console.log(error.message);
        },
        () => {
          // Get the avatar download url
          photoURLRef.getDownloadURL().then((url) => {
            resolve(url);
          });
        }
      );
    });
  }

  const [fullName, setFullName] = useState(currentUser.displayName);
  const [linkedinLink, setLinkedinLink] = useState(currentUser.linkedinLink);
  const [facebookLink, setFacebookLink] = useState(currentUser.facebookLink);

  const handleSave = async (e) => {
    e.preventDefault();

    // update userProfile
    auth.currentUser
      .updateProfile({
        photoURL: selectedAvatar && (await getAvatarURL()),
        displayName: fullName,
      })
      .then(async () => {
        console.log("userProfile updated successfully!");

        // Update users collection
        db.collection("users")
          .doc(currentUser.uid)
          .update({
            displayName: fullName,
            photoURL: selectedAvatar && (await getAvatarURL()),
            linkedinLink: linkedinLink,
            facebookLink: facebookLink,
          });

        // Update quotes collection
        // db.collection("quotes")
        //   .where("uid", "==", currentUser.uid)
        //   .onSnapshot((snap) => {
        //     snap.forEach(async (doc) =>
        //       doc.update({
        //         displayName: fullName,
        //         photoURL: selectedAvatar && (await getAvatarURL()),
        //       })
        //     );
        //   });

        // Delete old Avatar
        firebaseStorage
          .refFromURL(currentUser.photoURL)
          .delete()
          .then(() => console.log("Old Avatar deleted"))
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error.message));

    // setOpenModal(false);
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
        <LinkedInIcon
          onClick={() => window.open(`https://${author.linkedinLink}`)}
        />
        <FacebookIcon onClick={() => window.open(`${author.facebookLink}`)} />
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
      <Modal open={openModal} onClose={handleCloseModal}>
        <form
          className={classes.modalForm}
          noValidate
          autoComplete="off"
          onSubmit={handleSave}
        >
          <label>
            <Tooltip title="Edit your Avatar" placement="right-end">
              <Avatar
                src={
                  selectedAvatar
                    ? URL.createObjectURL(selectedAvatar)
                    : currentUser.photoURL
                }
                variant="square"
                className={classes.large}
              />
            </Tooltip>
            <input type="file" onChange={handleAvatarChange} />
          </label>

          <TextField
            onChange={(e) => {
              setFullName(e.target.value);
            }}
            defaultValue={currentUser.displayName}
            label="Full Name"
          />
          <div className={classes.margin}>
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item>
                <LinkedInIcon />
              </Grid>
              <Grid item>
                <TextField
                  onChange={(e) => {
                    setLinkedinLink(e.target.value);
                  }}
                  defaultValue={author.linkedinLink}
                  label="linkedIn Link"
                />
              </Grid>
            </Grid>
          </div>
          <div className={classes.margin}>
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item>
                <FacebookIcon />
              </Grid>
              <Grid item>
                <TextField
                  onChange={(e) => {
                    setFacebookLink(e.target.value);
                  }}
                  defaultValue={author.facebookLink}
                  label="Facebook Link"
                />
              </Grid>
            </Grid>
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
          >
            Save
          </Button>
        </form>
      </Modal>
    </div>
  );
}
