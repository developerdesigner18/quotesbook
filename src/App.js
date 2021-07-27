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

function App() {
  const [user, setUser] = useState({
    uid: "",
    displayName: "",
    photoURL: "",
  });

  const [content, setContent] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // console.log("user logged in: ", user);
        setUser({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        console.log("user logged out");
      }
    });
  }, []);

  useEffect(() => {
    const unsub = db
      .collection("quotebook")
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
        <Navbar user={user} />
        <Route exact path={"/"}>
          {!user.uid ? <Signin /> : <Quotes content={content} user={user} />}
        </Route>
        <div className="main">
          <div className="left">
            {user.uid && <CreateQuote user={user} />}

            <Switch>
              <Route path="/quotes">
                <Quotes content={content} user={user} />
              </Route>

              <Route path="/signup">
                <Signup />
              </Route>
            </Switch>
          </div>

          <div className="right">
            <Switch>
              <Route path="/quotes">
                <ProfileStatus user={user} />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
