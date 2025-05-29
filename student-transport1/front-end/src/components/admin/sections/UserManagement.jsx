import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Alert } from 'react-bootstrap';
import { api } from '../../../api'; 
import EditUserModal from '../modals/EditUserModal';
import AssignStudentModal from '../modals/AssignStudentModal';
import DeleteAccountModal from '../../modals/DeleteAccountModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [loading, setLoading] = useState(true);

  // Obtener usuarios y estudiantes de la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, studentsRes] = await Promise.all([
          api.get('/users'),
          api.get('/students')
        ]);
        setUsers(usersRes.data);
        setStudents(studentsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setAlert({ show: true, message: 'Error al cargar los datos', variant: 'danger' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveUser = async (userData) => {
    try {
      let response;
      if (userData._id) {
        // Editar usuario existente
        response = await api.put(`/users/${userData._id}`, userData);
        setUsers(users.map(u => u._id === userData._id ? response.data : u));
        setAlert({ show: true, message: 'Usuario actualizado correctamente', variant: 'success' });
      } else {
        // Crear nuevo usuario
        response = await api.post('/users', userData);
        setUsers([...users, response.data]);
        setAlert({ show: true, message: 'Usuario creado correctamente', variant: 'success' });
      }
      setShowEditModal(false);
    } catch (error) {
      console.error('Error saving user:', error);
      setAlert({ show: true, message: 'Error al guardar el usuario', variant: 'danger' });
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      // También eliminar estudiantes asociados si es un padre
      setStudents(students.filter(s => s.parentId !== userId));
      setShowDeleteModal(false);
      setAlert({ show: true, message: 'Usuario eliminado correctamente', variant: 'danger' });
    } catch (error) {
      console.error('Error deleting user:', error);
      setAlert({ show: true, message: 'Error al eliminar el usuario', variant: 'danger' });
    }
  };

  const handleAssignStudent = async (studentData) => {
    try {
      let response;
      if (studentData._id) {
        // Editar estudiante existente
        response = await api.put(`/students/${studentData._id}`, studentData);
        setStudents(students.map(s => s._id === studentData._id ? response.data : s));
      } else {
        // Crear nuevo estudiante
        response = await api.post('/students', studentData);
        setStudents([...students, response.data]);
      }
      setShowAssignModal(false);
      setAlert({ show: true, message: 'Estudiante asignado/actualizado', variant: 'success' });
    } catch (error) {
      console.error('Error assigning student:', error);
      setAlert({ show: true, message: 'Error al asignar estudiante', variant: 'danger' });
    }
  };

  const getUserStudents = (userId) => {
    return students.filter(s => s.parentId === userId);
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="user-management">
      <h2>Gestión de Usuarios</h2>
      
      {alert.show && (
        <Alert 
          variant={alert.variant} 
          onClose={() => setAlert({...alert, show: false})} 
          dismissible
          className="mt-3"
        >
          {alert.message}
        </Alert>
      )}

      <div className="d-flex justify-content-between mb-3">
        <Button 
          variant="primary" 
          onClick={() => {
            setSelectedUser(null);
            setShowEditModal(true);
          }}
        >
          Agregar Usuario
        </Button>
      </div>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Teléfono</th>
            <th>Estudiantes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <React.Fragment key={user._id}>
              <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Badge bg={user.role === 'admin' ? 'primary' : 'success'}>
                    {user.role === 'admin' ? 'Administrador' : 'Padre/Madre'}
                  </Badge>
                </td>
                <td>{user.phone || 'No especificado'}</td>
                <td>
                  {getUserStudents(user._id).length > 0 ? (
                    <ul>
                      {getUserStudents(user._id).map(student => (
                        <li key={student._id}>
                          {student.name} ({student.grade})
                        </li>
                      ))}
                    </ul>
                  ) : 'Sin estudiantes'}
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="info" 
                      size="sm" 
                      onClick={() => {
                        setSelectedUser(user);
                        setShowEditModal(true);
                      }}
                    >
                      Editar
                    </Button>
                    {user.role === 'parent' && (
                      <Button 
                        variant="warning" 
                        size="sm" 
                        onClick={() => {
                          setSelectedUser(user);
                          setShowAssignModal(true);
                        }}
                      >
                        {getUserStudents(user._id).length > 0 ? 'Administrar' : 'Asignar'} Estudiante
                      </Button>
                    )}
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteModal(true);
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </Table>

      {/* Modales */}
      <EditUserModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />

      <AssignStudentModal
        show={showAssignModal}
        onHide={() => setShowAssignModal(false)}
        parent={selectedUser}
        students={getUserStudents(selectedUser?._id)}
        onSave={handleAssignStudent}
      />

      <DeleteAccountModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onDelete={() => handleDeleteUser(selectedUser._id)}
        userType={selectedUser?.role === 'parent' ? 'parent' : 'admin'}
        additionalWarning={selectedUser?.role === 'parent' && getUserStudents(selectedUser._id).length > 0 
          ? 'Esto afectará a los estudiantes asociados.' 
          : ''}
      />
    </div>
  );
};

export default UserManagement;