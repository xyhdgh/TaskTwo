import React, { useEffect, useRef, useState } from 'react'
import Header from '../../components/Header/Header.jsx'
import homeStyle from './home.module.css'
import MineEvents from '../../components/MineEvents/MineEvents.jsx'
import Aside from '../Aside/Aside.jsx'
import Loading from '../../components/Loading/Loading.jsx'
import { useHistory } from 'react-router-dom'
import { get_events, cancel_login } from '../../api/http.js'
import beautyTime from '../../util/beautyTime.js'

const Home = () => {
  const style = {
    paddingTop: '0.16rem'
  }
  const searchStyle = {
    width: '0.18rem',
    height: '0.18rem'
  }
  // 获取数据
  const [events, setEvents] = useState([])
  // 判断获取更多
  const [hasMore, setHasMore] = useState(false)
  // 定义loading状态
  const [isLoading, setIsLoading] = useState(false)
  const history = useHistory()
  const [pageX, setPageX] = useState(0)
  const [pageY, setPageY] = useState(0)
  const homeRef = useRef(null)
  const asideRef = useRef(null)
  const [moveX, setMoveX] = useState(0)
  const [moveY, setMoveY] = useState(0)
  const defineDirect = () => {
    let X = moveX - pageX
    let Y = moveY - pageY
    if (Math.abs(X) > Math.abs(Y) && X > 0) {
      homeRef.current.style.transform = 'translateX(2.4rem)'
      asideRef.current.selfRef.current.style.transform = 'translateX(2.4rem)'
    } else if (Math.abs(X) > Math.abs(Y) && X < 0) {
      homeRef.current.style.transform = 'translateX(0)'
      asideRef.current.selfRef.current.style.transform = 'translateX(0)'
    } else {
      return
    }
  }
  const asideDirect = () => {
    if (moveX < pageX) {
      homeRef.current.style.transform = 'translateX(0)'
      asideRef.current.selfRef.current.style.transform = 'translateX(0)'
    }
  }
  const handleSearch = () => {
    homeRef.current.style.transform = 'translateX(0)'
    asideRef.current.selfRef.current.style.transform = 'translateX(0)'
  }
  useEffect(() => {
    let filterData = asideRef.current.filterData
    let token = sessionStorage.getItem('token')
    if (!token) {
      history.push('/login')
    } else {
      setIsLoading(true)
      get_events('/events', filterData, token).then(res => {
        console.log('res::', res);
        if (res.status === 200) {
          const {events, hasMore} = res.data;
          events.forEach((event) => {
            event.begin_time = beautyTime(event.begin_time)
            event.end_time = beautyTime(event.end_time)
          })
          setIsLoading(false)
          setEvents(events)
          setHasMore(hasMore)
        }
      }).catch(err => Promise.reject(err))
    }
  }, [asideRef.current])
  useEffect(() => {
    const start = (e) => {
      e.preventDefault();
      setPageX(e.touches[0].pageX)
      setPageY(e.touches[0].pageY)
    }
    const move = (e) => {
      e.preventDefault();
      setMoveX(e.touches[0].pageX)
      setMoveY(e.touches[0].pageY)
      defineDirect()
    }
    const asideMove = (e) => {
      e.preventDefault()
      setMoveX(e.touches[0].pageX)
      setMoveY(e.touches[0].pageY)
      asideDirect()
    }
    homeRef.current.addEventListener('touchstart', start, false)
    homeRef.current.addEventListener('touchmove', move, false)
    asideRef.current.selfRef.current.addEventListener('touchstart', start, false)
    asideRef.current.selfRef.current.addEventListener('touchmove', asideMove, false)
    return () => {
      homeRef.current.removeEventListener('touchstart', start, false)
      homeRef.current.removeEventListener('touchmove', move, false)
      asideRef.current.selfRef.current.removeEventListener('touchstart', start, false)
      asideRef.current.selfRef.current.removeEventListener('touchmove', asideMove, false)
    }
  }, [moveX, pageX])
  return (
    <div>
      <div className={homeStyle.container} ref={homeRef}>
        <Header flag={"search"} style={searchStyle}></Header>
        {isLoading ? "" : <MineEvents style={style} dataList={{events, hasMore}} currentData={asideRef.current} />}
      </div>
      <Aside ref={asideRef} handleSearch={handleSearch} />
      {isLoading && <Loading />}
    </div>
  )
}

export default Home
