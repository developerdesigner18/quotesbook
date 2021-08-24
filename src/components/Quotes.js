import { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import { db } from "../firebase/config";

import Quote from "./Quote";

const Quotes = ({ currentUser }) => {
  const [content, setContent] = useState([]);
  const filteredContent = content.filter(
    (quote) => !quote.favorites.includes(currentUser?.uid)
  );

  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Get quotes
    const unsub = db
      .collection("quotes")
      .orderBy("createdAt", "desc")
      .onSnapshot((snap) => {
        let data = [];
        snap.docs.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        setContent(data);
      });

    // Get users
    db.collection("users").onSnapshot((snap) => {
      let data = [];
      snap.forEach((doc) => {
        data.push(doc.data());
      });
      setUsers(data);
    });

    return () => unsub();
  }, []);

  return (
    <div>
      {filteredContent.map((doc) => (
        <Quote
          users={users}
          key={doc.id}
          quoteId={doc.id}
          quote={doc}
          currentUser={currentUser}
          quoteImage={doc.image}
          quoteAudio={doc.audio}
          quoteFavorites={doc.favorites}
          quoteStars={doc.stars}
          quoteCreatedAt={doc.createdAt}
        />
      ))}
    </div>
  );
};

export default withRouter(Quotes);
