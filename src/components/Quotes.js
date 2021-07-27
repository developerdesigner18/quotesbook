import React from "react";
import Quote from "./Quote";

const Quotes = ({ content }) => {
  return (
    <div>
      {content.map((doc) => (
        <Quote key={doc.id} quoteId={doc.id} quote={doc} />
      ))}
    </div>
  );
};

export default Quotes;
