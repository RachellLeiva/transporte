import React, { useState, useEffect } from 'react';
import { api } from '../../../api';
import AddStudentModal  from '../../modals/AddStudentModal';
import EditStudentModal from '../../modals/EditStudentModal';
import StudentCard      from '../StudentCard';

const StudentInfo = () => {
  const [students, setStudents] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => { api.get('/students').then(res => setStudents(res.data)); }, []);

  const handleAdd = newStudent => { api.post('/students', newStudent).then(res => setStudents(prev => [res.data, ...prev])); setShowAdd(false); };
  const handleEdit = upd => { api.put(`/students/${upd._id}`, upd).then(res => setStudents(prev => prev.map(s => s._id===res.data._id?res.data:s))); setShowEdit(false); };
  const handleDelete = id => { api.delete(`/students/${id}`).then(() => setStudents(prev => prev.filter(s => s._id!==id))); };

  return (
    <div className="info-section">
      <div className="section-header">
        <h1>Información de los estudiantes</h1>
        <button className="btn-add" onClick={()=>setShowAdd(true)}><i className="fas fa-plus"></i> Agregar estudiante</button>
      </div>
      <div className="students-grid">
        {students.map(st => <StudentCard key={st._id} student={st} onEdit={()=>{setSelected(st);setShowEdit(true)}} onDelete={()=>handleDelete(st._id)} />)}
      </div>
      <AddStudentModal show={showAdd} onHide={()=>setShowAdd(false)} onSave={handleAdd} />
      <EditStudentModal show={showEdit} onHide={()=>setShowEdit(false)} student={selected} onSave={handleEdit} />
    </div>
  );
};

export default StudentInfo;