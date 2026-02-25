import React, { useEffect, useState } from 'react'
import Header from './Header'
import Input from './Input'
import Footer from './Footer'
import List from './List'

const Container = () => {

  // 💥 state
  const [input, setInput] = useState('')
  const [todoList, setTodoList] = useState([])
  const [loading, setLoading] = useState([])
  const [initialPagination, setInitialPagination] = useState(null)  // 초기 페이지 정보
  const [listKey, setListKey] = useState(0)   // List 컴포넌트를 리셋하기 위한 key

  // 💫 데이터 목록 요청
  const getList = () => {
    console.log('할 일 목록 데이터를 요청합니다...');

    const url = 'http://localhost:8080/todos'
    fetch(url)
      .then( response => response.json() )
      .then( data => {
        console.log('응답 데이터 : ', data);
        // data.list        : 할 일 목록
        // data.pagination  : 페이지 정보
        setTodoList( data.list )
        setInitialPagination( data.pagination )
      })
      .catch( error => {
        console.error('error : ', error);
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // 💫 할 일 추가
  const onSubmit = async (e) => {
    e.preventDefault()    // 기본 이벤트 동작 방지
    let name = input
    if(input == '') name = '제목없음';

    // 데이터 등록 요청
    const data ={
      name : name,
      status : false,
      seq : 1
    }

    const option = {
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json',
      },
      body : JSON.stringify(data)
    }
    try {
      const url = 'http://localhost:8080/todos'
      const response = await fetch(url, option)
      const msg = await response.text() // SUCCESS, FAIL
      console.log('응답 메세지 : ', msg);

      // 등록 성공
      if (response.ok) {
        console.log('등록 성공');

        // 목록 요청
        getList()
        setListKey(prev => prev + 1)

        // 입력 값 비우기
        setInput('')
      }
      // 등록 실패
      else {
        console.log('등록 실패');
      }
    } catch (error) {
      console.error(error);
    }
  }

  // 💫 할 일 입력 변경 함수
  const onChange = (e) => {
    // e.target         : <input>
    // e.target.value   : input 에서 입력한 value
    console.log(e.target.value)
    setInput(e.target.value)
  }

  // 💫 할 일 완료
  const onToggle = async (todo) => {
    // 할 일 완료 수정 요청
    const data = {
      ...todo,
      status : !todo.status
    }
    const option = {
      method : 'PUT',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify(data)
    }
    try {
      const url = 'http://localhost:8080/todos'
      const response = await fetch(url, option)
      const msg = await response.text()
      console.log('응답 메세지 : ', msg);
      if (response.ok) {
        console.log('할 일 수정 성공');
        getList()
      } else {
        console.log('할 일 수정 실패')
      }
    } catch (error) {
      console.error(error);
    }
  }

  // // 💫 할 일 삭제
  // const onDelete = (id) => {

  //   // DELETE 요청
  //   const init = {
  //     method: 'DELETE',
  //   };

  //   // 할 일 삭제 [DELETE]
  //   // ➡ '삭제 완료 메시지'
  //   fetch(`http://localhost:8080/todos/${id}`,init)
  //     .then( ( response ) => response.text() )
  //     .then( ( data ) => console.log(data) )
  //     .catch( (error) => console.log(error) );

  //   // 삭제된 할 일 항목 제거
  //   const updatedTodoList = todoList.filter( (todo) => todo.id !== id )

  //   setTodoList( updatedTodoList )

  // }

  // // 💫 전체 삭제
  // const onDeleteAll = () => {
  //   // [DELETE] /todos/-1
  //   // DELETE 요청
  //   const init = {
  //     method: 'DELETE',
  //   };

  //   // 전체 할일 삭제 [DELETE]
  //   // ➡ '삭제 완료 메시지'
  //   fetch(`http://localhost:8080/todos/-1`,init)
  //     .then( ( response ) => response.text() )
  //     .then( ( data ) => console.log(data) )
  //     .catch( (error) => console.log(error) );

  //   // 삭제된 할일 항목 제거
  //   setTodoList( [] )

  // }

  // 💫 할 일 삭제
  const onRemove = async (id) => {
    const option = {
      method : 'DELETE',
      headers : { 'Content-Type' : 'application/json' } 
    }
    try {
      const url = `http://localhost:8080/todos/${id}`
      const response = await fetch(url, option)
      const msg = await response.text()
      console.log('응답 메세지 : ', msg)
      if (response.ok) {
        console.log('할 일 삭제 성공');
        getList()
      } else {
        console.log('할 일 삭제 실패')
      }
    } catch (error) {
      console.error(error);
    }
  }

  // 💫 전체 삭제
  const onRemoveAll = async () => {
    const option = {
      method : 'DELETE',
      headers : { 'Content-Type' : 'application/json' } 
    }
    try {
      const url = `http://localhost:8080/todos/bulk`
      const response = await fetch(url, option)
      const msg = await response.text()
      console.log('응답 메세지 : ', msg)
      if (response.ok) {
        console.log('전체 할 일 삭제 성공');
        getList()
        setListKey(prev => prev + 1);
      } else {
        console.log('전체 할 일 삭제 실패')
      }
    } catch (error) {
      console.error(error);
    }
  }

  // 💫 전체 완료
  const onCompleteAll = async () => {
    const url = 'http://localhost:8080/todos/bulk'
    const option = { method: 'PUT' }
    try {
      const response = await fetch(url, option)
      const msg = await response.text()
      console.log('응답 메세지 : ', msg)
      if (response.ok) {
        console.log('전체 완료 성공');
        getList()
        setListKey(prev => prev + 1);
      } else {
        console.log('전체 완료 실패')
      }
    } catch (error) {
      console.error(error);
    }
  }

  // 💫 컴포넌트가 마운트 될 때, 할 일 목록 요청
  useEffect(() => {
    getList()
  
  }, [])
  


  return (
    <div className='container'>
        <Header />
        <Input input={input} onChange={onChange} onSubmit={onSubmit} />
        <List key={listKey} todoList={todoList} onToggle={onToggle} onRemove={onRemove} loading={loading} getList={getList} />
        <Footer onRemoveAll={onRemoveAll} onCompleteAll={onCompleteAll} />
    </div>
  )
}

export default Container