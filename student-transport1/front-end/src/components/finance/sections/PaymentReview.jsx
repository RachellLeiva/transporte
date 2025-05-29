// front-end/src/components/finance/sections/PaymentReview.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Form } from 'react-bootstrap';
import ReceiptDetails      from './ReceiptDetails';
import ReceiptCommentModal from '../modals/ReceiptCommentModal';
import { api }             from '../../../api';

const monthNames = [
  { label: 'Enero',     value: '01' },
  { label: 'Febrero',   value: '02' },
  { label: 'Marzo',     value: '03' },
  { label: 'Abril',     value: '04' },
  { label: 'Mayo',      value: '05' },
  { label: 'Junio',     value: '06' },
  { label: 'Julio',     value: '07' },
  { label: 'Agosto',    value: '08' },
  { label: 'Septiembre',value: '09' },
  { label: 'Octubre',   value: '10' },
  { label: 'Noviembre', value: '11' },
  { label: 'Diciembre', value: '12' }
];

const PaymentReview = () => {
  const now = new Date();
  const [filterYear, setFilterYear]   = useState(String(now.getFullYear()));
  const [filterMonth, setFilterMonth] = useState(String(now.getMonth()+1).padStart(2,'0'));

  const [parents, setParents]     = useState([]);
  const [studentsMap, setStudentsMap] = useState({});
  const [receipts, setReceipts]   = useState([]);

  const [selectedReceipt, setSelectedReceipt]   = useState(null);
  const [showDetails, setShowDetails]           = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);

  // 1) cargar padres
  useEffect(() => {
    api.get('/users', { params: { role: 'parent' } })
       .then(r => setParents(r.data))
       .catch(console.error);
  }, []);

  // 2) cargar hijos por cada padre
  useEffect(() => {
    parents.forEach(p => {
      api.get('/students', { params: { parentId: p._id } })
         .then(r => setStudentsMap(m => ({ ...m, [p._id]: r.data })))
         .catch(console.error);
    });
  }, [parents]);

  // 3) cargar comprobantes filtrados
  useEffect(() => {
    api.get('/receipts', { params: { year: filterYear, month: filterMonth } })
       .then(r => setReceipts(r.data))
       .catch(console.error);
  }, [filterYear, filterMonth]);

  // años = 2025 + años que aparezcan en receipts
  const years = Array.from(
    new Set([2025, ...receipts.map(r => new Date(r.date).getFullYear())])
  ).sort((a,b) => b - a);

  // filas por padre
  const rows = parents.flatMap(p => {
    const recs = receipts.filter(r => r.parentId === p._id);
    return recs.length
      ? recs.map(r => ({ parent: p, receipt: r }))
      : [{ parent: p, receipt: null }];
  });

  return (
    <div className="payment-review">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Revisión de Comprobantes</h2>
        <div className="d-flex gap-2">
          <Form.Select
            style={{ width: 120 }}
            value={filterYear}
            onChange={e => setFilterYear(e.target.value)}
          >
            {years.map(y => <option key={y} value={String(y)}>{y}</option>)}
          </Form.Select>
          <Form.Select
            style={{ width: 140 }}
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
          >
            {monthNames.map(m => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Form.Select>
        </div>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Padre/Madre</th>
            <th>Teléfono</th>
            <th>Estudiantes</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const { parent, receipt } = row;
            const kids = (studentsMap[parent._id] || []).map(s => s.name).join(', ') || '—';
            return (
              <tr key={`${parent._id}-${idx}`}>
                <td>{receipt?._id ?? '-'}</td>
                <td>{parent.name}</td>
                <td>{parent.phone || '—'}</td>
                <td>{kids}</td>
                <td>{receipt? `$${receipt.amount.toFixed(2)}` : '—'}</td>
                <td>{receipt? new Date(receipt.date).toISOString().split('T')[0] : '—'}</td>
                <td>
                  {receipt ? (
                    <Badge bg={
                      receipt.status === 'approved' ? 'success' :
                      receipt.status === 'rejected' ? 'danger' : 'warning'
                    }>
                      {receipt.status === 'approved'
                        ? 'Aprobado'
                        : receipt.status === 'rejected'
                        ? 'Rechazado'
                        : 'Pendiente'
                      }
                    </Badge>
                  ) : (
                    <Badge bg="secondary">No hay</Badge>
                  )}
                </td>
                <td>
                  {receipt ? (
                    <div className="d-flex gap-2">
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => {
                          setSelectedReceipt(receipt);
                          setShowDetails(true);
                        }}
                      >Ver</Button>
                      <Button variant="success" size="sm" disabled>Aprobar</Button>
                      <Button variant="danger" size="sm" disabled>Rechazar</Button>
                    </div>
                  ) : (
                    <Button variant="outline-primary" size="sm">
                      Notificar por correo
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
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
        onSave={comment => {
          setShowCommentModal(false);
        }}
      />
    </div>
  );
};

export default PaymentReview;
