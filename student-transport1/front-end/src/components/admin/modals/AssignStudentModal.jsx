import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const AssignStudentModal = ({ show, onHide, parent, students, onSave }) => {
  const [studentData, setStudentData] = useState(
    students.length > 0 
      ? students[0] 
      : { 
          id: null, 
          name: '', 
          grade: '', 
          parentId: parent?.id, 
          parentName: parent?.name 
        }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const handleSubmit = () => {
    onSave(studentData);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {students.length > 0 ? 'Editar Estudiante' : 'Asignar Estudiante'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nombre del Padre/Madre</Form.Label>
                <Form.Control
                  type="text"
                  value={parent?.name || ''}
                  disabled
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Teléfono del Padre/Madre</Form.Label>
                <Form.Control
                  type="text"
                  value={parent?.phone || 'No especificado'}
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Nombre del Estudiante</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={studentData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Grado Académico</Form.Label>
            <Form.Select
              name="grade"
              value={studentData.grade}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar grado</option>
              <option value="1ro">1er Grado</option>
              <option value="2do">2do Grado</option>
              <option value="3ro">3er Grado</option>
              <option value="4to">4to Grado</option>
              <option value="5to">5to Grado</option>
              <option value="6to">6to Grado</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="address"
              value={parent?.address || ''}
              disabled
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {students.length > 0 ? 'Actualizar' : 'Asignar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignStudentModal;