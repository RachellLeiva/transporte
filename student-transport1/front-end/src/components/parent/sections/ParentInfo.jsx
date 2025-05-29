import React, { useState, useEffect } from 'react';
import { api } from '../../../api';
import EditParentModal    from '../../modals/EditParentModal';
import DeleteAccountModal from '../../modals/DeleteAccountModal';

const ParentInfo = () => {
  const [data, setData] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDel, setShowDel] = useState(false);

  useEffect(() => { api.get('/auth/me').then(res => setData(res.data)); }, []);

  const handleSave = upd => { api.put('/auth/me', upd).then(res => { setData(res.data); setShowEdit(false); }); };
  const handleDelete = () => { api.delete('/auth/me').then(() => { localStorage.removeItem('token'); window.location.reload(); }); };

  if (!data) return <div>Cargando…</div>;

  return (
    <div className="info-section">
      <h1>Información del padre</h1>
      <div className="info-card">
        <div className="info-row"><span className="info-label">Nombre:</span><span className="info-value">{data.name}</span></div>
        <div className="info-row"><span className="info-label">Teléfono:</span><span className="info-value">{data.phone}</span></div>
        <div className="info-row"><span className="info-label">Correo:</span><span className="info-value">{data.email}</span></div>
        <div className="action-buttons">
          <button className="btn-edit" onClick={()=>setShowEdit(true)}><i className="fas fa-edit"></i> Editar</button>
          <button className="btn-delete" onClick={()=>setShowDel(true)}><i className="fas fa-trash-alt"></i> Eliminar cuenta</button>
        </div>
      </div>
      <EditParentModal show={showEdit} onHide={()=>setShowEdit(false)} parentData={data} onSave={handleSave} />
      <DeleteAccountModal show={showDel} onHide={()=>setShowDel(false)} onConfirm={handleDelete} />
    </div>
  );
};

export default ParentInfo;