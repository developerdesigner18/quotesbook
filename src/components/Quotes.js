import React from "react";
import Quote from "./Quote";

const Quotes = ({ content, user }) => {
  return (
    <div>
      {content.map((doc) => (
        <Quote
          key={doc.id}
          quoteId={doc.id}
          quote={doc}
          user={user}
          quoteImage={doc.image}
        />
      ))}
    </div>
  );
};

export default Quotes;
