import React, { lazy } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const ManageInfo = lazy(() => import("./pages/manageInfo/ManageInfo"));
const Home = lazy(() => import("./pages/home/Home"));
const Login = lazy(() => import("./pages/login/Login"));

function App() {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/manageinfo' element={<ManageInfo />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default App;
