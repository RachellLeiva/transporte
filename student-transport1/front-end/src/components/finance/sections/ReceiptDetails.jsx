import React from 'react';
import { Modal, Button, Image } from 'react-bootstrap';

const ReceiptDetails = ({ show, onHide, receipt }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Comprobante #{receipt?.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {receipt && (
          <div>
            <div className="row mb-3">
              <div className="col-md-6">
                <p><strong>Padre/Madre:</strong> {receipt.parentName}</p>
                <p><strong>Estudiante:</strong> {receipt.studentName}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Monto:</strong> ${receipt.amount.toFixed(2)}</p>
                <p><strong>Fecha:</strong> {receipt.date}</p>
              </div>
            </div>
            
            <div className="mb-3">
              <h5>Comprobante:</h5>
              <Image src={receipt.imageUrl} fluid thumbnail />
            </div>
            
            {receipt.comment && (
              <div className="alert alert-info">
                <strong>Comentario:</strong> {receipt.comment}
              </div>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReceiptDetails;