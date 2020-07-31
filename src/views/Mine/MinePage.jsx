import React, {useState, useEffect} from 'react'
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

const MinePage = () => {
  const [tabInfo, setTabInfo] = useState([
    {
      id: 1,
      svg: LikeOutlineSvg,
      message: '12 Likes',
      isActive: true,
      defaultSvg: LikeOutSel,
      tempSvg: LikeOutlineSvg
    },
    {
      id: 2,
      svg: CheckSvg,
      message: '0 Going',
      isActive: false,
      defaultSvg: CheckSel,
      tempSvg: CheckSvg
    },
    {
      id: 3,
      svg: PastSvg,
      message: '0 Past',
      isActive: false,
      defaultSvg: PastSel,
      tempSvg: PastSvg
    }
  ])
  const [events, setEvents] = useState([
    {
      id: 1,
      has_events: false,
      isActive: true
    },
    {
      id: 2,
      has_events: false,
      isActive: false
    },
    {
      id: 3,
      has_events: false,
      isActive: false
    }
  ])
  useEffect(() => {
    const currentArr = [...tabInfo]
    let messageArr = []
    const currentEvents = [...events]
    currentArr.forEach(tab => {
      if (tab.isActive) {
        tab.svg = tab.defaultSvg
      }
      messageArr.push(tab.message)
    })
    messageArr = messageArr.map(m => parseInt(m))
    messageArr.forEach((m, idx) => {
      if (m > 0) {
        currentEvents[idx].has_events = true
      }
    })
    setEvents(currentEvents)
    setTabInfo(currentArr)
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
  return (
    <div>
      <Header></Header>
      <div className={MineStyle.main}>
        <div className={MineStyle.top}></div>
        <div className={MineStyle.middle}>
          Username
        </div>
        <div className={MineStyle.bottom}>
          <div className={MineStyle.info}>
            <div></div>
            <span>myusername@gmail.com</span>
          </div>
        </div>
      </div>
      <div className={MineStyle.activity}>
        <div className={MineStyle.nav}>
          <ul>
            {tabInfo.map(tab => {
              return (
                <li key={tab.id} onTouchStart={() => handleCheckTab(tab.id)}>
                  <img src={tab.svg} alt="img"/>
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
            return event.isActive ? <MineEvents key={event.id} /> : ""
          } else {
            return event.isActive ? <MineNoEvents key={event.id} /> : ""
          }
        })}
      </div>
    </div>
  )
}

export default MinePage