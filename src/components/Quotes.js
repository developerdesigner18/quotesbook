import React, { useEffect } from "react";
import Quote from "./Quote";

const Quotes = ({ content }) => {
  console.log(content);
  return (
    <div>
      {content.map((doc) => (
        <Quote key={doc.id} quote={doc.data()} />
      ))}
    </div>
  );
};

export default Quotes;
