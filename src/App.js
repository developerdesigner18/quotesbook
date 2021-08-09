import { useState, useEffect } from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { auth } from "./firebase/config";
import "./App.css";

import Navbar from "./components/Navbar";
import Quotes from "./components/Quotes";
import Signin from "./components/Signin";
import ForgotPassword from "./components/ForgotPassword";
import Signup from "./components/Signup";
import CreateQuote from "./components/CreateQuote";
import ProfileStatus from "./components/ProfileStatus";
import RandomAuthors from "./components/RandomAuthors";
import Author from "./components/Author";

function App() {
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

  return (
    <Router>
      <div className="app">
        <Navbar currentUser={currentUser} />
        <Route exact path="/signin">
          <Signin />
        </Route>
        <Route exact path="/forgot-password">
          <ForgotPassword />
        </Route>
        <Route path="/signup">
          <Signup currentUser={currentUser} />
        </Route>
        <div className="app__main">
          <div className="app__left">
            <Route exact path="/">
              {currentUser.uid && <CreateQuote currentUser={currentUser} />}
              <Quotes currentUser={currentUser} />
            </Route>
          </div>
          <div className="app__right">
            <Route exact path="/">
              <ProfileStatus currentUser={currentUser} />
              <RandomAuthors />
            </Route>
          </div>
        </div>
        <div className="app__author">
          <Route exact path={`/author/:userId`}>
            <Author currentUser={currentUser} />
          </Route>
        </div>
      </div>
    </Router>
  );
}

export default App;
