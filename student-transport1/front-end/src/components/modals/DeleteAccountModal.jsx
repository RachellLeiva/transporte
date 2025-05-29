import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const DeleteAccountModal = ({ show, onHide, onConfirm }) => {
  const [confirmationText, setConfirmationText] = useState('');

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>Eliminar cuenta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-4">
          <i className="fas fa-exclamation-triangle text-danger fa-3x mb-3"></i>
          <h4>¿Estás seguro?</h4>
          <p>Esta acción no se puede deshacer.</p>
        </div>
        <Form.Group>
          <Form.Label>Escribe "ELIMINAR" para confirmar</Form.Label>
          <Form.Control
            type="text"
            value={confirmationText}
            onChange={e => setConfirmationText(e.target.value)}
            placeholder="ELIMINAR"
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="danger" onClick={onConfirm} disabled={confirmationText !== 'ELIMINAR'}>
          Eliminar cuenta
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteAccountModal;