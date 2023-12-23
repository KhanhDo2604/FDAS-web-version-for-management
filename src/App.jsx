import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import ManageInfo from './pages/manageInfo/ManageInfo';
import Home from './pages/home/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={<Home />}
        />
        <Route
          path='/login'
          element={<Login />}
        />
        <Route
          path='/manageinfo'
          element={<ManageInfo />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;