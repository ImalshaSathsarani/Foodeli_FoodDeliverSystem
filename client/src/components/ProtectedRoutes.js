import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({children, requiredRole}) =>{
    const { currentUser } = useSelector((state)=>state.user);

    if(!currentUser) {
        return <Navigate to="/" replace/>;
    }

    if(requiredRole && currentUser.role !== requiredRole){
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;