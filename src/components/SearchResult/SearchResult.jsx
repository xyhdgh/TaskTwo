import SearchResultStyle from './searchresult.module.css'
import React, { useState, useEffect } from 'react'
import { getCurrentTime } from '../../util/getTime'

const SearchResult = ({currentData, eventsLen}) => {
  // const [num, setNum] = useState(0)
  const [time, setTime] = useState("")
  useEffect(() => {
    if (currentData) {
      let start = getCurrentTime(currentData.filterData.after)
      let end = getCurrentTime(currentData.filterData.end)
      if (currentData.filterData.after !== currentData.filterData.end) {
        setTime(`from ${start.day}/${start.month} to ${end.day}/${end.month}`)
      } else {
        setTime(`on ${start.day}/${start.month}`)
      }
    }
  }, [])
  return (
    <div className={SearchResultStyle.container}>
      <span className={SearchResultStyle.left}>{eventsLen} Results</span>
      <button onTouchStart={() => window.location.reload()}>CLEAR SEARCH</button>
      <span className={SearchResultStyle.describe}>Searched for {currentData.channel} Activities {time}</span>
    </div>
  )
}

export default SearchResult
