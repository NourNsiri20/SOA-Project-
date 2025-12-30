import React, { useState, useEffect } from 'react';

function EditModal({ isOpen, editingPerson, onSave, onClose }) {
  const [formData, setFormData] = useState({ id: '', name: '', age: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingPerson) {
      setFormData({
        id: editingPerson.id,
        name: editingPerson.name,
        age: editingPerson.age
      });
      setErrors({});
    }
  }, [editingPerson, isOpen]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must have at least 2 characters';
    }
    
    const age = Number(formData.age);
    if (!Number.isInteger(age) || age < 0) {
      newErrors.age = 'Age must be a non-negative integer';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      id: editingPerson.id,
      name: formData.name.trim(),
      age: Number(formData.age)
    };

    await onSave(editingPerson.id, payload);
    handleClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: undefined
      });
    }
  };

  const handleClose = () => {
    setFormData({ id: '', name: '', age: '' });
    setErrors({});
    onClose();
  };

  if (!isOpen || !editingPerson) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`}>
      <div className="modal">
        <div className="modal-head">
          <h2>Edit Person</h2>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="modal-id">ID</label>
            <input
              type="number"
              id="modal-id"
              name="id"
              value={formData.id}
              disabled
              style={{ opacity: 0.6 }}
            />
          </div>
          <div className="field">
            <label htmlFor="modal-name">Name</label>
            <input
              type="text"
              id="modal-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <span style={{ color: '#dc2626', fontSize: '12px' }}>{errors.name}</span>}
          </div>
          <div className="field">
            <label htmlFor="modal-age">Age</label>
            <input
              type="number"
              id="modal-age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="0"
            />
            {errors.age && <span style={{ color: '#dc2626', fontSize: '12px' }}>{errors.age}</span>}
          </div>
          <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="primary">Save Changes</button>
            <button type="button" className="ghost" onClick={handleClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
