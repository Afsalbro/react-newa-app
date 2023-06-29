import './App.css';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './components/Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ChangePassword from './components/ChangePassword';
import PersonalNewsFeed from './components/PersonalNewsFeed';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/changepassword" element={<ChangePassword/>} />
          <Route path="/personal-news-feed" element={<PersonalNewsFeed/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
