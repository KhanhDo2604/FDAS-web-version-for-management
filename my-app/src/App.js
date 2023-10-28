import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/login/Login';
import Listing from './pages/listing/Listing';
import Updating from './pages/updating/Updating';
import Adding from './pages/adding/Adding';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Listing />} />
        <Route path="/login" element={<Login />} />
        <Route path='/update' element={<Updating />} />
        <Route path='/add' element={<Adding />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
