import { Navigate, useLocation } from 'react-router-dom';
import { Session } from './SessionState';

export default function RequireAuth({children}){
    const user = Session.currentUser;
    const loc = useLocation();
    if(!user) return <Navigate to="/login" state={{ from: loc }} />;
    return children;
}