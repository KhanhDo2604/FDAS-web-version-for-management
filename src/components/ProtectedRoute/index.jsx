import React from 'react'
import { Navigate } from 'react-router-dom';
import { UserAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = UserAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;

}

export default ProtectedRoute