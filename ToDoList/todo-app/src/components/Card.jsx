import React from 'react'

const Card = ({todo, onToggle, onRemove}) => {

  let { id, name, status } = todo
  let isActive = status ? 'todoItem active' : 'todoItem'

  return (
    <li className={isActive}>
      <div className="item">
        <input type="checkbox"
          id={id}
          onChange={() => onToggle(todo)}
          checked={status}
        />
        <label htmlFor={id}></label>
        <span>{name}</span>
      </div>
      <div className="item">
        <button className='btn' onClick={ () => onRemove(id)}>
          삭제
        </button>
      </div>
    </li>
  )
}

export default Card