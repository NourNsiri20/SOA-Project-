import React, { useState, useEffect } from 'react';
import './App.css';
import { personService } from './services/personService';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import PersonTable from './components/PersonTable';
import EditModal from './components/EditModal';

function App() {
  const [persons, setPersons] = useState([]);
  const [status, setStatus] = useState({ message: 'Ready', isError: false });
  const [editingPerson, setEditingPerson] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormData, setAddFormData] = useState({ name: '', age: '' });
  const [addErrors, setAddErrors] = useState({});

  useEffect(() => {
    loadPersons();
  }, []);

  const updateStatus = (message, isError = false) => {
    setStatus({ message, isError });
  };

  const loadPersons = async () => {
    try {
      updateStatus('Loading…');
      const data = await personService.getAll();
      setPersons(data);
      updateStatus('Loaded');
    } catch (err) {
      updateStatus(err.message, true);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      updateStatus('Please enter a name or ID', true);
      return;
    }

    try {
      updateStatus('Searching…');
      if (!isNaN(query)) {
        const person = await personService.getById(Number(query));
        if (person) {
          setPersons([person]);
          updateStatus(`Found by ID: ${query}`);
        } else {
          setPersons([]);
          updateStatus(`No person found with ID: ${query}`);
        }
      } else {
        const results = await personService.searchByName(query);
        setPersons(results);
        if (results.length === 0) {
          updateStatus(`No results found for: "${query}"`);
        } else {
          updateStatus(`Found ${results.length} result(s) for: "${query}"`);
        }
      }
    } catch (err) {
      updateStatus(err.message, true);
      setPersons([]);
    }
  };

  const handleClearSearch = () => {
    loadPersons();
  };

  const handleAdd = async (person) => {
    try {
      await personService.create(person);
      updateStatus('Added person');
      loadPersons();
      setShowAddForm(false);
      setAddFormData({ name: '', age: '' });
      setAddErrors({});
      return true;
    } catch (err) {
      updateStatus(err.message, true);
      return false;
    }
  };

  const handleUpdate = async (id, person) => {
    try {
      await personService.update(id, person);
      updateStatus(`Updated #${id}`);
      loadPersons();
      setEditingPerson(null);
      setShowModal(false);
      return true;
    } catch (err) {
      updateStatus(err.message, true);
      return false;
    }
  };

  const handleEdit = (person) => {
    setEditingPerson(person);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete person #${id}? This cannot be undone.`)) {
      updateStatus('Deletion cancelled');
      return;
    }

    try {
      await personService.delete(id);
      updateStatus(`Deleted #${id}`);
      if (editingPerson && editingPerson.id === id) {
        setEditingPerson(null);
        setShowModal(false);
      }
      loadPersons();
    } catch (err) {
      updateStatus(err.message, true);
    }
  };

  const validateAddForm = () => {
    const newErrors = {};
    if (!addFormData.name || addFormData.name.trim().length < 2) {
      newErrors.name = 'Name must have at least 2 characters';
    }
    const age = Number(addFormData.age);
    if (!Number.isInteger(age) || age < 0) {
      newErrors.age = 'Age must be a non-negative integer';
    }
    setAddErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateAddForm()) return;
    const success = await handleAdd({
      name: addFormData.name.trim(),
      age: Number(addFormData.age)
    });
    if (success) {
      handleResetAddForm();
    }
  };

  const handleResetAddForm = () => {
    setAddFormData({ name: '', age: '' });
    setAddErrors({});
    setShowAddForm(false);
  };

  const handleAddChange = (e) => {
    setAddFormData({
      ...addFormData,
      [e.target.name]: e.target.value
    });
    if (addErrors[e.target.name]) {
      setAddErrors({
        ...addErrors,
        [e.target.name]: undefined
      });
    }
  };

  return (
    <div className="page">
      <Header status={status} />
      
      <SearchBar 
        onSearch={handleSearch}
        onClear={handleClearSearch}
      />

      <div className="page-content">
        {/* Table on the left */}
        <div>
          <PersonTable
            persons={persons}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefresh={loadPersons}
          />
        </div>

        {/* Add Person Card on the right */}
        <div>
          {!showAddForm && (
            <div className="card">
              <div className="card-head">
                <div>
                  <h2>Add New Person</h2>
                </div>
              </div>
              <button className="primary" style={{ width: '100%' }} onClick={() => setShowAddForm(true)}>+ Add Person</button>
            </div>
          )}

          {showAddForm && (
            <div className="card">
              <div className="card-head">
                <h2>New Person</h2>
              </div>
              <form className="form" onSubmit={handleAddSubmit}>
                <div className="field" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="add-name">Name</label>
                  <input
                    type="text"
                    id="add-name"
                    name="name"
                    value={addFormData.name}
                    onChange={handleAddChange}
                    required
                  />
                  {addErrors.name && <span style={{ color: '#dc2626', fontSize: '12px' }}>{addErrors.name}</span>}
                </div>
                <div className="field" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="add-age">Age</label>
                  <input
                    type="number"
                    id="add-age"
                    name="age"
                    value={addFormData.age}
                    onChange={handleAddChange}
                    required
                    min="0"
                  />
                  {addErrors.age && <span style={{ color: '#dc2626', fontSize: '12px' }}>{addErrors.age}</span>}
                </div>
                <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className="primary">Create</button>
                  <button type="button" className="ghost" onClick={handleResetAddForm}>Cancel</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <EditModal
        isOpen={showModal}
        editingPerson={editingPerson}
        onSave={handleUpdate}
        onClose={() => {
          setShowModal(false);
          setEditingPerson(null);
        }}
      />
    </div>
  );
}

export default App;
