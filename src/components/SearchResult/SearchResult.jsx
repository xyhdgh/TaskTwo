import SearchResultStyle from './searchresult.module.css'
import React, { useState, useEffect } from 'react'

const SearchResult = ({currentData, eventsLen}) => {
  const [num, setNum] = useState(0)
  const [time, setTime] = useState("")
  useEffect(() => {
    if (currentData) {
      console.log('currentData::', currentData);
      setNum(eventsLen)
      if (currentData.startTime !== currentData.endTime) {
        setTime(`from ${currentData.startTime} to ${currentData.endTime}`)
      } else {
        setTime(`on ${currentData.startTime}`)
      }
    }
  }, [])
  return (
    <div className={SearchResultStyle.container}>
      <span className={SearchResultStyle.left}>{num} Results</span>
      <button>CLEAR SEARCH</button>
      <span className={SearchResultStyle.describe}>Searched for {currentData.channel} Activities {time}</span>
    </div>
  )
}

export default SearchResult
