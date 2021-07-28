import React from "react";
import Quote from "./Quote";

const Quotes = ({ content, currentUser }) => {
  return (
    <div>
      {content.map((doc) => (
        <Quote
          key={doc.id}
          quoteId={doc.id}
          quote={doc}
          currentUser={currentUser}
          quoteImage={doc.image}
        />
      ))}
    </div>
  );
};

export default Quotes;
