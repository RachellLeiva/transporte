import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Alert } from 'react-bootstrap';
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

  // Datos de ejemplo - en una app real estos vendrían de una API
  useEffect(() => {
    const mockUsers = [
      { 
        id: 1, 
        name: 'Admin Principal', 
        email: 'admin@escuela.com', 
        role: 'admin',
        phone: '',
        address: ''
      },
      { 
        id: 2, 
        name: 'Juan Pérez', 
        email: 'juan@email.com', 
        role: 'parent',
        phone: '555-1234',
        address: 'Calle 123, Colonia Centro'
      }
    ];

    const mockStudents = [
      {
        id: 101,
        name: 'María Pérez',
        grade: '5to grado',
        parentId: 2,
        parentName: 'Juan Pérez'
      }
    ];

    setUsers(mockUsers);
    setStudents(mockStudents);
  }, []);

  const handleSaveUser = (userData) => {
    if (userData.id) {
      // Editar usuario existente
      setUsers(users.map(u => u.id === userData.id ? userData : u));
      setAlert({ show: true, message: 'Usuario actualizado correctamente', variant: 'success' });
    } else {
      // Agregar nuevo usuario
      const newUser = {
        ...userData,
        id: Date.now(), // ID temporal
        phone: '',
        address: ''
      };
      setUsers([...users, newUser]);
      setAlert({ show: true, message: 'Usuario creado correctamente', variant: 'success' });
    }
    setShowEditModal(false);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(u => u.id !== userId));
    // También eliminar estudiantes asociados si es un padre
    setStudents(students.filter(s => s.parentId !== userId));
    setShowDeleteModal(false);
    setAlert({ show: true, message: 'Usuario eliminado correctamente', variant: 'danger' });
  };

  const handleAssignStudent = (studentData) => {
    if (studentData.id) {
      // Editar estudiante existente
      setStudents(students.map(s => s.id === studentData.id ? studentData : s));
    } else {
      // Agregar nuevo estudiante
      const newStudent = {
        ...studentData,
        id: Date.now() // ID temporal
      };
      setStudents([...students, newStudent]);
    }
    setShowAssignModal(false);
    setAlert({ show: true, message: 'Estudiante asignado/actualizado', variant: 'success' });
  };

  const getUserStudents = (userId) => {
    return students.filter(s => s.parentId === userId);
  };

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
            <React.Fragment key={user.id}>
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
                  {getUserStudents(user.id).length > 0 ? (
                    <ul>
                      {getUserStudents(user.id).map(student => (
                        <li key={student.id}>
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
                        {getUserStudents(user.id).length > 0 ? 'Administrar' : 'Asignar'} Estudiante
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
        students={getUserStudents(selectedUser?.id)}
        onSave={handleAssignStudent}
      />

      <DeleteAccountModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onDelete={handleDeleteUser}
        userType={selectedUser?.role === 'parent' ? 'parent' : 'admin'}
        additionalWarning={selectedUser?.role === 'parent' && getUserStudents(selectedUser.id).length > 0 
          ? 'Esto afectará a los estudiantes asociados.' 
          : ''}
      />
    </div>
  );
};

export default UserManagement;