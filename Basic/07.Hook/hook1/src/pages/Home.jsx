// rafce
import React from 'react'
import TodoItem from '../components/TodoItem'
import { useState } from 'react'
import { useEffect } from 'react'

const Home = () => {
  // 🔹 state
  const [todos, setTodos] = useState(
    // 로컬 스토리지에서 불러옴
    () => {
      const saved = localStorage.getItem("todos");
      return saved ? JSON.parse(saved) : [];
    }
  )    // 할 일 목록
  const [text, setText] = useState("")    // 새로운 할 일 검색
  const [search, setSearch] = useState("") // 검색어

  const handleToggle = (id) => {
    const newTodos = todos.map(todo => todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
    )
    // 상태 업데이트
    setTodos( newTodos )
  }

  // 할 일 삭제
  const handleDelete = (id) => {
    const newTodos = todos.filter(todo => todo.id !== id )
    // 상태 업데이트
    setTodos( newTodos )
  }

  // 할 일 추가
  const handleAdd = () => {
    // 입력 값이 없으면 추가 안 함
    if (!text.trim()) return
    
    const newTodos = [
      ...todos,
      { id: Date.now(), text: text, completed: false }
    ]

    // 상태 업데이트
    setTodos( newTodos )
    setText("")
  }

  // 할 일 전체 개수와 완료된 개수
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;

  // 검색어가 포함된 할 일 목록
  const searchedTodos = todos.filter(todo => 
    // "리액트 복습하기".includes("복습") => true
    // "리액트 복습하기".includes("예습") => false
    todo.text.includes(search)
  );

  // ❗ useEffect - react 함수 컴포넌트의 생명주기와 관련된 작업을 수행하는 훅
  useEffect(() => {
    // 로컬 스토리지에 저장
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos]) // 💫 todos 상태가 변화할 때 마다 실행됨
  

  return (
    <div>
        <h1>Todo List 앱</h1>

        <input
            type="text"
            placeholder='할 일 입력'
            value={text}
            onChange={e => setText(e.target.value)}
        />

        <button onClick={handleAdd}>추가</button>

        <br /><br />

        <input 
          type="text"
          value={search}
          placeholder='검색어를 입력하세요.'
          onChange={e => setSearch(e.target.value)} 
        />

        <h3>전체 : {total} / 완료 : {completed} </h3>

        {
            searchedTodos.map(todo => (
                <TodoItem 
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                />
            ))
        }

    </div>
  )
}

export default Home;