import React from 'react'
import Layout from '../components/common/Layout'
import UserForm from '../components/User/UserForm'
import useAuth from '../hooks/useAuth'
import * as auth from '../apis/auth'
import * as Swal from '../apis/alert'

const User = () => {

  const { userInfo } = useAuth()

  // 회원 정보 수정
  const updateUser = async (form) => {
    try {
      const response = await auth.update(form)
      if (response.stauts === 200) {
        Swal.alert('회원정보 수정 성공', '로그아웃 후, 다시 로그인하세요.', 'success',
          () => logout(true)
        )
      }
    } catch (error) {
      console.error('회원 정보 수정 중 에러가 발생했습니다.', error);
      Swal.alert('회원 정보 수정 실패', '회원 정보 수정에 실패했습니다.', 'error')
    }
  }

  // 회원 탈퇴
  const deleteUser = async (username) => {
    try {
      const response = await auth.remove(username)
      if (response.stauts === 200) {
        Swal.alert('회원탈퇴 성공', '가라.', 'success',
          () => logout(true)
        )
      }
    } catch (error) {
      console.error('회원 탈퇴 처리 중 에러가 발생했습니다.', error);
      Swal.alert('회원 탈퇴 실패', '회원 탈퇴에 실패했습니다.', 'error')
    }
  }

  return (
    <Layout>
        <UserForm userInfo={userInfo} updateUser={updateUser} deleteUser={deleteUser} />
    </Layout>
  )
}

export default User