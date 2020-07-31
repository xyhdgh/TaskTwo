import React, { useEffect, useState } from 'react'
import SearchStyle from './search.module.css'
import DateFromSvg from '../../static/svgs/date-from.svg'
import DateToSvg from '../../static/svgs/date-to.svg'

const SearchBox = ({setStartStamp, setEndStamp, setButtonTip}) => {
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  useEffect(() => {
    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() + 1
    let day = now.getDate() + 1
    month = month.toString().length === 1 ? `0${month}` : month
    day = day.toString().length === 1 ? `0${day}` : day
    setStartTime(`${day}/${month}/${year}`)
    setEndTime(`${day}/${month}/${year}`)
    setStartStamp(new Date(`${year}-${month}-${day} 00:00:00`).getTime())
    setEndStamp(new Date(`${year}-${month}-${day} 23:59:59`).getTime())
  }, [])
  useEffect(() => {
    setButtonTip(`from ${startTime} to ${endTime}`)
  }, [startTime, endTime])
  // 处理开始时间的事项
  const changeStartTimeStamp = (value) => {
    setStartTime(value)
    if (value.length === 10) {
      let startStamp = new Date(`${transfromDate(value)} 00:00:00`).getTime()
      setStartStamp(startStamp)
      setButtonTip(`from to`)
    }
  }
  // 处理结束时间的事项
  const changeEndTimeStamp = (value) => {
    setEndTime(value)
    if (value.length === 10) {
      let endStamp = new Date(`${transfromDate(value)} 23:59:59`).getTime()
      setEndStamp(endStamp)
      setButtonTip()
    }
  }
  // 转换日期格式的方法
  const transfromDate = (dateStr) => {
    return dateStr.split('/').reverse().join('-')
  }
  return (
    <div className={SearchStyle.box}>
      <div className={SearchStyle.top}></div>
      <div className={SearchStyle.bottom}>
        <img src={DateFromSvg} alt="img"/>
        <input type="text" value="09/05/2016" onTouchStart={(e) => e.target.focus()} value={startTime} onChange={e => changeStartTimeStamp(e.target.value)} />
        <img src={DateToSvg} alt="img" style={{marginLeft: ".195rem"}} />
        <input type="text" value="09/05/2016" onTouchStart={(e) => e.target.focus()} value={endTime} onChange={e => changeEndTimeStamp(e.target.value)} />
      </div>
    </div>
  )
}

export default SearchBox
