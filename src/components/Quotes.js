import { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import { db } from "../firebase/config";

import { useTranslation } from "react-i18next";

import Quote from "./Quote";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Quotes = ({ currentUser }) => {
  // Deleted quote successfully - Snackbar
  const [deleteAlert, setDeleteAlert] = useState(false);

  const handleDeleteAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setDeleteAlert(false);
  };

  const loadDeleteAlert = (data) => {
    setDeleteAlert(data);
  };

  const [content, setContent] = useState([]);
  const filteredContent = content.filter(
    (quote) => !quote.favorites.includes(currentUser?.uid)
  );

  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Get quotes
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

    // Get users
    db.collection("users").onSnapshot((snap) => {
      let data = [];
      snap.forEach((doc) => {
        data.push(doc.data());
      });
      setUsers(data);
    });

    return () => unsub();
  }, []);

  const { t } = useTranslation();

  return (
    <div>
      {filteredContent.map((doc) => (
        <Quote
          users={users}
          key={doc.id}
          quoteId={doc.id}
          quote={doc}
          currentUser={currentUser}
          quoteImage={doc.image}
          quoteAudio={doc.audio}
          quoteFavorites={doc.favorites}
          quoteStars={doc.stars}
          quoteCreatedAt={doc.createdAt}
          loadDeleteAlert={loadDeleteAlert}
        />
      ))}
      <Snackbar
        open={deleteAlert}
        autoHideDuration={6000}
        onClose={handleDeleteAlertClose}
      >
        <Alert onClose={handleDeleteAlertClose} severity="error">
          {`${t("quoteDeletedSuccessfully")}!`}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default withRouter(Quotes);
