// src/components/finance/sections/ReceiptDetails.jsx
import React from 'react';
import { Modal, Button, Image } from 'react-bootstrap';

const ReceiptDetails = ({ show, onHide, receipt }) => {
  if (!receipt) return null;

  // Extraer la fecha en formato DD/MM/YYYY
  const uploadedAt = new Date(receipt.createdAt);
  const formattedDate = `${uploadedAt.getDate()}/${uploadedAt.getMonth() + 1}/${uploadedAt.getFullYear()}`;

  const isPdf = receipt.fileUrl.toLowerCase().endsWith('.pdf');

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Comprobante #{receipt._id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <p><strong>Padre/Madre:</strong> {receipt.parent.name}</p>
          <p><strong>Teléfono:</strong> {receipt.parent.phone || '—'}</p>
          <p><strong>Estudiante(s):</strong> {receipt.studentNames?.join(', ') || '—'}</p>
          <p><strong>Monto:</strong> ${receipt.amount}</p>
          <p><strong>Fecha subida:</strong> {formattedDate}</p>
        </div>

        <hr />

        <div className="text-center">
          <h5>Comprobante:</h5>
          {isPdf ? (
            <Button
              variant="primary"
              onClick={() => window.open(receipt.fileUrl, '_blank')}
            >
              <i className="fas fa-file-pdf"></i> Ver PDF
            </Button>
          ) : (
            <Image
              src={receipt.fileUrl}
              fluid
              thumbnail
              style={{ maxHeight: '500px' }}
            />
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReceiptDetails;
