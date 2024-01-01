import React, { lazy } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserAuth } from './components/hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';

const ManageInfo = lazy(() => import("./pages/manageInfo/ManageInfo"));
const Home = lazy(() => import("./pages/home/Home"));
const Login = lazy(() => import("./pages/login/Login"));


function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/' element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Home />
              </ProtectedRoute>
            }
            />
            <Route path='/manageinfo' element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <ManageInfo />
              </ProtectedRoute>
            } />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
