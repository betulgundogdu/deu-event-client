/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Popup from 'reactjs-popup';
import { Button, Form } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import axios from 'axios';
import { validateEmail } from '../utils/email';
import { setUser } from '../slices/appSlice';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSignupClick = async () => {
    if (!name || !email || !password) {
      NotificationManager.error('All fields are required!');
    }

    if (!validateEmail(email)) {
      NotificationManager.error('Please enter a valid email!');
    }

    try {
      const result = await axios.post(`${process.env.REACT_APP_DEU_EVENT_SERVER}users`, {
        name,
        email,
        password,
        validation: false
      });

      dispatch(setUser(result.data));

    } catch (e) {
      console.log(e);
    }
  
  }

  return (
    <Popup trigger={<Button variant="primary">Sign up</Button>} modal>
      {close => (
        <div>
          <h1 className="popup-title">Sign Up</h1>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Name</Form.Label>
            <Form.Control value={name} onChange={(e) => setName(e.target.value)} type="name" placeholder="Enter name" />
          </Form.Group>

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
          <Button variant="primary" onClick={handleSignupClick} type="submit">
            sign up
          </Button>
          <a href="#" className="close" onClick={close}>
            &times;
          </a>
        </div>
      )}
    </Popup>
  )
}

export default Signup;
