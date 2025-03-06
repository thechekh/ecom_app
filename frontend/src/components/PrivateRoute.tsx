import React, { memo } from 'react';
import { Navigate, useLocation, Route } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';

interface PrivateRouteProps {
    children: React.ReactNode;
}

export const PrivateRoute = memo(({ children }: PrivateRouteProps) => {
    const { user } = useAppSelector(state => state.auth);
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
});

interface ProtectedRouteConfig {
    path: string;
    element: JSX.Element;
}

export const createProtectedRoutes = (routes: ProtectedRouteConfig[]) => (
    routes.map(({ path, element }) => (
        <Route
            key={path}
            path={path}
            element={<PrivateRoute>{element}</PrivateRoute>}
        />
    ))
);

export default PrivateRoute; 