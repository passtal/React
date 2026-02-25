import React, { useEffect, useRef } from 'react'
import Card from './Card'
import SkeletonCard from './SkeletonCard'

const List = ({todoList, onToggle, onRemove, loading}) => {

  // 💫 스크롤 컨테이너 참조
  const todoListRef = useRef(null)
  const prevScrollTop = useRef(0)

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {

    const { scrollHeight, scrollTop, clientHeight } = todoListRef.current

    // 이전 스크롤보다 현재 스크롤 위치가 더 크면, 스크롤 아래로
    const isScrollDown = scrollTop > prevScrollTop.current
    // 이전 스크롤 위치 업데이트
    prevScrollTop.current = scrollTop

    // 스크롤 맨 마지막 도달
    if (isScrollDown && clientHeight + scrollTop >= scrollHeight - 1) {
      alert('스크롤 맨 마지막입니다.')
    }
  }

  useEffect(() => {
    const todoListElement = todoListRef.current

    // 스크롤 이벤트 등록
    if (todoListElement) {
      todoListElement.addEventListener('scroll', handleScroll)
    }
    return () => {

      // 스크롤 이벤트 제거
      if (todoListElement) {
      todoListElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])
  

  // ❗ 구조를 잘 봐야함
  // ✅ 최종적으로 표현식 - 표현식으로 묶여야하고,
  // ✅ 해당 식이나 표현을 사용하기 위해 필요한 구성이 무엇인지 파악해야 함
  return (
    <div className='todoList' ref={todoListRef} >
    {
      loading
      ?
      (
        // 마운팅 전 - 스켈레톤 카드 3개
        <ul className='initial-list'>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </ul>
      )
      :
      todoList.length > 0
      ?
      (
        // ✅ 데이터가 있을 때 (할 일이 있을 때)
        <ul className="initial-list">
          {
            todoList.map((todo) => (
              <Card key={todo.id} todo={todo} onToggle={onToggle} onRemove={onRemove} />
            ))
          }
        </ul>
      )
      :
      (
        // ❌ 데이터가 없을 때 표시 (할 일이 없을 때)
        <div className='empty-state'>
          <div className='empty-icon'>📑</div>
          <h3 className='empty-title'>할 일이 없습니다.</h3>
          <p className='empty-sub'>새로운 할 일을 추가해보세요!</p>
        </div>
      )
    }
    </div>
  )
}

export default List