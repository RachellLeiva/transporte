import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ReceiptCommentModal = ({ show, onHide, receipt, onSave }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSave(comment);
    setComment('');
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Comentario de Rechazo #{receipt?._id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Motivo del rechazo:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Explica por qué rechazas este comprobante..."
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="danger" onClick={handleSubmit}>Rechazar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReceiptCommentModal;
