import React, { useState, useEffect } from 'react';
import { Table, Form } from 'react-bootstrap';
import { api } from '../../../api';

const GradeOrder = () => {
  const [level, setLevel] = useState('Preescolar');
  const [students, setStudents] = useState([]);
  const [parents, setParents]   = useState([]);

  useEffect(() => {
    // Carga todos los estudiantes y todos los padres (para teléfono)
    (async () => {
      try {
        const [stuRes, parRes] = await Promise.all([
          api.get('/students'),
          api.get('/users')
        ]);
        setStudents(stuRes.data);
        setParents(parRes.data);
      } catch (err) {
        console.error('Error cargando datos:', err);
      }
    })();
  }, []);

  // Mapeo nivel → grados permitidos
  const gradesByLevel = {
    Preescolar: ['Materno','Kinder'],
    Primaria:   ['1°','2°','3°','4°','5°','6°'],
    Secundaria: ['7°','8°','9°','10°','11°']
  };

  // Filtramos
  const filtered = students.filter(s =>
    gradesByLevel[level].includes(s.grade)
  );

  // Busca teléfono del padre
  const findPhone = parentId => {
    const p = parents.find(u => u._id === parentId);
    return p ? p.phone : '—';
  };

  return (
    <div className="grade-order p-4">
      <h2>Orden por Grado</h2>

      <Form.Group className="mb-3" style={{ maxWidth: '300px' }}>
        <Form.Label>Nivel educativo:</Form.Label>
        <Form.Select
          value={level}
          onChange={e => setLevel(e.target.value)}
        >
          <option>Preescolar</option>
          <option>Primaria</option>
          <option>Secundaria</option>
        </Form.Select>
      </Form.Group>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre del Estudiante</th>
            <th>Grado</th>
            <th>Dirección</th>
            <th>Teléfono Padre/Madre</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map(s => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.grade}</td>
                <td>{s.address}</td>
                <td>{findPhone(s.parent)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No hay estudiantes en {level}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default GradeOrder;
