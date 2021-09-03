import { useState, useEffect } from "react";

import PostQuote from "./PostQuote";

import { Fab, Modal } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  modalForm: {
    display: "grid",
    placeItems: "center",
  },
});

const FloatingButton = ({ currentUser }) => {
  const classes = useStyles();

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    window.onscroll = () => {
      setOffset(window.pageYOffset);
    };
  }, []);

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return offset >= 200 ? (
    <div>
      <Fab
        color="primary"
        style={{ position: "fixed", bottom: "20px", right: "20px" }}
        onClick={handleOpenModal}
      >
        <EditIcon />
      </Fab>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        className={classes.modalForm}
      >
        <PostQuote currentUser={currentUser} source={"floatingButton"} />
      </Modal>
    </div>
  ) : (
    <div></div>
  );
};

export default FloatingButton;
