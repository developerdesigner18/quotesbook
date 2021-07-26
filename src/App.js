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
  const [user, setUser] = useState({
    uid: "",
    displayName: "",
  });

  const [content, setContent] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // console.log("user logged in: ", user);
        setUser({
          uid: user.uid,
          displayName: user.displayName,
        });
      } else {
        console.log("user logged out");
      }
    });
  }, []);

  useEffect(() => {
    db.collection("quotebook")
      .get()
      .then((snapshot) => {
        setContent(snapshot.docs);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar user={user} />
        {user.uid && <CreateQuote user={user} />}
        <Switch>
          <Route path="/quotes">
            <Quotes content={content} />
          </Route>
          <Route exact path={"/"}>
            {!user.uid ? <Signin /> : <Quotes content={content} />}
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
