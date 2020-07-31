import noEventsStyle from './mineNoEvents.module.css'

import React from 'react'

const MineNoEvents = ({ballStyle, pStyle}) => {
  return (
    <div className={noEventsStyle.scrollBar}>
      <div className={noEventsStyle.ball} style={ballStyle}></div>
      <p style={pStyle}>No activity found</p>
    </div>
  )
}

export default MineNoEvents
