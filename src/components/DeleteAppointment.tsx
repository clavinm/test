import { useContext } from 'react';
import ConfirmationDialog from './ConfirmationDialog';
import Modal, { ModalContext } from './Modal';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

function DeleteAppointment() {
  const { closeModal } = useContext(ModalContext);

  const handleDeleteSlot = () => {
    closeModal();
    console.log('deleted');
  };
  return (
    <Modal>
      <Modal.Open opens="Delete-slot">
        <DeleteOutlineOutlinedIcon />
      </Modal.Open>
      <Modal.Window name="Delete-slot">
        <ConfirmationDialog
          title="Confirm Delete"
          confirmText="Yes"
          cancelText="No"
          onConfirm={() => handleDeleteSlot()}
          closeModal={closeModal}
        >
          <p>Are you sure you want to delete this Appointement?</p>
        </ConfirmationDialog>
      </Modal.Window>
    </Modal>
  );
}

export default DeleteAppointment;
