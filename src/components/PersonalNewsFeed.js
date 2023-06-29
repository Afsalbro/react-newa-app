import React, { useState } from 'react';
import { Form, Button, Toast } from 'react-bootstrap';
// import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const PersonalNewsFeed = () => {
    const [selectedSource, setSelectedSource] = useState('');
    const [selectedCategories, setSelectedCategories] = useState('');
    const [selectedAuthors, setSelectedAuthors] = useState('');
    const [newsTitle, setNewsTitle] = useState('');
    const [newsDescription, setNewsDescription] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastVariant, setToastVariant] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('userData');

        if (userData) {
            // User data exists, navigate to dashboard
            navigate('/personal-news-feed');
        } else {
            // User data doesn't exist, navigate to login/register
            navigate('/');
        }
    }, [navigate]);

    const handleSourceChange = (event) => {
        setSelectedSource(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategories(event.target.value);
    };

    const handleAuthorChange = (event) => {
        setSelectedAuthors(event.target.value);
    };

    const handleTitleChange = (event) => {
        setNewsTitle(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setNewsDescription(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = {
            selected_source: selectedSource,
            selected_categories: selectedCategories,
            selected_authors: selectedAuthors,
            news_title: newsTitle,
            news_description: newsDescription,
        };

        let userData = localStorage.getItem('userData');
        if (userData) {
            userData = JSON.parse(userData);
            // console.warn(userData.token);
        }
        fetch('http://localhost:8000/api/news-preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://localhost:3000',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Credentials': 'true',
                'Authorization': `Bearer ${userData.token}`
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                setToastVariant('success');
                setToastMessage('News preference saved successfully');
                console.log('Response:', data);
                navigate('/dashboard');
                setShowToast(true);

            })
            .catch((error) => {
                console.error('Error:', error);
                setToastVariant('danger');
                setToastMessage('News preference not saved successfully');
                setShowToast(true);
            });
    };



    return (
        <div className="m-5">
            <h1>Personal News Feed</h1>
            <Form onSubmit={handleSubmit} className="col-sm-6 offset-sm-3">
                <Form.Group>
                    <Form.Label>Enter the News Title:</Form.Label>
                    <Form.Control
                        type="text"
                        value={newsTitle}
                        onChange={handleTitleChange}
                        placeholder="Enter news title"
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Enter the News Description:</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={newsDescription}
                        onChange={handleDescriptionChange}
                        placeholder="Enter news description"
                    />
                </Form.Group>

                <Form.Group className="m-1">
                    <Form.Label>Select Preferred Source:</Form.Label>
                    <Form.Select value={selectedSource} onChange={handleSourceChange}>
                        <option value="">Select a source</option>
                        <option value="guardian">The Guardian</option>
                        <option value="nytimes">New York Times</option>
                        <option value="newsapi">NewsAPI</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Enter the Category:</Form.Label>
                    <Form.Control
                        type="text"
                        value={selectedCategories}
                        onChange={handleCategoryChange}
                        placeholder="Enter preferred categories"
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Enter the Author:</Form.Label>
                    <Form.Control
                        type="text"
                        value={selectedAuthors}
                        onChange={handleAuthorChange}
                        placeholder="Enter preferred authors"
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="m-1">
                    Save Preferences
                </Button>
            </Form>

            <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide className={`position-absolute top-0 end-0 ${toastVariant === 'success' ? 'bg-success' : 'bg-danger'}`}>
                <Toast.Header closeButton>
                    <strong className="me-auto">{toastVariant === 'success' ? 'Success' : 'Error'}</strong>
                </Toast.Header>
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </div>
    );
};

export default PersonalNewsFeed;
