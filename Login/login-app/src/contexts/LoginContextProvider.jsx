import React, { createContext, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as auth from '../apis/auth'
import * as Swal from '../apis/alert'
import Cookies from 'js-cookie'

// ✅ 컨텍스트 생성
export const LoginContext = createContext()

const LoginContextProvider = ({ children }) => {

  // 💫 state
  const [isLoading, setIsLoading] = useState(true)
  const [isLogin, setIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [roles, setRoles] = useState(new Set())

  const navigate = useNavigate()

  /**
   * 객체 권한 리스트 파싱
   *  - authList [ {no, username, auth} ] → Set (auth)
   *  - ( "ROLE_USER", ... )
   * @param {*} authList 
   * @returns 
   */
  const paresRoles = (authList) => {
    if(!authList) return new Set()
        return new Set(authList.map((obj) => obj.auth))
  }

  // 권한 확인
  const hasRole = (role) => roles.has(role)
  const hasAnyRole = (...roleList) => roleList.some((role) => roles.has(role))

  // ✅ 로그인 세팅
  const loginSetting = useCallback((userData) => {
    setIsLogin(true)
    setUserInfo(userData)
    setRoles( paresRoles(userData.authList) )

  }, [])

  // 💫 로그인
  const login = async (username, password) => {
    try {
        const response = await auth.login(username, password)
        const { data, headers } = response
        const authorization = headers.authorization
        const jwt = authorization.replace('Bearer ', '')

        // 📑 쿠키에 JWT 저장
        Cookies.set('jwt', jwt, { expires : 5 })

        // ✅ 로그인 상태 설정
        loginCheck()

        Swal.alert('로그인 성공', '메인 화면으로 이동합니다.', 'success',
            () => navigate('/')
        )
    } catch (error) {
        Swal.alert('로그인 실패', '아이디 또는 비밀번호가 일치하지 않습니다.', 'error')
    }
  }

  /**
   * 자동 로그인
   *  - 컴포넌트가 마운트(업데이트) 될 때, jwt로 로그인 상태를 유지하도록 실행
   */
  const autoLogin = useCallback(async () => {

    const jwt = Cookies.get('jwt')

    if (!jwt) {
        setIsLoading(false)
        return
    }
    try {
        const response = await auth.info()
        if (response.status == 200 && response.data !== 'UNAUTHORIZED') {
            loginSetting(response.data)
        }
    } catch (error) {
        console.error('자동 로그인 실패 : ', error);
        Cookies.remove('jwt')
    } finally {
        setIsLoading(false)
    }
  }, [loginSetting])

  // ✅ 로그인 체크 (JWT 쿠키 존재 시, 사용자 정보 요청)
  const loginCheck = async () => {
    const jwt = Cookies.get('jwt')
    if (!jwt) {
      logoutSetting()
      return
    }
    try {
      const response = await auth.info()
      const userData = response.data
      loginSetting(userData)
    } catch (error) {
      logoutSetting()
    }
  }

  // 마운트 시 자동 로그인
  useEffect(() => {
    autoLogin()
  }, [])

  // ✅ 로그아웃 세팅
  const logoutSetting = () => {
    setIsLogin(false)
    setUserInfo(null)
    setRoles(new Set())
  }

  // ✅ 페이지 로드 시 로그인 체크
  useEffect(() => {
    loginCheck()
    setIsLoading(false)
  }, [])

  return (
    <LoginContext.Provider value={ {isLoading, isLogin, userInfo, roles, login, hasRole, hasAnyRole, logout } }>
        {children}
    </LoginContext.Provider>
  )
}

export default LoginContextProvider