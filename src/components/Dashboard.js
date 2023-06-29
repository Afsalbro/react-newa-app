import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

const Dashboard = () => {
    const location = useLocation();
    const { userId } = location.state || {};

    const [newsData, setNewsData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [userName, setUserName] = useState('');
    const [personalNewsFeed, setPersonalNewsFeed] = useState(null);
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
    
    useEffect(() => {
        const userData = localStorage.getItem('userData');

        if (userData) {
            const parsedData = JSON.parse(userData);
            setUserName(parsedData.user.name);
        }
    }, []);

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const keywords = formData.get('keywords');

        try {
            setLoading(true);
            setSearching(true);

            const url = new URL('http://localhost:8000/api/news', window.location.origin);
            url.searchParams.append('q', keywords);
            console.warn(url.href);
            const response = await fetch(url.href, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.warn(data);
                setNewsData(data);
            } else {
                console.error('Failed to fetch news data');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
            setSearching(false);
        }
    };

    const handlePersonalFeedClick = () => {
        // Navigate to the Personal News Feed component
        // You can implement your preferred navigation method here
        // For example, using react-router-dom's history object:
        navigate('/personal-news-feed');
    };

    const handleChangePasswordClick = () => {
        // Navigate to the Change Password component
        // Pass the userName and userId in the state object
        navigate('/changepassword', { state: { userName, userId } });
    };

    let userData = localStorage.getItem('userData');
    if (userData) {
        userData = JSON.parse(userData);
        //   console.warn(userData.token);
    }
    const handleLogoutClick = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                },
            });

            if (response.ok) {

                localStorage.removeItem('userData');
                navigate('/');
            } else {
                console.error('Failed to logout');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const fetchPersonalNewsFeed = async () => {
            try {
                // setLoading(true);

                let userData = localStorage.getItem('userData');
                if (userData) {
                    userData = JSON.parse(userData);
                    // console.warn(userData.token);
                    const response = await fetch('http://localhost:8000/api/news-preferences', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${userData.token}`
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        // console.warn(data.newsPreferences);
                        setPersonalNewsFeed(data.newsPreferences);
                    } else {
                        console.error('Failed to fetch personal news feed');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                // setLoading(false);
            }
        };

        // Call the API initially
        fetchPersonalNewsFeed();

        // Call the API every 5 seconds
        const interval = setInterval(fetchPersonalNewsFeed, 5000);

        // Clean up the interval when the component is unmounted
        return () => {
            clearInterval(interval);
        };
    }, []);


    return (
        <>
            <Navbar className="bg-dark" variant="dark">
                <Container>
                    <Navbar.Brand>News App</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            Signed in as:{' '}
                            {userName !== '' ? (
                                <Dropdown>
                                    <Dropdown.Toggle variant="link">{userName}</Dropdown.Toggle>
                                    <Dropdown.Menu variant="dark">
                                        <Dropdown.Item onClick={handleChangePasswordClick}>Change Password</Dropdown.Item>
                                        <Dropdown.Item onClick={handleLogoutClick}>Logout</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                'Unknown User'
                            )}
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Form className="col-sm-6 offset-sm-3 p-5" onSubmit={handleFormSubmit}>
                <Form.Label>Search the News using Keyword</Form.Label>
                <Form.Control type="text" name="keywords" />
                <Button className="m-2" variant="primary" type="submit">
                    Submit
                </Button>
                <Button variant="success" onClick={handlePersonalFeedClick}>
                    Create Personal News Feed
                </Button>
            </Form>
            <h1>Your Personal News Feed</h1>
            <br />
            <br />
            {Array.isArray(personalNewsFeed) && personalNewsFeed.length > 0 ? (
                <>
                    <Row className="col-sm-10 offset-sm-1 justify-content-center align-items-center">
                        {personalNewsFeed.map((article, index) => (
                            <Col key={`personal-${index}`} sm={4} className="mb-4">
                                <Card style={{ width: '18rem' }}>
                                    <Card.Body>
                                        <Card.Title>{article.news_title}</Card.Title>
                                        <Card.Text>{article.news_description}</Card.Text>
                                        <Card.Text>
                                            <b>Source:</b> {article.selected_source}
                                        </Card.Text>
                                        <Card.Text>
                                            <b>Date:</b> {article.created_at}
                                        </Card.Text>
                                        {/* <Button variant="primary" href={article.url}>
                  Read More
                </Button> */}
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            ) : (
                <div className="col-sm-10 offset-sm-1 text-center">
                    <p>No Personal News Feed</p>
                </div>
            )}

            {searching && (
                <div className="text-center mt-3">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Searching...</span>
                    </Spinner>
                    <p className="mt-2">Searching...</p>
                </div>
            )}
            {!searching && (
                <>
                    {loading ? (
                        <div className="text-center mt-5">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : (

                        newsData && (
                            <>
                                <h1>Search Results</h1>
                                <br />
                                <br />
                                <Row className="col-sm-10 offset-sm-1 justify-content-center align-items-center">
                                    {newsData.guardianapi?.response?.results &&
                                        newsData.guardianapi.response.results.map((article, index) => (
                                            <Col key={`guardian-${index}`} sm={4} className="mb-4">
                                                <Card style={{ width: '18rem' }}>
                                                    <Card.Body>
                                                        <Card.Title>{article.webTitle}</Card.Title>
                                                        <Card.Text>
                                                            <b>Source:</b> The Guardian
                                                        </Card.Text>
                                                        <Card.Text>
                                                            <b>Category:</b> {article.sectionName}
                                                        </Card.Text>
                                                        <Card.Text>
                                                            <b>Date:</b> {article.webPublicationDate}
                                                        </Card.Text>
                                                        <Button variant="primary" href={article.apiUrl}>
                                                            Read More
                                                        </Button>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                </Row>

                                <Row className="col-sm-10 offset-sm-1 justify-content-center align-items-center">
                                    {newsData.newsapi?.articles &&
                                        newsData.newsapi.articles.map((article, index) => (
                                            <Col key={`newsapi-${index}`} sm={4} className="mb-4">
                                                <Card style={{ width: '18rem' }}>
                                                    <Card.Img variant="top" src={article.urlToImage} />
                                                    <Card.Body>
                                                        <Card.Title>{article.title}</Card.Title>
                                                        <Card.Text>{article.description}</Card.Text>
                                                        <Card.Text>
                                                            <b>Source:</b> {article.source.name}
                                                        </Card.Text>
                                                        <Card.Text>
                                                            <b>Author:</b> {article.author}
                                                        </Card.Text>
                                                        <Card.Text>
                                                            <b>Date:</b> {article.publishedAt}
                                                        </Card.Text>
                                                        <Button variant="primary" href={article.url}>
                                                            Read More
                                                        </Button>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                </Row>

                                <Row className="col-sm-10 offset-sm-1 justify-content-center align-items-center">
                                    {newsData.nytimes?.response &&
                                        newsData.nytimes.response.docs.map((article, index) => (
                                            <Col key={`nytimes-${index}`} sm={4} className="mb-4">
                                                <Card style={{ width: '18rem' }}>
                                                    <Card.Body>
                                                        <Card.Title>{article.headline.main}</Card.Title>
                                                        <Card.Text>{article.abstract}</Card.Text>
                                                        <Card.Text>
                                                            <b>Category:</b> {article.subsection_name}
                                                        </Card.Text>
                                                        <Card.Text>
                                                            <b>Source:</b> {article.source}
                                                        </Card.Text>
                                                        <Card.Text>
                                                            <b>Date:</b> {article.pub_date}
                                                        </Card.Text>
                                                        <Button variant="primary" href={article.web_url}>
                                                            Read More
                                                        </Button>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                </Row>
                            </>
                        )
                    )}
                </>
            )}
        </>
    );
};

export default Dashboard;
