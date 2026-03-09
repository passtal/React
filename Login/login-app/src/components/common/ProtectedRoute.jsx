import React from 'react'
import useAuth from '../../hooks/useAuth'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, roles: requiredRoles }) => {

  const { isLoading, isLogin, hasAnyRole } = useAuth()

    // 인증 여부 확인
    if (!isLogin) {
        return <Navigate to="/login" />
    }
    
    // 권한 확인
    if (requiredRoles && !hasAnyRole(...requiredRoles)) {
        return <Navigate to="/login" replace />
    }

    // 인증, 권한 ⭕
    return children
  
}

export default ProtectedRoute