import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import Listing from './pages/listing/Listing';
import Adding from './pages/adding/Adding';
import Dashboard from './pages/dashboard/Dashboard';
import ManageInfo from './pages/manageInfo/ManageInfo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={<Listing />}
        />
        <Route
          path='/login'
          element={<Login />}
        />
        <Route
          path='/list'
          element={<Listing />}
        />
        <Route
          path='/add'
          element={<Adding />}
        />
        <Route
          path='/dashboard'
          element={<Dashboard />}
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
