import React, { useState } from 'react';
import { Form, Button, Toast } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ChangePassword = () => {
  const location = useLocation();
  const { state } = location;
  const { userName, userId } = state || {};

  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const navigate = useNavigate();
  
  useEffect(() => {
    const userData = localStorage.getItem('userData');

    if (userData) {
      // User data exists, navigate to dashboard
      navigate('/changepassword');
    } else {
      // User data doesn't exist, navigate to login/register
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const current_password = formData.get('current_password');
    const new_password = formData.get('new_password');

    const requestBody = {
      current_password,
      new_password,
    };

    let userData = localStorage.getItem('userData');
    if (userData) {
      userData = JSON.parse(userData);
      // console.warn(userData.token);
    }

    fetch('http://localhost:8000/api/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Accept': 'application/json',
        'Authorization': `Bearer ${userData.token}`
      },
      body: JSON.stringify(requestBody)
    })
      .then((response) => {
        console.log(response.headers);
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          // Handle validation errors
          console.log('Validation errors:', data.error);
          setToastVariant('danger');
          setToastMessage('Password change failed. Please check the entered information.');
        } else {
          // Password change successful
        //   console.log('Password changed successfully');
          setToastVariant('success');
          setToastMessage('Password changed successfully');
          // Perform any necessary actions after successful password change
          navigate('/dashboard'); // Navigate to /dashboard
        }
        setShowToast(true);
      })
      .catch((error) => {
        console.error('Error:', error); // Handle any errors that occurred during the request
        setToastVariant('danger');
        setToastMessage('An error occurred. Please try again later.');
        setShowToast(true);
      });
  };

  return (
    <>
      <Form className="col-sm-6 offset-sm-3 p-5" onSubmit={handleSubmit}>
        <Form.Label>
          <h1>Change Password</h1>
        </Form.Label>
        <Form.Control className="mb-3" type="password" name="current_password" placeholder="Current Password" required />
        <Form.Control className="mb-3" type="password" name="new_password" placeholder="New Password" required />
        <Button className="m-2" variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide className={`position-absolute top-0 end-0 ${toastVariant === 'success' ? 'bg-success' : 'bg-danger'}`}>
        <Toast.Header closeButton>
          <strong className="me-auto">{toastVariant === 'success' ? 'Success' : 'Error'}</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </>
  );
};

export default ChangePassword;
