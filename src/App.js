import { useState, useEffect } from "react";
import {
  Switch,
  Route,
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";
import { db, auth } from "./firebase/config";
import "./App.css";

import Navbar from "./components/Navbar";
import Quotes from "./components/Quotes";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import CreateQuote from "./components/CreateQuote";
import ProfileStatus from "./components/ProfileStatus";
import RandomAuthors from "./components/RandomAuthors";

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
        <Route path="/signup">
          <Signup currentUser={currentUser} />
        </Route>
        <div className="app__main">
          <div className="app__left">
            {currentUser.uid && <CreateQuote currentUser={currentUser} />}
            <Route exact path="/">
              <Quotes currentUser={currentUser} />
            </Route>
          </div>
          <div className="app__right">
            <Route exact path="/">
              <ProfileStatus currentUser={currentUser} />
              {/* <RandomAuthors /> */}
            </Route>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
