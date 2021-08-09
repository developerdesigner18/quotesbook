import { useState, useEffect } from "react";
import { Route, BrowserRouter as Router, useParams } from "react-router-dom";
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
import GuestUser from "./components/GuestUser";

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

  const [authorId, setAuthorId] = useState(null);

  const handleLoadAuthorId = (data) => {
    setAuthorId(data);
  };

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
              {/* <ProfileStatus currentUser={currentUser} /> */}
              <RandomAuthors />
              {!currentUser && <GuestUser />}
            </Route>
          </div>
        </div>
        <div className="app__author">
          <div className="author__left">
            <Route exact path={`/author/:authorId`}>
              <Author
                loadAuthorId={handleLoadAuthorId}
                currentUser={currentUser}
              />
            </Route>
          </div>
          <div className="author__right">
            <Route exact path={`/author/:authorId`}>
              {authorId && <ProfileStatus authorId={authorId} />}
              {!currentUser && <GuestUser />}
            </Route>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
