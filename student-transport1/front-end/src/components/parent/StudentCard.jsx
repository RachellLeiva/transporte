import React from 'react';

const StudentCard = ({ student, onEdit, onDelete }) => (
  <div className="student-card">
    <div className="student-header">
      <i className="fas fa-user-graduate"></i>
      <h3>{student.name}</h3>
    </div>
    <div className="student-details">
      <p><strong>Grado:</strong> {student.grade}</p>
      <p><strong>Dirección:</strong> {student.address}</p>
    </div>
    <div className="student-actions">
      <button onClick={onEdit}><i className="fas fa-edit"></i> Editar</button>
      <button onClick={onDelete}><i className="fas fa-trash-alt"></i> Eliminar</button>
    </div>
  </div>
);

export default StudentCard;