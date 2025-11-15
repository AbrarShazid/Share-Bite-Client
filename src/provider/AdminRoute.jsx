import React ,{use} from 'react';
import { AuthContext } from './AuthContext';
import { Navigate, useLocation } from 'react-router';
import LoadingSpinner from '../Components/LoadingSpinner';
import useUserRole from '../hooks/useUserRole';

const AdminRoute = ({children}) => {

  const location = useLocation();
  const { user, loading } = use(AuthContext);

    const {role,isLoading}=useUserRole()

      if (loading || isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }
  if (!user) {
    return <Navigate  state={location.pathname} to="/login" />;
  }


  if (role==='admin'||role==='super-admin') {
    return children;
  }

  return <Navigate state={location.pathname} to={"/forbidden-access"}></Navigate>;
};

export default AdminRoute;