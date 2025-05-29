import React, { useState, useEffect } from 'react';
import { Table, Form, Badge } from 'react-bootstrap';

const PaymentReview = () => {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState({
    date: '',
    parent: '',
    student: '',
    status: 'all'
  });

  useEffect(() => {
    // Datos de ejemplo
    const mockPayments = [
      {
        id: 1,
        date: '2025-05-15',
        parent: 'Juan Pérez',
        student: 'María Pérez',
        amount: 120,
        type: 'both',
        status: 'approved',
        file: 'comprobante1.pdf'
      },
      {
        id: 2,
        date: '2025-05-10',
        parent: 'Ana López',
        student: 'Carlos López',
        amount: 80,
        type: 'pickup',
        status: 'pending',
        file: 'comprobante2.jpg'
      }
    ];
    setPayments(mockPayments);
  }, []);

  const filteredPayments = payments.filter(payment => {
    return (
      (filter.date === '' || payment.date.includes(filter.date)) &&
      (filter.parent === '' || payment.parent.includes(filter.parent)) &&
      (filter.student === '' || payment.student.includes(filter.student)) &&
      (filter.status === 'all' || payment.status === filter.status)
    );
  });

  return (
    <div className="payment-review">
      <h2>Revisión de Pagos</h2>
      
      <div className="payment-filters mb-4 p-3 bg-light rounded">
        <Form.Group className="mb-3">
          <Form.Label>Filtrar por fecha:</Form.Label>
          <Form.Control 
            type="date" 
            value={filter.date}
            onChange={(e) => setFilter({...filter, date: e.target.value})}
          />
        </Form.Group>
        
        <div className="row">
          <div className="col-md-4">
            <Form.Group>
              <Form.Label>Padre/Madre:</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Buscar por nombre"
                value={filter.parent}
                onChange={(e) => setFilter({...filter, parent: e.target.value})}
              />
            </Form.Group>
          </div>
          
          <div className="col-md-4">
            <Form.Group>
              <Form.Label>Estudiante:</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Buscar por nombre"
                value={filter.student}
                onChange={(e) => setFilter({...filter, student: e.target.value})}
              />
            </Form.Group>
          </div>
          
          <div className="col-md-4">
            <Form.Group>
              <Form.Label>Estado:</Form.Label>
              <Form.Select 
                value={filter.status}
                onChange={(e) => setFilter({...filter, status: e.target.value})}
              >
                <option value="all">Todos</option>
                <option value="approved">Aprobados</option>
                <option value="pending">Pendientes</option>
                <option value="rejected">Rechazados</option>
              </Form.Select>
            </Form.Group>
          </div>
        </div>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Padre/Madre</th>
            <th>Estudiante</th>
            <th>Monto</th>
            <th>Tipo Servicio</th>
            <th>Estado</th>
            <th>Comprobante</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.map(payment => (
            <tr key={payment.id}>
              <td>{payment.date}</td>
              <td>{payment.parent}</td>
              <td>{payment.student}</td>
              <td>${payment.amount}</td>
              <td>
                {payment.type === 'both' ? 'Ambos' : 
                 payment.type === 'pickup' ? 'Recogida' : 'Dejada'}
              </td>
              <td>
                <Badge bg={
                  payment.status === 'approved' ? 'success' :
                  payment.status === 'pending' ? 'warning' : 'danger'
                }>
                  {payment.status === 'approved' ? 'Aprobado' :
                   payment.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                </Badge>
              </td>
              <td>
                <a 
                  href={`/uploads/${payment.file}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Ver comprobante
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default PaymentReview;