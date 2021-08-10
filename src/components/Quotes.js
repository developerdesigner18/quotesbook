import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { db } from "../firebase/config";
import Quote from "./Quote";

const Quotes = ({ currentUser }) => {
  const [content, setContent] = useState([]);

  const filteredContent = content.filter(
    (quote) => !quote.favorites.includes(currentUser.uid)
  );

  useEffect(() => {
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
    return () => unsub();
  }, []);

  return !content.length ? (
    <h1>Loading...</h1>
  ) : (
    <div>
      {filteredContent.map((doc) => (
        <Quote
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
