import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Popup from 'reactjs-popup';
import { Button, Form, Table } from 'react-bootstrap';
import axios from 'axios';
import { setUsers } from '../slices/appSlice';
import { useSelector } from 'react-redux';

const ManageUsers = () => {

  const users = useSelector(state => state.app.users);

  const dispatch = useDispatch();
  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await axios.get(`${process.env.REACT_APP_DEU_EVENT_SERVER}/users`);
        dispatch(setUsers(result.data));
      } catch {
  
      }
    }
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const onChange = (email, is_organizer) => async (e) => {

    const checked = e.target.checked;

    try {
      await axios.post(`${process.env.REACT_APP_DEU_EVENT_SERVER}/users/validation`, {
        email,
        is_organizer: checked
      });

      const newUsers = users.map(user => {
        if (user.email === email) {
          return {...user, is_organizer: !user.is_organizer}
        }
        return user;
      })
      dispatch(setUsers(newUsers));
    } catch {

    }
  }

  const removeUser = (id) => async (e) => {

    try {
      await axios.delete(`${process.env.REACT_APP_DEU_EVENT_SERVER}/users/${id}`, {
        id
      });
      dispatch(setUsers(users.filter(user => user._id !== id)));
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
              <th>Is organizer?</th>
              <th>Remove User</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><input type="checkbox" checked={user.is_organizer} onChange={onChange(user.email, user.is_organizer)} /></td>
                <td>
                  
                <Popup trigger={<Button variant="danger" onClick={removeUser(user._id)}>Delete</Button>} modal>
                    {close => (
                      <div>
                        <h1 className="popup-title">Login</h1>
                          <Form.Group className="mb-3">
                            <Form.Text className="text-muted">
                              Are you sure?
                            </Form.Text>  
                            <br />               
                            <Button  className="button" variant="danger" onClick={removeUser(user._id)} type="submit">
                              Yes
                            </Button>
                            <Button  className="button" variant="secondary" onClick={close} type="submit">
                              No
                            </Button>
                          </Form.Group>
                      </div>
                    )}
                  </Popup>
                  </td>
              </tr>
            ))}
            
          </tbody>
        </Table>
      )}
    </Popup>
  )
}

export default ManageUsers;
