import React from 'react'
import { Navigate } from 'react-router-dom';
import { UserAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, authenticating } = UserAuth();

    if (authenticating) {
        return <div>Loading...</div>;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoute