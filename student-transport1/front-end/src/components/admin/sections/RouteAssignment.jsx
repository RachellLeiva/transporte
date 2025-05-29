import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Form } from 'react-bootstrap';
import CreateRouteModal from '../modals/CreateRouteModal';

const RouteAssignment = () => {
  const [routes, setRoutes] = useState([]);
  const [students, setStudents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    // Datos de ejemplo
    const mockRoutes = [
      {
        id: 1,
        name: "Ruta Norte",
        stops: [
          { time: "07:00 AM", location: "Av. Principal 123" },
          { time: "07:15 AM", location: "Calle Secundaria 456" }
        ],
        students: [
          { id: 101, name: "María Pérez", serviceType: "both" }
        ]
      }
    ];
    
    const mockStudents = [
      { id: 101, name: "María Pérez", grade: "5to", parent: "Juan Pérez", serviceType: "both" },
      { id: 102, name: "Carlos López", grade: "3ro", parent: "Ana López", serviceType: "pickup" }
    ];
    
    setRoutes(mockRoutes);
    setStudents(mockStudents.filter(s => !mockRoutes.some(r => 
      r.students.some(rs => rs.id === s.id)
    )));
  }, []);

  return (
    <div className="route-management">
      <div className="d-flex justify-content-between mb-4">
        <h2>Asignación de Rutas</h2>
        <Button onClick={() => setShowCreateModal(true)}>
          Crear Nueva Ruta
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre Ruta</th>
            <th>Paradas</th>
            <th>Estudiantes</th>
            <th>Tipo Servicio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {routes.map(route => (
            <tr key={route.id}>
              <td>{route.name}</td>
              <td>
                <ul>
                  {route.stops.map((stop, i) => (
                    <li key={i}>{stop.time} - {stop.location}</li>
                  ))}
                </ul>
              </td>
              <td>
                {route.students.length > 0 ? (
                  <ul>
                    {route.students.map(student => (
                      <li key={student.id}>
                        {student.name} ({student.serviceType === 'both' ? 'Ambos' : 
                                       student.serviceType === 'pickup' ? 'Recogida' : 'Dejada'})
                      </li>
                    ))}
                  </ul>
                ) : 'Ninguno asignado'}
              </td>
              <td>
                {[...new Set(route.students.map(s => s.serviceType))].join(', ')}
              </td>
              <td>
                <Button size="sm">Editar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h4 className="mt-5">Estudiantes sin ruta asignada</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Grado</th>
            <th>Padre/Madre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.grade}</td>
              <td>{student.parent}</td>
              <td>
                <Button size="sm" variant="success">
                  Asignar a ruta
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <CreateRouteModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onCreate={(newRoute) => {
          setRoutes([...routes, newRoute]);
        }}
      />
    </div>
  );
};

export default RouteAssignment;