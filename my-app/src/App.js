import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/login/Login';
import Listing from './pages/listing/Listing';
import Adding from './pages/adding/Adding';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Listing />} />
        <Route path="/login" element={<Login />} />
        <Route path='/list' element={<Listing />} />
        <Route path='/add' element={<Adding />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
