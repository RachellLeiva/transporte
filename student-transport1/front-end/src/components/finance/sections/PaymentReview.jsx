import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Form } from 'react-bootstrap';
import { api } from '../../../api';
import ReceiptDetails      from './ReceiptDetails';
import ReceiptCommentModal from '../modals/ReceiptCommentModal';

const months = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

export default function PaymentReview() {
  const [parents, setParents]           = useState([]);
  const [studentMap, setStudentMap]     = useState({});
  const [receipts, setReceipts]         = useState([]);
  const [year, setYear]                 = useState(new Date().getFullYear());
  const [month, setMonth]               = useState('all');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showDetails, setShowDetails]   = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [{ data: ps }, { data: studs }, { data: recs }] = await Promise.all([
          api.get('/users'),
          api.get('/students'),
          api.get(`/receipts?year=${year}&month=${month}`)
        ]);
        setParents(ps);

        const map = {};
        studs.forEach(s => {
          if (!map[s.parent]) map[s.parent] = [];
          map[s.parent].push(s.name);
        });
        setStudentMap(map);

        setReceipts(recs);
      } catch (err) {
        console.error('Error cargando datos:', err);
      }
    };
    fetchAll();
  }, [year, month]);

  const handleStatus = async (id, status) => {
    try {
      const { data: updated } = await api.put(`/receipts/${id}/status`, { status });
      setReceipts(rs => rs.map(r => r._id===id ? updated : r));
    } catch (err) {
      console.error('Error actualizando estado:', err);
    }
  };

  return (
    <div className="payment-review">
      <div className="d-flex justify-content-between mb-4">
        <h2>Revisión Mensual por Padre</h2>
        <div className="d-flex gap-2">
          <Form.Select value={year} onChange={e => setYear(+e.target.value)}>
            {[2025,2024,2023].map(y => <option key={y}>{y}</option>)}
          </Form.Select>
          <Form.Select value={month} onChange={e => setMonth(e.target.value)}>
            <option value="all">Todos</option>
            {months.map((m,i)=>(
              <option key={i} value={i+1}>{m}</option>
            ))}
          </Form.Select>
        </div>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Padre</th>
            <th>Teléfono</th>
            <th>Estudiantes</th>
            <th>Periodo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {parents.map(p => {
            const rec = receipts.find(r =>
              r.parent._id===p._id &&
              (month==='all' || r.month===+month)
            );
            return (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.phone||'—'}</td>
                <td>{(studentMap[p._id]||[]).join(', ')||'—'}</td>
                <td>
                  {month==='all'
                    ? 'Todos'
                    : `${months[month-1]} ${year}`}
                </td>
                <td>
                  {rec
                    ? rec.status==='approved' ? 'Aprobado'
                      : rec.status==='pending'  ? 'Pendiente'
                      : 'Rechazado'
                    : 'No hay'}
                </td>
                <td className="d-flex gap-2">
                  {rec ? (
                    <>
                      <Button size="sm" onClick={()=>{
                        setSelectedReceipt(rec);
                        setShowDetails(true);
                      }}>
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="success"
                        disabled={rec.status==='approved'}
                        onClick={() => handleStatus(rec._id,'approved')}
                      >
                        Aprobar
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={rec.status==='rejected'}
                        onClick={() => handleStatus(rec._id,'rejected')}
                      >
                        Rechazar
                      </Button>
                    </>
                  ) : (
                    <span>—</span>
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

      {/* no usamos aquí ReceiptCommentModal; la acción de “Rechazar” ya lo marca */}
    </div>
  );
}
