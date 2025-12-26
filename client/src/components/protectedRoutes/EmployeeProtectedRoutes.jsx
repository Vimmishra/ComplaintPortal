import { useAuth } from '@/context/AuthContext'
import React from 'react'
import { Navigate } from 'react-router-dom';


const EmployeeProtectedRoutes = ({children}) => {


    const {user} = useAuth();

    if(!user){
        return <Navigate to="/" replace />
    }

    if(user.role !== "employee"){
      return <Navigate to="/" replace />
    }




  return children
  
}

export default EmployeeProtectedRoutes