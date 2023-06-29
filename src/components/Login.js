import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Toast from 'react-bootstrap/Toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('userData');

    if (userData) {
      // User data exists, navigate to dashboard
      navigate('/dashboard');
    } else {
      // User data doesn't exist, navigate to login/register
      navigate('/');
    }
  }, [navigate]);
  const handleLogin = (e) => {
    e.preventDefault();

    // Create an object with the login credentials
    const credentials = {
      email,
      password,
    };

    // Make the API call to validate the user's credentials
    fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data
        if (data.user && data.token) {
          // Login successful
          setToastVariant('success');
          setToastMessage('Login successful');
          setShowToast(true);

          // Store user data in local storage
          localStorage.setItem('userData', JSON.stringify(data));

          navigate('/dashboard', { state: { userName: data.user.name, userId: data.user.id } });
        } else {
          // Login failed
          setToastVariant('danger');
          setToastMessage('Login failed');
          setShowToast(true);
        }
      })
      .catch((error) => {
        // Error occurred during API call
        setToastVariant('danger');
        setToastMessage('An error occurred during login');
        setShowToast(true);
        console.error('An error occurred during login:', error);
      });
  };

  return (
    <div className="m-5">
      <h1>Login Page</h1>
      <Form className="col-sm-6 offset-sm-3">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleLogin}>
          Submit
        </Button>
        <p className="mt-3">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </Form>

      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        className={`position-fixed top-0 end-0 p-3 bg-${toastVariant}`}
      >
        <Toast.Header closeButton={false}>
          <strong className="me-auto">Registration Status</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </div>
  );
};

export default Login;
