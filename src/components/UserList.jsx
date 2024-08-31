import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import UserForm from './UserForm';
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import "./UserList.css"
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const perPage = 5;
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * perPage;
  const lastIndex = startIndex + perPage;  
  const totalPage = Math.ceil(users.length / perPage);
  const pageChange = (directionOrPageNumber) => {
    
    if (directionOrPageNumber === "previous page" && page > 1) {
      setPage((prev) => prev - 1);
    } else if (directionOrPageNumber === "next page" && page < totalPage) {
      setPage((prev) => prev + 1);
    } 
  };
  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
    } catch (err) {
      enqueueSnackbar('Failed to fetch users', { variant: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      let res =  await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      console.log(res.status)
      setUsers(users.filter(user => user.id !== id));
      enqueueSnackbar('User deleted successfully', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Failed to delete user', { variant: 'error' });
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
  };

  const handleAdd = () => {
    setSelectedUser(null);
  };

  return (
    <div>
      <table border="1" cellPadding="10" cellSpacing="0" className='table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.slice(startIndex,lastIndex).map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name.split(' ')[0]}</td>
              <td>{user.name.split(' ')[1]}</td>
              <td>{user.email}</td>
              <td>{user.company.name}</td>
              <td>
                <button onClick={() => handleEdit(user)}><FaRegEdit/></button>
                <button onClick={() => handleDelete(user.id)}><MdDelete/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='page'>
      
      <button className="previous-page" onClick={() => pageChange("previous page")}>Previous</button>
      <button className="next-page" onClick={() => pageChange("next page")}>Next</button>
      </div>
      <div style={{display:"flex",justifyContent:"flex-end",marginTop:"-5%", marginLeft:"20px"}}>
      <button className="addUser" onClick={handleAdd}>Add User</button>
      </div>
      
      <div className='userForm'>
      <UserForm
        selectedUser={selectedUser}
        onSave={() => fetchUsers()}
      />
      </div>
    </div>
  );
};

export default UserList;