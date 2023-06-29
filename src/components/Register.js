import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import { Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('success');

    const handleRegistration = (e) => {
        e.preventDefault();

        // Create a user object with the provided registration data
        const user = {
            name,
            email,
            password,
        };

        // Make the API call to register the user
        fetch('http://localhost:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(user),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    // Display success message using Toast
                    setShowToast(true);
                    setToastVariant('success');
                    setToastMessage('Registration successful now you can login!');
                } else if (data.error && data.error.email) {
                    // Display specific error message for email validation
                    setShowToast(true);
                    setToastVariant('danger');
                    setToastMessage(data.error.email[0]);
                } else {
                    // Display generic error message
                    setShowToast(true);
                    setToastVariant('danger');
                    setToastMessage('An error occurred during registration.');
                }
            })
            .catch((error) => {
                // Display error message using Toast
                setShowToast(true);
                setToastVariant('danger');
                setToastMessage('An error occurred during registration.');
                console.error(error);
            });
    };

    return (
        <div className="m-5">
            <h1>Register Page</h1>
            <Form className="col-sm-6 offset-sm-3">
                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Control
                        type="text"
                        placeholder="Enter the name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>
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
                <Button variant="primary" type="submit" onClick={handleRegistration}>
                    Submit
                </Button>
                <p className="mt-3">
                    Already have an account? <Link to="/">Login</Link>
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

export default Register;
