import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useHistory, Link as RouterLink } from "react-router-dom";
import { auth, googleProvider } from "../firebase/config";
import FacebookIcon from "@material-ui/icons/Facebook";
import { MailOutline } from "@material-ui/icons";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Signin() {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password).then((cred) => {
      console.log(cred.user);
      history.push("/quotes");
    });
  };

  const handleLoginWithEmail = () => {
    auth
      .signInWithPopup(googleProvider)
      .then((user) => {
        if (user) {
          console.log(user);
          history.push("/quotes");
        }
      })
      .catch((error) => console.log(error.message));
  };

  const handleLoginWithFacebook = () => {
    console.log("object2");
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography component="p">Sign in with</Typography>
          <Avatar onClick={handleLoginWithEmail} className={classes.avatar}>
            <MailOutline />
          </Avatar>
          <Avatar className={classes.avatar}>
            <FacebookIcon onClick={handleLoginWithFacebook} />
          </Avatar>
        </div>
        <Typography component="p" variant="h6">
          OR
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            onClick={handleOnSubmit}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/signup" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <RouterLink to="/signup" variant="body2">
                {"New to Quote Book? Sign Up"}
              </RouterLink>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
