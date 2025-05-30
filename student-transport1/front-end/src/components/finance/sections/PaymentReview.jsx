// src/components/finance/sections/PaymentReview.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Form } from 'react-bootstrap';
import { api } from '../../../api';

const MONTHS = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

const PaymentReview = () => {
  const [parents, setParents] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [year, setYear]       = useState(new Date().getFullYear());
  const [month, setMonth]     = useState(new Date().getMonth()+1);

  // Carga padres y comprobantes al montar y al cambiar year/month
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uRes, rRes] = await Promise.all([
          api.get('/users'),
          api.get('/receipts', { params: { year, month } })
        ]);
        setParents(uRes.data);
        setReceipts(rRes.data);
      } catch (err) {
        console.error('Error cargando datos de Finanzas:', err);
      }
    };
    fetchData();
  }, [year, month]);

  // Mapea cada padre a su comprobante (si existe)
  const rows = parents.map(parent => {
    const rec = receipts.find(r => r.parent._id === parent._id);
    return {
      parent,
      receipt: rec || null
    };
  });

  const handleApprove = id => {
    setReceipts(rs =>
      rs.map(r => r._id === id ? { ...r, status: 'approved' } : r)
    );
    // aquí podrías llamar: api.put(`/receipts/${id}`,{status:'approved'})
  };

  const handleReject = id => {
    setReceipts(rs =>
      rs.map(r => r._id === id ? { ...r, status: 'rejected' } : r)
    );
    // o mostrar modal de comentario...
  };

  const handleNotify = parentId => {
    api.post('/notifications', { parentId, year, month })
      .then(() => alert('Correo enviado'))
      .catch(() => alert('Error enviando correo'));
  };

  return (
    <div className="finance-payment-review">
      <h2>Revisión de Comprobantes</h2>

      <div className="d-flex gap-3 align-items-end mb-4">
        <Form.Group>
          <Form.Label>Año</Form.Label>
          <Form.Select value={year} onChange={e=>setYear(+e.target.value)}>
            {[2025,2024,2023].map(y=>(
              <option key={y} value={y}>{y}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Mes</Form.Label>
          <Form.Select value={month} onChange={e=>setMonth(+e.target.value)}>
            {MONTHS.map((m,i)=>(
              <option key={m} value={i+1}>{m}</option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Padre/Madre</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ parent, receipt }) => {
            const status = receipt
              ? receipt.status === 'pending'  ? 'Sin revisar'
              : receipt.status === 'approved' ? 'Aprobado'
              : /* rejected */                 'Rechazado'
              : 'Sin comprobante';

            return (
              <tr key={parent._id}>
                <td>{parent.name}</td>
                <td>{parent.phone || '–'}</td>
                <td>
                  <Badge
                    bg={
                      status === 'Aprobado'    ? 'success' :
                      status === 'Rechazado'   ? 'danger' :
                      status === 'Sin revisar' ? 'warning' : 'secondary'
                    }
                  >
                    {status}
                  </Badge>
                </td>
                <td>
                  {receipt ? (
                    <>
                      <Button
                        size="sm"
                        className="me-2"
                        onClick={()=>window.open(receipt.fileUrl,'_blank')}
                      >
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="success"
                        className="me-2"
                        disabled={receipt.status==='approved'}
                        onClick={()=>handleApprove(receipt._id)}
                      >
                        Aprobar
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={receipt.status==='rejected'}
                        onClick={()=>handleReject(receipt._id)}
                      >
                        Rechazar
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="info"
                      onClick={()=>handleNotify(parent._id)}
                    >
                      Notificar por correo
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default PaymentReview;
