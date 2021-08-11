import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/config";

import Quote from "./Quote";

import { Typography } from "@material-ui/core";

const Author = ({ currentUser, loadAuthorId }) => {
  const { authorId } = useParams();

  const [user, setUser] = useState(null);
  const [quotes, setQuotes] = useState(null);

  console.log(quotes);

  useEffect(() => {
    // Load authorId to App component
    authorId && loadAuthorId(authorId);

    db.collection("users")
      .doc(authorId)
      .get()
      .then((user) => {
        setUser(user.data());
      });

    db.collection("quotes")
      .orderBy("createdAt", "desc")
      .onSnapshot((quotes) => {
        let data = [];
        quotes.forEach((quote) => data.push({ ...quote.data(), id: quote.id }));
        setQuotes(data.filter((quote) => quote.uid === authorId));
      });
  }, [authorId]);

  return user === null ? (
    <h1>Loading...</h1>
  ) : !quotes?.length ? (
    <Typography>{`${
      user.displayName.split(" ")[0]
    } has not created a quote yet!`}</Typography>
  ) : (
    <div>
      {quotes.map((doc) => (
        <Quote
          currentUser={currentUser}
          authorId={authorId}
          key={doc.id}
          quoteId={doc.id}
          quote={doc}
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

export default Author;
