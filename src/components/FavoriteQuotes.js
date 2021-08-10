import { Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useParams, withRouter } from "react-router-dom";
import { db } from "../firebase/config";
import Quote from "./Quote";

const Quotes = ({ currentUser }) => {
  const { authorId } = useParams();
  const [user, setUser] = useState([]);

  console.log(user);

  const [favoritedQuotes, setFavoritedQuotes] = useState([]);
  const [quotes, setQuotes] = useState([]);

  const filteredQuotes = quotes.filter((quote) =>
    favoritedQuotes.includes(quote.id)
  );

  useEffect(() => {
    console.log(authorId);
    // Get user's favorite quotes
    db.collection("users")
      .doc(authorId)
      .onSnapshot((doc) => {
        setFavoritedQuotes(doc.data().favorited);
      });

    // Get user
    db.collection("users")
      .doc(authorId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setUser(doc.data());
        }
      });

    // Get all quotes
    db.collection("quotes")
      .orderBy("createdAt", "desc")
      .onSnapshot((snap) => {
        let data = [];
        snap.docs.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        setQuotes(data);
      });
  }, [authorId]);

  return !filteredQuotes.length ? (
    <Typography>
      {console.log(user)}
      {`${user.displayName} has not favorited any quotes yet!`}
    </Typography>
  ) : (
    <div>
      {filteredQuotes.map((doc) => (
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
