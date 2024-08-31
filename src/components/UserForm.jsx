import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import './UserForm.css'; // Import the CSS file

const UserForm = ({ selectedUser, onSave }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const { enqueueSnackbar } = useSnackbar();
 const firstNameRef = useRef(null)
  useEffect(() => {
    if (selectedUser) {
      const [first, last] = selectedUser.name.split(' ');
      setFirstName(first);
      setLastName(last);
      setEmail(selectedUser.email);
      setDepartment(selectedUser.company.name);
    } else {
      resetForm();
    }
    if(firstNameRef.current){
      firstNameRef.current.focus();
    }
  }, [selectedUser]);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setDepartment('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      name: `${firstName} ${lastName}`,
      email,
      company: { name: department }
    };

    try {
      if (selectedUser) {
        await axios.put(`https://jsonplaceholder.typicode.com/users/${selectedUser.id}`, userData);
        enqueueSnackbar('User updated successfully', { variant: 'success' });
      } else {
        await axios.post('https://jsonplaceholder.typicode.com/users', userData);
        enqueueSnackbar('User added successfully', { variant: 'success' });
      }
      onSave();
      resetForm();
    } catch (err) {
      enqueueSnackbar('Failed to save user', { variant: 'error' });
    }
  };

  return (
    <div className="user-form-container">
      <h2>{selectedUser ? 'Edit User' : 'Add User'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="user-form-group">
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            ref={firstNameRef}
            required
          />
        </div>
        <div className="user-form-group">
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="user-form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="user-form-group">
          <label>Department:</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default UserForm;