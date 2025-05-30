/* src/components/modals/AddStudentModal.jsx */
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const gradeMap = {
  preescolar: ['Materno', 'Kinder'],
  primaria: ['1°', '2°', '3°', '4°', '5°', '6°'],
  secundaria: ['7°', '8°', '9°', '10°', '11°']
};

const AddStudentModal = ({ show, onHide, onSave }) => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState('primaria');
  const [gradeOptions, setGradeOptions] = useState(gradeMap['primaria']);
  const [grade, setGrade] = useState(gradeMap['primaria'][0]);
  const [address, setAddress] = useState('');

  useEffect(() => {
    const opts = gradeMap[level];
    setGradeOptions(opts);
    setGrade(opts[0]);
  }, [level]);

  const handleSubmit = () => {
    onSave({ name, level, grade, address });
    onHide();
    // reset for next time
    setName('');
    setLevel('primaria');
    setAddress('');
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agregar estudiante</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nivel educativo</Form.Label>
            <Form.Select
              value={level}
              onChange={e => setLevel(e.target.value)}
            >
              <option value="preescolar">Preescolar</option>
              <option value="primaria">Primaria</option>
              <option value="secundaria">Secundaria</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Grado</Form.Label>
            <Form.Select
              value={grade}
              onChange={e => setGrade(e.target.value)}
            >
              {gradeOptions.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddStudentModal;
