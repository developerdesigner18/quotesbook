import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { db } from "../firebase/config";
import Quote from "./Quote";

const Quotes = ({ currentUser }) => {
  const [content, setContent] = useState([]);

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
    <div>
      {content.map((doc) => (
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
