import React from "react";
import Quote from "./Quote";

const Quotes = ({ content, currentUser }) => {
  return (
    <div>
      {console.log("component called", content.length)}
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

export default Quotes;
