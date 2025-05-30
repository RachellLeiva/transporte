import React, { useState, useEffect } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

const EditUserModal = ({ show, onHide, user, onSave }) => {
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    role: 'parent',
    serviceType: 'both',
    amount: 0
  })

  useEffect(() => {
    if (user) {
      setFormData({
        phone:        user.phone        || '',
        address:      user.address      || '',
        role:         user.role         || 'parent',
        serviceType:  user.serviceType  || 'both',
        amount:       user.amount ?? 0
      })
    }
  }, [user])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(fd => ({ ...fd, [name]: value }))
  }

  const handleSubmit = () => {
    onSave({
      _id:         user._id,
      phone:       formData.phone,
      address:     formData.address,
      role:        formData.role,
      serviceType: formData.serviceType,
      amount:      Number(formData.amount)
    })
    onHide()
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rol</Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="parent">Padre/Madre</option>
              <option value="admin">Administrador</option>
              <option value="finance">Finanzas</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tipo de servicio</Form.Label>
            <Form.Select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
            >
              <option value="both">Ida y vuelta</option>
              <option value="pickup">Solo ida</option>
              <option value="dropoff">Solo vuelta</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Monto</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditUserModal
