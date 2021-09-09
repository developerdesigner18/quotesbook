const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

exports.deleteQuote = functions.https.onCall((data, context) => {
  const { uid, quoteId } = data;
  db.collection("quotes")
    .doc(quoteId)
    .delete()
    .then(() => {});
  return "quote deleted successfully!";
});
