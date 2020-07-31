import MineEventsStyle from './mineEvents.module.css'
import timeSvg from '../../static/svgs/time.svg'
import checkSvg from '../../static/svgs/check.svg'
import likeSvg from '../../static/svgs/like.svg'
import SearchResult from '../SearchResult/SearchResult.jsx'
import MineNoEvents from '../MineNoEvents/MineNoEvents.jsx'
import {withRouter} from 'react-router-dom'
import checkOutLineGoLikeSvg from '../../static/svgs/check-outline-golike.svg'
import likeOutLineGoLikeSvg from '../../static/svgs/like-outline-golike.svg'

import React from 'react'
import { useEffect, useState, useRef } from 'react'

const MineEvents = withRouter(({dataList, currentData, style, history}) => {
  // 保存数据的长度 判断是否渲染组件
  const [len, setLen] = useState(0)
  const [isShow, setIsShow] = useState(true)
  const { hasMore, events } = dataList
  useEffect(() => {
    setLen(events.length)
    if (len > 0) {
      setIsShow(false)
    } else {
      setIsShow(true)
    }
  }, [len, events])
  const goDetailPage = ({id}) => {
    history.push(`/events/${id}`)
  }
  return (
    <div className={MineEventsStyle.container}>
      {currentData?.isSearch ? <SearchResult currentData={currentData} eventsLen={len} /> : ""}
      <div className={MineEventsStyle.scrollBar} style={style}>
        {events?.map(data => {
          return (
            <div className={MineEventsStyle.box} key={data.id}>
              <div className={`${MineEventsStyle.top} ${MineEventsStyle.clearfix}`}>
                <img src={data.creator.avatar} alt="img" />
                <span>{data.creator.username}</span>
                <button>{data.channel.name}</button>
              </div>
              <div className={`${MineEventsStyle.title} ${data.images.length > 0 ? MineEventsStyle.change : ""}`} onTouchEnd={() => goDetailPage(data)}>{data.name}</div>
              <div className={MineEventsStyle.time}>
                <img src={timeSvg} alt="img" />
                <div>{`${data.begin_time} - ${data.end_time}`}</div>
              </div>
              {data.images.length > 0 && <img className={MineEventsStyle.descImg} src={data.images[1]} alt="img" />}
              <div className={MineEventsStyle.content}>{data.description}</div>
              <div className={MineEventsStyle.bottom}>
                <div>
                  <img src={data.me_going ? checkSvg : checkOutLineGoLikeSvg} alt="img" />
                  {data.me_going ? <span>I am going!</span> : <span>{data.goings_count} Going</span>}
                </div>
                <div>
                  <img src={data.me_likes ? likeSvg : likeOutLineGoLikeSvg} alt="img" />
                  {data.me_likes ? <span>I like it</span> : <span>{data.likes_count} Likes</span>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {isShow ? <MineNoEvents ballStyle={{margin: "1.2rem auto 0"}} pStyle={{margin: ".14rem auto 0"}} /> : null}
    </div>
  )
})

export default MineEvents
