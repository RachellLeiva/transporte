import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Form } from 'react-bootstrap';
import ReceiptDetails from './ReceiptDetails';
import ReceiptCommentModal from '../modals/ReceiptCommentModal';

const PaymentReview = () => {
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Datos de ejemplo
    const mockReceipts = [
      {
        id: 1,
        parentName: 'Juan Pérez',
        studentName: 'María Pérez',
        amount: 150.00,
        date: '2023-05-15',
        imageUrl: '/receipts/1.jpg',
        status: 'pending',
        comment: ''
      },
      {
        id: 2,
        parentName: 'Ana López',
        studentName: 'Carlos López',
        amount: 150.00,
        date: '2023-05-10',
        imageUrl: '/receipts/2.jpg',
        status: 'approved',
        comment: 'Pago completo'
      },
      {
        id: 3,
        parentName: 'Luisa García',
        studentName: 'Pedro García',
        amount: 120.00,
        date: '2023-05-05',
        imageUrl: '/receipts/3.jpg',
        status: 'rejected',
        comment: 'Monto incorrecto'
      }
    ];
    setReceipts(mockReceipts);
  }, []);

  const handleStatusChange = (receiptId, status) => {
    setReceipts(receipts.map(receipt => 
      receipt.id === receiptId ? { ...receipt, status } : receipt
    ));
  };

  const handleAddComment = (receiptId, comment) => {
    setReceipts(receipts.map(receipt => 
      receipt.id === receiptId ? { ...receipt, comment } : receipt
    ));
  };

  const filteredReceipts = filter === 'all' 
    ? receipts 
    : receipts.filter(r => r.status === filter);

  return (
    <div className="payment-review">
      <div className="d-flex justify-content-between mb-4">
        <h2>Revisión de Comprobantes</h2>
        <Form.Select 
          style={{ width: '200px' }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="pending">Pendientes</option>
          <option value="approved">Aprobados</option>
          <option value="rejected">Rechazados</option>
        </Form.Select>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Padre/Madre</th>
            <th>Estudiante</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredReceipts.map(receipt => (
            <tr key={receipt.id}>
              <td>{receipt.id}</td>
              <td>{receipt.parentName}</td>
              <td>{receipt.studentName}</td>
              <td>${receipt.amount.toFixed(2)}</td>
              <td>{receipt.date}</td>
              <td>
                <Badge 
                  bg={
                    receipt.status === 'approved' ? 'success' :
                    receipt.status === 'rejected' ? 'danger' : 'warning'
                  }
                >
                  {
                    receipt.status === 'approved' ? 'Aprobado' :
                    receipt.status === 'rejected' ? 'Rechazado' : 'Pendiente'
                  }
                </Badge>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <Button 
                    variant="info" 
                    size="sm"
                    onClick={() => {
                      setSelectedReceipt(receipt);
                      setShowDetails(true);
                    }}
                  >
                    Ver
                  </Button>
                  <Button 
                    variant="success" 
                    size="sm"
                    onClick={() => handleStatusChange(receipt.id, 'approved')}
                    disabled={receipt.status === 'approved'}
                  >
                    Aprobar
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => {
                      setSelectedReceipt(receipt);
                      setShowCommentModal(true);
                    }}
                    disabled={receipt.status === 'rejected'}
                  >
                    Rechazar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ReceiptDetails
        show={showDetails}
        onHide={() => setShowDetails(false)}
        receipt={selectedReceipt}
      />

      <ReceiptCommentModal
        show={showCommentModal}
        onHide={() => setShowCommentModal(false)}
        receipt={selectedReceipt}
        onSave={(comment) => {
          handleStatusChange(selectedReceipt.id, 'rejected');
          handleAddComment(selectedReceipt.id, comment);
        }}
      />
    </div>
  );
};

export default PaymentReview;