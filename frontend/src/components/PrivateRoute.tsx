import { ReactNode } from 'react';
import { Navigate, useLocation, Route, RouteProps } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';

interface PrivateRouteProps {
    children: ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { user } = useAppSelector(state => state.auth);
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

interface ProtectedRouteConfig {
    path: string;
    element: JSX.Element;
}

export const createProtectedRoutes = (routes: ProtectedRouteConfig[]) => {
    return routes.map(({ path, element }) => (
        <Route
            key={path}
            path={path}
            element={<PrivateRoute>{element}</PrivateRoute>}
        />
    ));
};

export default PrivateRoute; 