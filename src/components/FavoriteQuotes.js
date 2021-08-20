import { useState, useEffect } from "react";
import { useParams, withRouter } from "react-router-dom";

import { db } from "../firebase/config";

import { useTranslation } from "react-i18next";

import Quote from "./Quote";

import { Typography } from "@material-ui/core";

const Quotes = ({ currentUser }) => {
  const { authorId } = useParams();
  const [user, setUser] = useState([]);

  const [favoritedQuotes, setFavoritedQuotes] = useState([]);
  const [quotes, setQuotes] = useState([]);

  const filteredQuotes = quotes.filter((quote) =>
    favoritedQuotes.includes(quote.id)
  );

  useEffect(() => {
    // Get user's favorite quotes
    db.collection("users")
      .doc(authorId)
      .onSnapshot((doc) => {
        setFavoritedQuotes(doc.data()?.favorited);
      });

    // Get user
    db.collection("users")
      .doc(authorId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setUser(doc.data());
        }
      })
      .catch((error) => console.error(error));

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

  const { t } = useTranslation();

  return !filteredQuotes.length ? (
    <Typography>
      {`${user.displayName} ${t("hasNotFavoritedAnyQuotesYet")}!`}
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
