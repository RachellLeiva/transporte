// src/components/admin/sections/RouteAssignment.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import CreateRouteModal from '../modals/CreateRouteModal';
import { api } from '../../../api';

const RouteAssignment = () => {
  const [routes, setRoutes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);

  // Carga inicial de rutas
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/routes');
        setRoutes(data);
      } catch (err) {
        console.error('Error cargando rutas:', err);
      }
    })();
  }, []);

  // Crear o actualizar ruta
  const handleSaveRoute = async (routeData) => {
    try {
      if (routeData._id) {
        const { data: updated } = await api.put(`/routes/${routeData._id}`, routeData);
        setRoutes(routes.map(r => r._id === updated._id ? updated : r));
      } else {
        const { data: created } = await api.post('/routes', routeData);
        setRoutes([created, ...routes]);
      }
    } catch (err) {
      console.error('Error guardando ruta:', err);
      alert(err.response?.data?.msg || 'Error guardando ruta');
    }
  };

  // Eliminar ruta
  const handleDeleteRoute = async (id) => {
    if (!window.confirm('¿Eliminar esta ruta permanentemente?')) return;
    try {
      await api.delete(`/routes/${id}`);
      setRoutes(routes.filter(r => r._id !== id));
    } catch (err) {
      console.error('Error eliminando ruta:', err);
      alert(err.response?.data?.msg || 'Error eliminando ruta');
    }
  };

  const openNew = () => {
    setEditingRoute(null);
    setShowModal(true);
  };
  const openEdit = (route) => {
    setEditingRoute(route);
    setShowModal(true);
  };

  return (
    <div className="route-management p-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>Asignación de Rutas</h2>
        <Button onClick={openNew}>Crear Nueva Ruta</Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre Ruta</th>
            <th>Paradas</th>
            <th>Estudiantes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {routes.map(route => (
            <tr key={route._id}>
              <td>{route.name}</td>
              <td>
                <ul className="ps-3">
                  {route.stops.map((stop, i) => (
                    <li key={i}>
                      {stop.time} – {stop.address}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <ul className="ps-3">
                  {route.stops.map((stop, i) => (
                    <li key={i}>
                      {stop.student.name}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <Button size="sm" onClick={() => openEdit(route)}>
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteRoute(route._id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <CreateRouteModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSaveRoute}
        route={editingRoute}
      />
    </div>
  );
};

export default RouteAssignment;
