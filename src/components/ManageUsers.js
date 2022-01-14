import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Popup from 'reactjs-popup';
import { Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { setUsers } from '../slices/appSlice';
import { useSelector } from 'react-redux';

const ManageUsers = () => {

  const users = useSelector(state => state.app.users);

  const dispatch = useDispatch();
  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await axios.get(`${process.env.REACT_APP_DEU_EVENT_SERVER}users`);
        dispatch(setUsers(result.data));
      } catch {
  
      }
    }
    fetch();
  }, []);


  const onChange = (email, validation) => async (e) => {

    const checked = e.target.checked;

    try {
      await axios.post(`${process.env.REACT_APP_DEU_EVENT_SERVER}users/validation`, {
        email,
        validation: checked
      });

      const newUsers = users.map(user => {
        if (user.email === email) {
          return {...user, validation: !user.validation}
        }
        return user;
      })
      dispatch(setUsers(newUsers));
    } catch {

    }
  }

  return (
    <Popup trigger={<Button variant="secondary">Manage Users</Button>} modal>
      {close => (
       <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Is Verified</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><input type="checkbox" checked={user.validation} onChange={onChange(user.email, user.validation)} /></td>
              </tr>
            ))}
            
          </tbody>
        </Table>
      )}
    </Popup>
  )
}

export default ManageUsers;