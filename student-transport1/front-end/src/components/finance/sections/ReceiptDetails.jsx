// front-end/src/components/finance/sections/ReceiptDetails.jsx
import React from 'react';
import { Modal, Button, Image } from 'react-bootstrap';

const ReceiptDetails = ({ show, onHide, receipt }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Comprobante #{receipt?._id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {receipt && (
          <>
            <p><strong>Padre/Madre:</strong> {receipt.parentName}</p>
            <p><strong>Estudiante:</strong> {receipt.studentName}</p>
            <p><strong>Monto:</strong> ${receipt.amount.toFixed(2)}</p>
            <p><strong>Fecha:</strong> {new Date(receipt.date).toISOString().split('T')[0]}</p>
            <Image src={receipt.imageUrl} fluid thumbnail className="mb-3" />
            {receipt.comment && (
              <div className="alert alert-info">
                <strong>Comentario:</strong> {receipt.comment}
              </div>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReceiptDetails;
