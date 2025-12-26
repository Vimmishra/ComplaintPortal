import { useAuth } from '@/context/AuthContext'
import React from 'react'
import { Navigate } from 'react-router-dom';


const OfficerProtectedRoute = ({children}) => {

    const {user} = useAuth();
    

    if(!user){
       return <Navigate to="/" replace />
    }

    if(user.role !== "officer"){
        return <Navigate to="/" replace />
    }

  return children
}

export default OfficerProtectedRoute