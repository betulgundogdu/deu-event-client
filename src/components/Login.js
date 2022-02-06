/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Popup from 'reactjs-popup';
import { Button, Form } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import axios from 'axios';
import { validateEmail } from '../utils/email';
import { setUser } from '../slices/appSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLoginClick = (close) => async () => {
    if (!email || !password) {
      NotificationManager.error('All fields are required!');
    }

    if (!validateEmail(email)) {
      NotificationManager.error('Please enter a valid email!');
    }

    try {
      const result = await axios.post(`${process.env.REACT_APP_DEU_EVENT_SERVER}/users/login`, {
        email,
        password
      });

      if(result.data?.error || result.data?.success) {
        NotificationManager.error(result.data.message);
      } else {
        NotificationManager.success('Succesfully logged in!')
        dispatch(setUser(result.data));
      }
      close();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Popup trigger={<Button className="header-buttons">Login</Button>} modal>
      {close => (
        <div>
          <h1 className="popup-title">Login</h1>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter email" />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
            </Form.Group>
            <Button  className="button" variant="primary" onClick={handleLoginClick(close)} type="submit">
              login
            </Button>
        </div>
      )}
    </Popup>
  )
}

export default Login;
