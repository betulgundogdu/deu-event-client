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

  const handleLoginClick = async () => {
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

      dispatch(setUser(result.data));

    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Popup trigger={<Button variant="secondary">Login</Button>} modal>
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
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Check me out" />
            </Form.Group>
            <Button variant="primary" onClick={handleLoginClick} type="submit">
              login
            </Button>
          <a href="#" className="close">
            &times;
          </a>
        </div>
      )}
    </Popup>
  )
}

export default Login;
