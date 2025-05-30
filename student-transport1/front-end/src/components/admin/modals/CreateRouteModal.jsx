import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { api } from '../../../api';

const CreateRouteModal = ({ show, onHide, onSave, route }) => {
  const [routeName, setRouteName] = useState('');
  const [stops, setStops] = useState([]);
  const [students, setStudents] = useState([]);

  // Carga lista de estudiantes
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/students');
        setStudents(data);
      } catch (err) {
        console.error('Error cargando estudiantes:', err);
      }
    })();
  }, []);

  // Cuando abro modal (nuevo o editar), inicializo campos
  useEffect(() => {
    if (route) {
      setRouteName(route.name);
      // asegurar que tenga el formato stops: [{ time, student: id, address }]
      setStops(route.stops.map(s => ({
        time: s.time,
        student: s.student._id,
        address: s.address
      })));
    } else {
      setRouteName('');
      setStops([{ time: '', student: '', address: '' }]);
    }
  }, [route, show]);

  const handleAddStop = () =>
    setStops([...stops, { time: '', student: '', address: '' }]);

  const handleStopChange = (idx, field, value) => {
    const copy = [...stops];
    copy[idx][field] = value;
    if (field === 'student') {
      const sel = students.find(s => s._id === value);
      copy[idx].address = sel?.address || '';
    }
    setStops(copy);
  };

  const handleRemoveStop = (idx) =>
    setStops(stops.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    const payload = {
      ...(route?._id ? { _id: route._id } : {}),
      name: routeName,
      stops
    };
    onSave(payload);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{route ? 'Editar Ruta' : 'Crear Nueva Ruta'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de la Ruta</Form.Label>
            <Form.Control
              type="text"
              value={routeName}
              onChange={e => setRouteName(e.target.value)}
              placeholder="Ej: Ruta Mañana"
              required
            />
          </Form.Group>

          <h5>Paradas</h5>
          {stops.map((stop, i) => (
            <Row key={i} className="mb-2 align-items-center">
              <Col md={2}>
                <Form.Control
                  type="time"
                  value={stop.time}
                  onChange={e => handleStopChange(i, 'time', e.target.value)}
                  required
                />
              </Col>
              <Col md={4}>
                <Form.Select
                  value={stop.student}
                  onChange={e => handleStopChange(i, 'student', e.target.value)}
                  required
                >
                  <option value="">Selecciona estudiante</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Control type="text" value={stop.address} readOnly />
              </Col>
              <Col md={2}>
                {stops.length > 1 && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemoveStop(i)}
                  >Elim.</Button>
                )}
              </Col>
            </Row>
          ))}

          <Button variant="secondary" onClick={handleAddStop}>
            Agregar Parada
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit}>
          {route ? 'Guardar cambios' : 'Crear Ruta'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateRouteModal;
