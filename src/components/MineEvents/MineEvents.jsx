import MineEventsStyle from './mineEvents.module.css'
import timeSvg from '../../static/svgs/time.svg'
import checkSvg from '../../static/svgs/check.svg'
import likeSvg from '../../static/svgs/like.svg'
import SearchResult from '../SearchResult/SearchResult.jsx'
import MineNoEvents from '../MineNoEvents/MineNoEvents.jsx'
import { withRouter } from 'react-router-dom'
import checkOutLineGoLikeSvg from '../../static/svgs/check-outline-golike.svg'
import likeOutLineGoLikeSvg from '../../static/svgs/like-outline-golike.svg'
import VirtualList from 'react-tiny-virtual-list'
import Loading from '../Loading/Loading'
import { get_events } from '../../api/http.js'

import React from 'react'
import { useEffect, useState, useRef } from 'react'

const MineEvents = withRouter(({ dataList, currentData, history, filterData }) => {
  const [isShow, setIsShow] = useState(true)
  let hasMore = dataList?.hasMore
  let events = dataList?.events
  const [data, setData] = useState([])
  const [has, setHas] = useState(false)
  useEffect(() => {
    setData(events)
    setHas(hasMore)
    if (data.length === 0) {
      setIsShow(true)
    } else {
      setIsShow(false)
    }
  }, [events, hasMore, has])
  const clientHeight = document.documentElement.clientHeight
  const clientWidth = document.documentElement.clientWidth
  const sizeStyle = document.documentElement.style.fontSize
  const reg = /\d+\.?(\d+)?/;
  const HtmlFontSize = Number(reg.exec(sizeStyle)[0]) * clientWidth / 100
  // console.log('HtmlFontSize::', HtmlFontSize);
  const boxRef = useRef()
  let height = currentData?.isSearch ? parseFloat(HtmlFontSize) * 4.6 : parseFloat(HtmlFontSize) * 5.28
  // 储存每个item高度
  const [itemHeight, setItemHeight] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  // 有图片时 高度
  const hasImgHeight = 2.42 * parseFloat(HtmlFontSize)
  // 无图片时 高度
  const hasNoImgHeight = 2.24 * parseFloat(HtmlFontSize)
  const goDetailPage = ({ id }) => {
    history.push(`/events/${id}`)
  }
  const handleScroll = (scrollTop) => {
    let token = sessionStorage.getItem('token')
    let handleHeight;
    let diffHeight;
    if (currentData && currentData.isSearch) {
      handleHeight = boxRef.current.children[1].children[0].scrollHeight
      diffHeight = parseFloat(HtmlFontSize) * 1.08
    } else {
      handleHeight = boxRef.current.children[0].children[0].scrollHeight
      diffHeight = parseFloat(HtmlFontSize) * 0.4
    }
    if (scrollTop + clientHeight - diffHeight === handleHeight) {
      // 触底
      if (has) {
        filterData = { ...filterData, offset: data.length }
        setIsLoading(true)
        get_events('/events', filterData, token).then(res => {
          if (res.status === 200) {
            setIsLoading(false)
            setHas(res.data.hasMore)
            setData(data.concat(res.data.events))
          }
        }).catch(err => Promise.reject(err))
      } else {
        return
      }
    }
  }
  useEffect(() => {
    let currentArr = []
    data.forEach(event => {
      if (event.images?.length > 0) {
        currentArr.push(hasImgHeight)
      } else {
        currentArr.push(hasNoImgHeight)
      }
    })
    setItemHeight(currentArr)
  }, [data])
  const renderItem = ({ index, style }) => {
    return (
      <div className={MineEventsStyle.box} key={index} style={{...style, paddingLeft: '0.16rem', width: '100%', paddingTop: '0.16rem', boxSizing: 'border-box'}}>
        <div className={`${MineEventsStyle.top} ${MineEventsStyle.clearfix}`}>
          <img src={data[index]?.creator.avatar} alt="img" />
          <span>{data[index]?.creator.username}</span>
          <button>{data[index]?.channel.name}</button>
        </div>
        <div className={`${MineEventsStyle.title} ${data[index]?.images?.length > 0 ? MineEventsStyle.change : ""}`} onTouchEnd={() => goDetailPage(data[index])}>{data[index]?.name}</div>
        <div className={MineEventsStyle.time}>
          <img src={timeSvg} alt="img" />
          <div>{`${data[index]?.begin_time} - ${data[index]?.end_time}`}</div>
        </div>
        {data[index]?.images?.length > 0 && <img className={MineEventsStyle.descImg} src={data[index]?.images[1]} alt="img" />}
        <div className={`${MineEventsStyle.content} ${data[index]?.images?.length > 0 ? MineEventsStyle.special : ""}`}>{data[index]?.description}</div>
        <div className={MineEventsStyle.bottom}>
          <div>
            <img src={data[index]?.me_going ? checkSvg : checkOutLineGoLikeSvg} alt="img" />
            {data[index]?.me_going ? <span>I am going!</span> : <span>{data[index]?.goings_count} Going</span>}
          </div>
          <div>
            <img src={data[index]?.me_likes ? likeSvg : likeOutLineGoLikeSvg} alt="img" />
            {data[index]?.me_likes ? <span>I like it</span> : <span>{data[index]?.likes_count} Likes</span>}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className={MineEventsStyle.container} ref={boxRef}>
      {currentData?.isSearch ? <SearchResult currentData={currentData} eventsLen={data.length} /> : null}
      <VirtualList height={height} itemCount={data.length} renderItem={renderItem} itemSize={itemHeight.length === data.length ? itemHeight : 100} onScroll={handleScroll} />
      {isLoading ? <Loading /> : null}
      {isShow ? <MineNoEvents ballStyle={{ margin: "1.2rem auto 0" }} pStyle={{ margin: ".14rem auto 0" }} /> : null}
    </div>
  )
})

export default MineEvents
