import { useState, useEffect } from "react";
import { Fab, Modal } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

const FloatingButton = () => {
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
      <Modal open={openModal} onClose={handleCloseModal}>
        <h1>Hello</h1>
      </Modal>
    </div>
  ) : (
    <div></div>
  );
};

export default FloatingButton;
