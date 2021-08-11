import React, { useState, useEffect } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { auth } from "./firebase/config";

import Navbar from "./components/Navbar";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import CreateQuote from "./components/CreateQuote";
import Quotes from "./components/Quotes";
import Authors from "./components/Authors";
import Author from "./components/Author";
import RandomAuthors from "./components/RandomAuthors";
import FavoriteQuotes from "./components/FavoriteQuotes";
import GuestUser from "./components/GuestUser";
import ProfileStatus from "./components/ProfileStatus";

import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    width: `calc(100% - ${drawerWidth}px)`,
    display: "grid",
    placeItems: "center",
  },
}));

function App() {
  const classes = useStyles();

  const [currentUser, setCurrentUser] = useState({
    uid: "",
    displayName: "",
    photoURL: "",
  });

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        setCurrentUser({
          uid: "",
          displayName: "",
          photoURL: "",
        });
      }
    });
  }, []);

  const [authorId, setAuthorId] = useState(null);
  const handleLoadAuthorId = (data) => {
    setAuthorId(data);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Switch>
        <Route exact path="/">
          {!currentUser.uid ? <GuestUser /> : <RandomAuthors />}
        </Route>
        <Route path={`/author/:authorId`}>
          {authorId && <ProfileStatus authorId={authorId} />}
          {!currentUser && <GuestUser />}
        </Route>
        <Route path="/authors">
          <RandomAuthors />
        </Route>
      </Switch>
    </div>
  );

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <Route path="/">
          <Navbar currentUser={currentUser} />
          <nav className={classes.drawer}>
            <Hidden xsDown implementation="css">
              <Drawer
                classes={{
                  paper: classes.drawerPaper,
                }}
                variant="permanent"
                open
              >
                {drawer}
              </Drawer>
            </Hidden>
          </nav>
        </Route>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Route exact path="/signin">
            <Signin />
          </Route>
          <Route exact path="/forgot-password">
            <ForgotPassword />
          </Route>
          <Route path="/signup">
            <Signup currentUser={currentUser} />
          </Route>
          <div>
            <Switch>
              <Route exact path="/">
                {currentUser.uid && <CreateQuote currentUser={currentUser} />}
                <Quotes currentUser={currentUser} />
              </Route>
              <Route path={`/author/:authorId/favorite-quotes`}>
                <FavoriteQuotes currentUser={currentUser} />
              </Route>
              <Route exact path={`/author/:authorId`}>
                <Author
                  loadAuthorId={handleLoadAuthorId}
                  currentUser={currentUser}
                />
              </Route>
              <Route path={"/authors"}>
                <Authors />
              </Route>
            </Switch>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
