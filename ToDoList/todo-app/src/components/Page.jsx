import React, { useEffect, useState } from 'react'
import Card from './Card'

// ✅ 수정 1: props에서 중복된 refreshPage 제거
const Page = ({ page, onToggle, onRemove, isInitialPage = false, getList }) => {
  const { pageNum, data: initialData, pagination: initialPagination } = page

  const [pageData, setPageData] = useState(initialData)
  const [pagination, setPagination] = useState(initialPagination)

  // initialData 가 변경될 때, pageData 업데이트
  useEffect(() => {
    setPageData(initialData)
  }, [initialData])
  
  // initialPagination 이 변경될 때, pagiantion 업데이트
  useEffect(() => {
    setPagination(initialPagination)
  }, [initialPagination])

  // 해당 페이지 데이터를 서버에서 다시 가져오기
  const refreshPage = () => {
    // 초기 페이지( pageNum === 0 )는 getList 를 통해 갱신
    if ( isInitialPage && getList ) {
        getList()
        return
    }

    // 초기 페이지가 아닌 경우
    if ( pageNum > 0 ) {
        const url = `http://localhost:8080/todos?page=${pageNum}`
        fetch(url)
            // ✅ 수정 2: JSON 파싱 추가
            .then(res => res.json()) 
            .then(data => {
                console.log(`페이지 번호 : ${pageNum}`);
                setPageData(data.list)
                setPagination(data.pagination)
            })
            .catch(error => { console.error((error));})
    }
  }

  // 페이지 내의 할 일 완료 처리
  const handlePageToggle = (todo) => {

    // 초기 페이지는 전달받은 onToggle 사용
    if (isInitialPage && onToggle ) {
        onToggle(todo)
        return
    }

    // 초기 페이지가 아닌 경우
    const url = 'http://localhost:8080/todos'
    const option = {
        method : 'PUT',
        headers : { 'Content-Type' : 'application/json' },
        body : JSON.stringify({...todo, status : !todo.status })
    }
    fetch(url, option)
        .then(response => {
            if(response.ok) {
                console.log('2번째 페이지부터 할 일 완료 성공!')
                refreshPage()
            }
        })
        .catch(error => { console.error(error); })
  }

  // 페이지 내 할 일 삭제 처리
  const handlePageRemove = (id) => {
    
    // 초기 페이지는 전달받은 onRemove 사용
    if ( isInitialPage && onRemove ) {
        onRemove(id)
        return
    }

    // 초기 페이지가 아닌 경우
    const url = `http://localhost:8080/todos/${id}`
    // ✅ 수정 3: DELEETE -> DELETE 오타 수정
    const option = { method : `DELETE` } 
    fetch(url, option)
        .then(response => {
            if (response.ok) {
                console.log(`2번째 페이지부터 할 일 삭제 성공`);
                refreshPage()
            }
        })
        .catch(error => { console.error(error);})
  }

  return (
    <>
    <div className={`page-section ${isInitialPage ? 'initial-page' : ''}`} data-page={pageNum}>
          {/* 페이지 정보 */}
          <div className='page-info'>
              <span className='page-number'>
                  {isInitialPage ? '초기 페이지' : `페이지 : ${pagination.page || pageNum}`}
              </span>
              <span className='page-details'>
                  (
                  {pagination?.start || 1}-{pagination?.end || pagination?.count || pageData.length}
                  /
                  {pagination?.total || '?'}
                  )
              </span>
              {pagination && !isInitialPage && (
                <span>
                    size : {pagination.size} | index : {pagination.index}
                </span>
              )}
          </div>
      </div>
        <ul className='initial-list'>
              {
                  // ✅ 수정 4: initialData 대신 상태(State)로 관리되는 pageData로 화면을 그림
                  pageData.map((todo) => (
                      <Card
                          key={todo.id}
                          todo={todo}
                          onToggle={handlePageToggle}
                          onRemove={handlePageRemove}
                          pageNum={pageNum}
                          refreshPage={refreshPage} />
                  )
                  )}
          </ul>
    </>
  )
}

export default Page