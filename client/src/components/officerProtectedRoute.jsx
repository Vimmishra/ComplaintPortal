import { useAuth } from '@/context/AuthContext'
import React from 'react'
import { useNavigate } from 'react-router-dom';

const officerProtectedRoute = ({children}) => {

    const {user} = useAuth();

    const navigate = useNavigate()

    if(!user){
        return <navigate to="/" />
    }


    if(user.role !== "officer"){
        return <navigate to="/"/>
    }


  return children


}

export default officerProtectedRoute