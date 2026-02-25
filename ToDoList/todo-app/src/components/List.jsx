import React, { useEffect, useRef, useState } from 'react'
import Card from './Card'
import SkeletonCard from './SkeletonCard'
import Page from './Page'
import { throttle } from 'lodash'

// 💫 쓰로틀
// const throttle = (fn, delay) => {
//   let timer = null
//   return (...args) => {
//     if (!timer) {
//       timer = setTimeout(() => {
//         fn(...args)       // 원본 함수 호출
//         timer = null      // 타이머 등록
//       }, delay);
//     }
//   }
// }

const List = ({todoList, onToggle, onRemove, loading, getList, initialPagination}) => {

  // 💫 스크롤 컨테이너 참조
  const todoListRef = useRef(null)

  // 이전 스크롤 위치
  const prevScrollTop = useRef(0)

  // state
  const [currentPage, setCurrentPage] = useState(1)   // 현재 페이지
  const [pages, setPages] = useState([])
  const [lastPage, setLastPage] = useState(initialPagination?.last || null)

  const currentPageRef = useRef(currentPage)
  const lastPageRef = useRef(lastPage)
  const pagesRef = useRef(pages)

  useEffect(() => { currentPageRef.current = currentPage }, [currentPage])
  useEffect(() => { lastPageRef.current = lastPage }, [lastPage])
  useEffect(() => { pagesRef.current = pages }, [pages])

  // 💫 초기 데이터 페이지로 설정
  useEffect(() => {
    if ( todoList.length > 0 || (todoList.length === 0) && initialPagination ) {
      const initialPage = {
        pageNum : 0,      // 초기 데이터는 pageNum을 0으로 설정
        data : todoList,
        // ✅ 1. 에러 수정: initialPagination이 없을 때는 안전한 기본값 사용
        pagination : initialPagination || {
          page : 1,
          size : 10,      // 기본 사이즈 (필요에 따라 수정하세요)
          total : 0,
          count : 0,
          start : 1,
          end : 1,
          first : 1,
          last : null
        }
      }
      console.log(`초기 페이지 : ${initialPage}`);

      // 초기 페이지가 이미 있는지 확인
      setPages(prev => {
        // [].some(조건)  : 배열 안에 조건을 만족하는 요소가 하나라도 있으면 true
        const hasInitialPage = prev.some(page => page.pageNum === 0)
        if (hasInitialPage) {
          // 기존 초기 페이지 업데이트
          return prev.map(page => page.pageNum === 0 ? initialPage : page)
        }
        else {
          // 새로운 초기 페이지 추가
          return [initialPage, ...prev]
        }
      })
    }
  }, [todoList, initialPagination])

  // 💫 다음 페이지 데이터 추가 함수./ 
  const addPage = (pageNum) => {

    // 이미 불러와진 페이지라면, 스킵
    if (pagesRef.current.some(page => page.pageNum === pageNum)) {
      return
    }

    const url = `http://localhost:8080/todos?page=${pageNum}`
    fetch(url)
      .then(response => response.json())
      .then(data =>  {
        console.log('응답 데이터 : ',  data)
        // data : { list : [], pagination : { page, size, start, end, first, last, total } }

        // 마지막 페이지 정보 저장
        setLastPage(data.pagination.last)

        if ( pageNum > data.pagination.last ) {
          // alert('마지막 페이지입니다.')
          return
        }

        // 새페이지 데이터 추가
        const newPage = {
          pageNum : pageNum,              // 현재 페이지
          data : data.list,               // 할 일 목록
          pagination : data.pagination    // 페이지 정보
        }

        setPages( prev => [...prev, newPage] )   // 이전 상태에 새 페이지 데이터 누적
        setCurrentPage(pageNum)
      })
      .catch(error => {console.error(error)})
  }


  // 스크롤 이벤트 핸들러
  const handleScroll = throttle( () => {

    const { scrollHeight, scrollTop, clientHeight } = todoListRef.current

    // 이전 스크롤보다 현재 스크롤 위치가 더 크면, 스크롤 아래로
    const isScrollDown = scrollTop > prevScrollTop.current
    // 이전 스크롤 위치 업데이트
    prevScrollTop.current = scrollTop

    // 스크롤 맨 마지막 도달
    if (isScrollDown && clientHeight + scrollTop >= scrollHeight - 1) {
      // alert('스크롤 맨 마지막입니다.')
      const nextPage = currentPageRef.current + 1
      // 마지막 페이지를 초과하면 요청하지 않음
      if ( lastPageRef.current === null || nextPage <= lastPageRef.current ) {
        addPage(nextPage)
      }
      if (lastPageRef.current != null && nextPage > lastPageRef.current) {
        alert('마지막 페이지입니다.')
      }
    }
  } , 200 )

  // 💫 스크롤 이벤트를 마운팅 될 때 한 번만 정의 및 등록
  // 💫 쓰로틀 적용

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
  }, [currentPage, lastPage, pages])
  

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
      // ✅ 데이터가 있을 때 (할 일이 있을 때)
      pages.length > 0
      ?
      (
        [...pages]
          .map(page => {
            const isInitialPage = page.pageNum === 0
            return (
              <Page
                key={`page-${page.pageNum}`}
                page={page}
                onToggle={onToggle}
                onRemove={onRemove}
                isInitialPage={isInitialPage}
                getList={getList}
              />
            )
          })
      )
      :
      (
        // ❌ 데이터가 없을 때 표시 (할 일이 없을 때)
        <div className='empty-state'>
          <div className='empty-icon'>📑</div>
          <h3 className='empty-title'>할 일이 없습니다.</h3>
          <p className='empty-sub'>새로운 할 일을 추가해보세요!😊</p>
        </div>
      )
    }
    </div>
  )
}

export default List