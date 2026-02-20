import React from 'react'

const Header = () => {
  return (
    <header style={ styles.header }>
        <h2>쇼핑몰 사이트</h2>
    </header>
  )
}

const styles = {
    header: {
        fontSize : "20px",
        padding : "20px",
        backgroundColor : "cornflowerblue",
        color : "white"
    }
}

export default Header