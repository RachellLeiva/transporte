import React from 'react';
import { Modal, Button, Image } from 'react-bootstrap';

export default function ReceiptDetails({ show, onHide, receipt }) {
  if (!receipt) return null;

  const {
    parent: { name, phone },
    studentNames = [],
    amount,
    createdAt,
    fileUrl,
    comment
  } = receipt;

  const dateStr = new Date(createdAt).toLocaleDateString();

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Comprobante</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Padre/Madre:</strong> {name}</p>
        <p><strong>Teléfono:</strong> {phone}</p>
        <p><strong>Estudiante(s):</strong> {studentNames.join(', ')}</p>
        <p><strong>Monto:</strong> ${amount}</p>
        <p><strong>Fecha subida:</strong> {dateStr}</p>
        <div className="mb-3">
          <h5>Comprobante:</h5>
          <Image src={fileUrl} fluid thumbnail />
        </div>
        {comment && (
          <div className="alert alert-info">
            <strong>Comentario:</strong> {comment}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}
