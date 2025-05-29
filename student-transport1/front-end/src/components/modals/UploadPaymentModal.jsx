import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const UploadPaymentModal = ({ show, onHide, onUpload }) => {
  const [file, setFile] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const handleFileChange = e => setFile(e.target.files[0]);
  const handleSubmit = () => {
    onUpload({ file, year, month });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Subir comprobante de pago</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Año</Form.Label>
            <Form.Select value={year} onChange={e => setYear(parseInt(e.target.value))}>
              {[2025, 2024, 2023].map(y => <option key={y} value={y}>{y}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mes</Form.Label>
            <Form.Select value={month} onChange={e => setMonth(parseInt(e.target.value))}>
              {[...Array(12).keys()].map(i => (
                <option key={i+1} value={i+1}>
                  {['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][i]}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Archivo (PDF o imagen)</Form.Label>
            <Form.Control type="file" accept=".pdf,.png,.jpg" onChange={handleFileChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!file}>Subir</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadPaymentModal;