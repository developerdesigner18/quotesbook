import { useState, useEffect } from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { db, auth } from "./firebase/config";
import "./App.css";

import Navbar from "./components/Navbar";
import Quotes from "./components/Quotes";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import CreateQuote from "./components/CreateQuote";

function App() {
  const [userData, setUserData] = useState({
    uid: "",
    displayName: "",
    photoURL: "",
  });

  const [content, setContent] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // console.log("user logged in: ", user);
        setUserData({
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
        <Navbar user={userData} />
        {userData.uid && <CreateQuote user={userData} />}
        <Switch>
          <Route path="/quotes">
            <Quotes content={content} user={userData} />
          </Route>
          <Route exact path={"/"}>
            {!userData.uid ? (
              <Signin />
            ) : (
              <Quotes content={content} user={userData} />
            )}
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
