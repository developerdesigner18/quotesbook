exports.getAllUsers = (req, res, db) => {
  db.collection("users").onSnapshot((snap) => {
    if (snap) {
      let data = [];
      snap.forEach((doc) => {
        data.push(doc.data());
      });
      return res.json(data);
    } else {
      return res.status(500).json("Could not fetch users!");
    }
  });
};
