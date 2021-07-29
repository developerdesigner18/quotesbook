import { useState, useEffect } from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
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

  const [content, setContent] = useState([]);

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

  useEffect(() => {
    const unsub = db
      .collection("quotes")
      .orderBy("createdAt", "desc")
      .onSnapshot((snap) => {
        let documents = [];
        snap.forEach((doc) => {
          documents.push({ ...doc.data(), id: doc.id });
        });
        setContent(documents);
      });
    return () => unsub();
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar currentUser={currentUser} />
        <Route exact path={"/"}>
          {!currentUser.uid ? (
            <Signin />
          ) : (
            <Quotes content={content} currentUser={currentUser} />
          )}
        </Route>
        <div className="main">
          <div className="left">
            {currentUser.uid && <CreateQuote currentUser={currentUser} />}

            <Switch>
              <Route path="/quotes">
                <Quotes content={content} currentUser={currentUser} />
              </Route>

              <Route path="/signup">
                <Signup currentUser={currentUser} />
              </Route>
            </Switch>
          </div>

          <div className="right">
            <Switch>
              <Route path="/quotes">
                <ProfileStatus currentUser={currentUser} />
                <RandomAuthors currentUser={currentUser} />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
