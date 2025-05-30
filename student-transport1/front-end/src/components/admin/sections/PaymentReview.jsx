import React, { useState, useEffect } from 'react'
import { Table, Button, Badge, Form, Row, Col, Spinner } from 'react-bootstrap'
import { api } from '../../../api'

const PaymentReview = () => {
  const [receipts, setReceipts] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState({
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString(),
    parent: '',
    student: '',
    status: 'all'
  })

  const years = ['2025','2024','2023']
  const months = [
    { val: '1', name: 'Enero' }, { val: '2', name: 'Febrero' },
    { val: '3', name: 'Marzo' }, { val: '4', name: 'Abril' },
    { val: '5', name: 'Mayo' }, { val: '6', name: 'Junio' },
    { val: '7', name: 'Julio' }, { val: '8', name: 'Agosto' },
    { val: '9', name: 'Septiembre' }, { val: '10', name: 'Octubre' },
    { val: '11', name: 'Noviembre' }, { val: '12', name: 'Diciembre' }
  ]
  const statuses = [
    { val: 'all', label: 'Todos' },
    { val: 'approved', label: 'Aprobados' },
    { val: 'pending',  label: 'Pendientes' },
    { val: 'rejected', label: 'Rechazados' }
  ]

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/receipts', {
          params: { year: filter.year, month: filter.month }
        })
        setReceipts(data)
      } catch (err) {
        console.error('Error cargando comprobantes:', err)
      }
      setLoading(false)
    }
    load()
  }, [filter.year, filter.month])

  const displayed = receipts.filter(r => {
    const byParent  = filter.parent  === '' || r.parent.name.toLowerCase().includes(filter.parent.toLowerCase())
    const byStud    = filter.student === '' || r.studentNames.some(n => n.toLowerCase().includes(filter.student.toLowerCase()))
    const byStatus  = filter.status  === 'all'   || r.status === filter.status
    return byParent && byStud && byStatus
  })

  return (
    <div className="payment-review p-4">
      <h2>Revisión de Pagos</h2>

      <div className="payment-filters mb-4 p-3 bg-light rounded">
        <Row className="gy-3">
          <Col md={2}>
            <Form.Group>
              <Form.Label>Año</Form.Label>
              <Form.Select
                value={filter.year}
                onChange={e => setFilter({...filter, year: e.target.value})}
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={2}>
            <Form.Group>
              <Form.Label>Mes</Form.Label>
              <Form.Select
                value={filter.month}
                onChange={e => setFilter({...filter, month: e.target.value})}
              >
                {months.map(m => (
                  <option key={m.val} value={m.val}>{m.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Padre/Madre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Buscar padre"
                value={filter.parent}
                onChange={e => setFilter({...filter, parent: e.target.value})}
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Estudiante</Form.Label>
              <Form.Control
                type="text"
                placeholder="Buscar estudiante"
                value={filter.student}
                onChange={e => setFilter({...filter, student: e.target.value})}
              />
            </Form.Group>
          </Col>

          <Col md={2}>
            <Form.Group>
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={filter.status}
                onChange={e => setFilter({...filter, status: e.target.value})}
              >
                {statuses.map(s => (
                  <option key={s.val} value={s.val}>{s.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </div>

      {loading
        ? <div className="text-center"><Spinner animation="border" /></div>
        : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Padre/Madre</th>
                <th>Teléfono</th>
                <th>Estudiantes</th>
                <th>Monto</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map(r => (
                <tr key={r._id}>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td>{r.parent.name}</td>
                  <td>{r.parent.phone}</td>
                  <td>{r.studentNames.join(', ')}</td>
                  <td>${r.amount}</td>
                  <td>
                    {r.type === 'both'   ? 'Ida y vuelta' :
                     r.type === 'pickup' ? 'Solo ida'     :
                     'Solo vuelta'}
                  </td>
                  <td>
                    <Badge bg={
                      r.status === 'approved' ? 'success' :
                      r.status === 'pending'  ? 'warning' :
                      'danger'
                    }>
                      { r.status === 'approved'
                          ? 'Aprobado'
                          : r.status === 'pending'
                            ? 'Pendiente'
                            : 'Rechazado'
                      }
                    </Badge>
                  </td>
                  <td>
                    <Button size="sm">
                      <a
                        href={r.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'white', textDecoration: 'none' }}
                      >
                        📄 Ver
                      </a>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )
      }
    </div>
  )
}

export default PaymentReview
