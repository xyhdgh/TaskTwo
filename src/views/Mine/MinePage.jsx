import React, { useState, useEffect } from 'react'
import Header from '../../components/Header/Header.jsx'
import MineStyle from './minepage.module.css'
import LikeOutlineSvg from '../../static/svgs/like-outline.svg'
import CheckSvg from '../../static/svgs/check-outline.svg'
import PastSvg from '../../static/svgs/past.svg'
import LikeOutSel from '../../static/svgs/like-outline-sel.svg'
import CheckSel from '../../static/svgs/check-outline-sel.svg'
import PastSel from '../../static/svgs/past-sel.svg'
import MineNoEvents from '../../components/MineNoEvents/MineNoEvents.jsx'
import MineEvents from '../../components/MineEvents/MineEvents.jsx'
import { get_user, get_user_events } from '../../api/http.js'

const MinePage = () => {
  let offset = 0;
  let limit = 25;
  const [tabInfo, setTabInfo] = useState([
    {
      id: 1,
      svg: LikeOutlineSvg,
      message: '',
      isActive: true,
      defaultSvg: LikeOutSel,
      tempSvg: LikeOutlineSvg
    },
    {
      id: 2,
      svg: CheckSvg,
      message: '',
      isActive: false,
      defaultSvg: CheckSel,
      tempSvg: CheckSvg
    },
    {
      id: 3,
      svg: PastSvg,
      message: '',
      isActive: false,
      defaultSvg: PastSel,
      tempSvg: PastSvg
    }
  ])
  const [events, setEvents] = useState([
    {
      id: 1,
      has_events: false,
      isActive: true,
    },
    {
      id: 2,
      has_events: false,
      isActive: false,
    },
    {
      id: 3,
      has_events: false,
      isActive: false,
    }
  ])
  const [likes, setLikes] = useState([])
  const [likesHasMore, setLikesHasMore] = useState(false)
  const [going, setGoing] = useState([])
  const [goingHasMore, setGoingHasMore] = useState(false)
  const [past, setPast] = useState([])
  const [pastHasMore, setPastHasMore] = useState(false)
  const [user, setUser] = useState({})
  /**
   * 请求
   * @param {*} offset 
   * @param {*} limit 
   * @param {*} type 
   * @param {*} token 
   */
  const fetchData = async (offset, limit, type, token) => {
    return await get_user_events(`/user/events`, {offset, limit, type}, token)
  }
  /**
   * 获取用户信息
   */
  useEffect(() => {
    let token = sessionStorage.getItem('token')
    get_user(`/user`, token).then(res => {
      if (res.status === 200) {
        setUser(res.data)
      }
    }).catch(err => Promise.reject(err))
  }, [])
  /**
   * 获取用户的likes、going、past
   */
  useEffect(() => {
    let token = sessionStorage.getItem('token')
    let map = {
      likes: "liked",
      going: "going",
      past: "past"
    }
    let currentArr = []
    const fun = async () => {
      await new Promise((resolve, reject) => {
        fetchData(0, 25, map.likes, token).then(res => {
          if (res.status === 200) {
            setLikes(res.data)
            res.data.hasMore && setLikesHasMore(res.data.hasMore)
            currentArr.push(`${res.data.events.length} Likes`)
            resolve()
          }
        }).catch(err => reject(err))
      })
      await new Promise((resolve, reject) => {
        fetchData(0, 25, map.going, token).then(res => {
          if (res.status === 200) {
            setGoing(res.data)
            res.data.hasMore && setGoingHasMore(res.data.hasMore)
            currentArr.push(`${res.data.events.length} Going`)
            resolve()
          }
        }).catch(err => reject(err))
      })
      await new Promise((resolve, reject) => {
        fetchData(0, 25, map.past, token).then(res => {
          if (res.status === 200) {
            setPast(res.data)
            res.data.hasMore && setPastHasMore(res.data.hasMore)
            currentArr.push(`${res.data.events.length} Past`)
            let currentTabInfo = [...tabInfo]
            let currentEvents = [...events]
            currentTabInfo.forEach((tab, index) => {
              tab.message = currentArr[index]
            })
            currentEvents.forEach((event, index) => {
              event.has_events = currentArr.map(event => !!parseInt(event))[index]
            })
            setTabInfo(currentTabInfo)
            setEvents(currentEvents)
            resolve()
          }
        }).catch(err => reject(err))
      })
    }
    fun()
  }, [])
  const handleCheckTab = (id) => {
    const currentArr = [...tabInfo]
    const currentEvents = [...events]
    currentArr.forEach((tab) => {
      tab.isActive = false
      tab.svg = tab.svg === tab.defaultSvg ? tab.tempSvg : tab.svg
      if (tab.id === id) {
        tab.isActive = true
        tab.svg = tab.defaultSvg
      }
    })
    currentEvents.forEach(event => {
      event.isActive = false
      if (event.id === id) {
        event.isActive = true
      }
    })
    setTabInfo(currentArr)
    setEvents(currentEvents)
  }
  const checkEvents = (id) => {
    switch (id) {
      case 1:
        return likes.events
      case 2:
        return going.events
      case 3:
        return past.events
      default:
        break;
    }
  }
  return (
    <div>
      <Header></Header>
      <div className={MineStyle.main}>
        <div className={MineStyle.top}>
          <img src={user.avatar} alt="img" />
        </div>
        <div className={MineStyle.middle}>
          {user.username}
        </div>
        <div className={MineStyle.bottom}>
          <div className={MineStyle.info}>
            <div></div>
            <span>{user.email}</span>
          </div>
        </div>
      </div>
      <div className={MineStyle.activity}>
        <div className={MineStyle.nav}>
          <ul>
            {tabInfo.map(tab => {
              return (
                <li key={tab.id} onTouchStart={() => handleCheckTab(tab.id)}>
                  <img src={tab.isActive ? tab.defaultSvg : tab.svg} alt="img" />
                  <span className={tab.isActive ? `${MineStyle.active}` : ""}>{tab.message}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <div className={MineStyle.scrollArea}>
        {events.map(event => {
          if (event.has_events) {
            return event.isActive ? <MineEvents key={event.id} dataList={{events: checkEvents(event.id), hasMore: true}} style={{height: 2.68}}/> : ""
          } else {
            return event.isActive ? <MineNoEvents key={event.id} /> : ""
          }
        })}
      </div>
    </div>
  )
}

export default MinePage