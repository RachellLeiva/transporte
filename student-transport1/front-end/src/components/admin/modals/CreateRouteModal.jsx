import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const CreateRouteModal = ({ show, onHide, onCreate }) => {
  const [routeName, setRouteName] = useState('');
  const [stops, setStops] = useState([{ time: '', location: '' }]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const handleAddStop = () => {
    setStops([...stops, { time: '', location: '' }]);
  };

  const handleStopChange = (index, field, value) => {
    const newStops = [...stops];
    newStops[index][field] = value;
    setStops(newStops);
  };

  const handleRemoveStop = (index) => {
    const newStops = stops.filter((_, i) => i !== index);
    setStops(newStops);
  };

  const handleSubmit = () => {
    const newRoute = {
      id: Date.now(), // ID temporal
      name: routeName,
      stops: stops.filter(stop => stop.time && stop.location),
      students: selectedStudents
    };
    onCreate(newRoute);
    onHide();
    // Reset form
    setRouteName('');
    setStops([{ time: '', location: '' }]);
    setSelectedStudents([]);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Crear Nueva Ruta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de la Ruta</Form.Label>
            <Form.Control
              type="text"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              placeholder="Ej: Ruta Norte"
              required
            />
          </Form.Group>

          <h5>Paradas</h5>
          {stops.map((stop, index) => (
            <Row key={index} className="mb-3">
              <Col md={4}>
                <Form.Control
                  type="time"
                  value={stop.time}
                  onChange={(e) => handleStopChange(index, 'time', e.target.value)}
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Control
                  type="text"
                  value={stop.location}
                  onChange={(e) => handleStopChange(index, 'location', e.target.value)}
                  placeholder="Ubicación"
                  required
                />
              </Col>
              <Col md={2}>
                {stops.length > 1 && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveStop(index)}
                  >
                    Eliminar
                  </Button>
                )}
              </Col>
            </Row>
          ))}
          <Button
            variant="secondary"
            onClick={handleAddStop}
            className="mb-3"
          >
            Agregar Parada
          </Button>

          <Form.Group className="mb-3">
            <Form.Label>Estudiantes a Asignar</Form.Label>
            <Form.Select
              multiple
              value={selectedStudents.map(s => s.id)}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions)
                  .map(option => ({
                    id: parseInt(option.value),
                    name: option.label,
                    serviceType: 'both' // Default value
                  }));
                setSelectedStudents(selected);
              }}
            >
              {/* Esto debería venir de props o de un contexto global */}
              <option value="101">María Pérez</option>
              <option value="102">Carlos López</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Crear Ruta
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Asegúrate de exportar como default
export default CreateRouteModal;