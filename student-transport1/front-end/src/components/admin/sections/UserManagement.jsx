import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Alert } from 'react-bootstrap';
import EditUserModal from '../modals/EditUserModal';
import DeleteAccountModal from '../../modals/DeleteAccountModal';
import { api } from '../../../api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/users'),
      api.get('/students')
    ])
      .then(([uRes, sRes]) => {
        setUsers(uRes.data);
        setStudents(sRes.data);
      })
      .catch(err => console.error(err));
  }, []);

  const onSaveUser = (data) => {
    api.put(`/users/${data._id}`, data)
      .then(res => {
        setUsers(users.map(u => u._id === res.data._id ? res.data : u));
        setAlert({ show: true, message: 'Usuario actualizado', variant: 'success' });
      })
      .catch(() => setAlert({ show: true, message: 'Error actualizando', variant: 'danger' }));
    setShowEdit(false);
  };

  const onDeleteUser = (id) => {
    api.delete(`/users/${id}`)
      .then(() => {
        setUsers(users.filter(u => u._id !== id));
        setAlert({ show: true, message: 'Usuario eliminado', variant: 'danger' });
      })
      .catch(() => setAlert({ show: true, message: 'Error eliminando', variant: 'danger' }));
    setShowDelete(false);
  };

  // Ordena: padres primero, luego cualquier otro rol
  const sortedUsers = [...users].sort((a, b) => {
    if (a.role === 'parent' && b.role !== 'parent') return -1;
    if (a.role !== 'parent' && b.role === 'parent') return 1;
    return 0;
  });

  return (
    <div className="user-management">
      <h2>Gestión de Usuarios</h2>
      {alert.show && (
        <Alert
          variant={alert.variant}
          dismissible
          onClose={() => setAlert(a => ({ ...a, show: false }))}
          className="mt-3"
        >
          {alert.message}
        </Alert>
      )}

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Estudiantes</th>
            <th>Rol</th>
            <th>Servicio</th>
            <th>Monto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map(u => {
            const isParent = u.role === 'parent';
            const kids = isParent
              ? students.filter(s => s.parent === u._id)
              : [];

            return (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.phone || '—'}</td>

                <td>
                  {isParent && kids.length > 0
                    ? kids.map(s => s.address || '—').join(', ')
                    : ''}
                </td>

                <td>
                  {isParent && kids.length > 0
                    ? kids.map(s => `${s.name} (${s.grade})`).join(', ')
                    : ''}
                </td>

                <td>
                  <Badge bg={
                    u.role === 'admin'   ? 'primary' :
                    u.role === 'finance' ? 'warning' :
                    'success'
                  }>
                    { u.role === 'admin'   ? 'Administrador' :
                      u.role === 'finance' ? 'Finanzas' :
                      'Padre' }
                  </Badge>
                </td>

                <td>{isParent ? ({
                  both: 'Ida y Vuelta',
                  pickup: 'Solo Ida',
                  dropoff: 'Solo Vuelta'
                }[u.serviceType] || '—') : ''}</td>

                <td>{isParent && typeof u.amount === 'number'
                  ? `$${u.amount.toFixed(2)}` : ''}
                </td>

                <td>
                  <div className="d-flex gap-2">
                    <Button
                      variant="info" size="sm"
                      onClick={() => { setSelectedUser(u); setShowEdit(true); }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger" size="sm"
                      onClick={() => { setSelectedUser(u); setShowDelete(true); }}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <EditUserModal
        show={showEdit}
        onHide={() => setShowEdit(false)}
        user={selectedUser}
        onSave={onSaveUser}
      />
      <DeleteAccountModal
        show={showDelete}
        onHide={() => setShowDelete(false)}
        onConfirm={() => onDeleteUser(selectedUser._id)}
        userType={selectedUser?.role === 'parent' ? 'parent' : 'admin'}
      />
    </div>
  );
};

export default UserManagement;
