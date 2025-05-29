import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const gradeOptionsMap = {
  preescolar: ['Materno', 'Kinder'],
  primaria:   ['1°','2°','3°','4°','5°','6°'],
  secundaria: ['7°','8°','9°','10°','11°']
};

const EditStudentModal = ({ show, onHide, student, onSave }) => {
  const [formData, setFormData] = useState({
    name:    '',
    level:   'preescolar',
    grade:   '',
    address: ''
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name:    student.name || '',
        level:   student.level || 'preescolar',
        grade:   student.grade || gradeOptionsMap[student.level || 'preescolar'][0],
        address: student.address || ''
      });
    }
  }, [student]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'level') {
      setFormData(prev => ({
        ...prev,
        level: value,
        grade: gradeOptionsMap[value][0]
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    onSave({ _id: student._id, ...formData });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar estudiante</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Nombre */}
          <Form.Group className="mb-3">
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control
              type="text" name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          {/* Nivel */}
          <Form.Group className="mb-3">
            <Form.Label>Nivel educativo</Form.Label>
            <Form.Select
              name="level"
              value={formData.level}
              onChange={handleChange}
            >
              <option value="preescolar">Preescolar</option>
              <option value="primaria">Primaria</option>
              <option value="secundaria">Secundaria</option>
            </Form.Select>
          </Form.Group>
          {/* Grado */}
          <Form.Group className="mb-3">
            <Form.Label>Grado</Form.Label>
            <Form.Select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
            >
              {gradeOptionsMap[formData.level].map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </Form.Select>
          </Form.Group>
          {/* Dirección */}
          <Form.Group className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text" name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit}>Guardar cambios</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditStudentModal;
