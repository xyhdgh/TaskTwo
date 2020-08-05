import eventPageStyle from './eventpage.module.css'
import React, { useState, useRef, useEffect } from 'react'
import Header from '../../components/Header/Header.jsx'
import infoSvg from '../../static/svgs/info.svg'
import infoSelSvg from '../../static/svgs/info_sel.svg'
import peopleSvg from '../../static/svgs/people.svg'
import peopleSelSvg from '../../static/svgs/people-sel.svg'
import commentOutlineSvg from '../../static/svgs/comment-outline.svg'
import commentOutlineSelSvg from '../../static/svgs/comment-outline-sel.svg'
import dateToSvg from '../../static/svgs/date-to.svg'
import dateFromSvg from '../../static/svgs/date-from.svg'
import checkOutLineSvg from '../../static/svgs/check-outline-golike.svg'
import likeOutLineSvg from '../../static/svgs/like-outline-golike.svg'
import replySvg from '../../static/svgs/reply.svg'
import commentSingleSvg from '../../static/svgs/comment-single.svg'
import likeOutLineOneSvg from '../../static/svgs/like-outline-sel-one.svg'
import checkOutLineOneSvg from '../../static/svgs/check-outline-one.svg'
import checkOneSvg from '../../static/svgs/check-one.svg'
import likeOneSvg from '../../static/svgs/like-one.svg'
import { withRouter } from 'react-router-dom'
import FooterComment from '../../components/FooterComment/FooterComment.jsx'
import { get_event_detail } from '../../api/http.js'
import Loading from '../../components/Loading/Loading.jsx'
import { getCurrentStamp, initialTime } from '../../util/getTime.js'
import { get_event_participants, join_event_participants, cancel_event_participants, get_event_comments, get_event_likes, post_event_likes, cancel_event_likes } from '../../api/http.js'

const EventPage = withRouter(({ match }) => {
  const [tabInfo, setTabInfo] = useState([
    {
      id: 1,
      svg: infoSvg,
      message: 'Details',
      isActive: true,
      defaultSvg: infoSelSvg,
      tempSvg: infoSvg
    },
    {
      id: 2,
      svg: peopleSvg,
      message: 'Participants',
      isActive: false,
      defaultSvg: peopleSelSvg,
      tempSvg: peopleSvg
    },
    {
      id: 3,
      svg: commentOutlineSvg,
      message: 'Comments',
      isActive: false,
      defaultSvg: commentOutlineSelSvg,
      tempSvg: commentOutlineSvg
    }
  ])
  let offset = 0;
  let limit = 25;
  // 点击按钮展开描述
  const [showDesc, setShowDesc] = useState(false)
  // 评论内容
  const [comments, setComments] = useState([])
  // 存储participants数组
  const [partUsers, setPartUsers] = useState([])
  // 存储likes数组
  const [likeUsers, setLikeUsers] = useState([])
  // 存储join状态
  const [joinStatus, setJoinStatus] = useState(false)
  // 存储点赞状态
  const [thumbsUp, setThumbsUp] = useState(false)
  // 获取滑动框
  const scrollRef = useRef()
  // 获取指定元素
  const partRef = useRef()
  // 获取header
  let headerRef = useRef()
  // 切换组件的标示
  const [flag, setFlag] = useState(true)
  // 存储回复人的名字
  const [replyUser, setReplyUser] = useState("")
  let eventsRef = useRef()
  // 获取评论区距离
  let commentRef = useRef()
  // let htmlFontSize = parseFloat(document.documentElement.style.fontSize); // 100
  const [isLoading, setIsLoading] = useState(false)
  // 请求数据
  const [event, setEvent] = useState({})
  const [showStatistical, setShowStatistical] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const checkTab = async ({ id }) => {
    let token = sessionStorage.getItem('token')
    const currentArr = [...tabInfo]
    currentArr.forEach((item) => {
      item.isActive = false
      if (item.id === id) {
        item.isActive = true
      }
    })
    setTabInfo(currentArr)
    if (id === 1) {
      console.log('details...');
    } else if (id === 2) {
      await new Promise((resolve, reject) => {
        // 请求...
        get_event_participants(`/events/${match.params.id}/participants`, token).then(res => {
          if (res.status === 200) {
            setPartUsers(res.data.users)
            resolve()
          }
        }).catch(err => reject(err))
      })

      await new Promise((resolve, reject) => {
        get_event_likes(`/events/${match.params.id}/likes`, { offset, limit }, token).then(res => {
          if (res.status === 200) {
            console.log(res.data);
            setShowStatistical(true)
            setLikeUsers(res.data.users)
            resolve()
          }
        }).catch(err => reject(err))
      })
    } else if (id === 3) {
      get_event_comments(`/events/${match.params.id}/comments`, { offset, limit }, token).then(res => {
        if (res.status === 200) {
          setComments(res.data.comments)
          setShowComments(true)
        }
      }).catch(err => Promise.reject(err))
    }
  }
  // 请求...
  useEffect(() => {
    let token = sessionStorage.getItem('token')
    let id = match.params.id
    setIsLoading(true)
    if (token) {
      get_event_detail('/events/' + id, token).then(res => {
        if (res.status === 200) {
          setJoinStatus(res.data.event.me_going)
          setThumbsUp(res.data.event.me_likes)
          setIsLoading(false)
          let currentData = { ...res.data.event }
          // 获取时间差
          let stampDiff;
          let create_stamp = new Date(res.data.event.create_time).getTime()
          stampDiff = getCurrentStamp() - create_stamp
          let dayDiff = (stampDiff / (1000 * 3600 * 24)).toFixed(2)
          currentData['day_diff'] = dayDiff
          // 获取时间标准格式
          let create_time = initialTime(new Date(res.data.event.create_time).toString())
          let end_time = initialTime(new Date(res.data.event.end_time).toString())
          currentData['create_time'] = create_time
          currentData['end_time'] = end_time
          setEvent(currentData)
        }
      }).catch(err => Promise.reject(err))
    }
  }, [])
  const handleGo = () => {
    let token = sessionStorage.getItem('token')
    if (joinStatus) {
      cancel_event_participants(`/events/${match.params.id}/participants`, token)
        .then(res => {
          if (res) {
            setJoinStatus(false)
          }
        }).catch(err => Promise.reject(err))
    } else {
      join_event_participants(`/events/${match.params.id}/participants`, token)
        .then(res => {
          if (res.status === 200) {
            setJoinStatus(true)
          }
        }).catch(err => Promise.reject(err))
    }
  }
  const handleHumbsUp = () => {
    if (!joinStatus) {
      return
    } else {
      let token = sessionStorage.getItem('token')
      // 请求...
      if (thumbsUp) {
        cancel_event_likes(`/events/${match.params.id}/likes`, token).then(res => {
          if (res.status === 200) {
            setThumbsUp(false)
          }
        }).catch(err => Promise.reject(err))
      } else {
        post_event_likes(`/events/${match.params.id}/likes`, token).then(res => {
          if (res.status === 200) {
            setThumbsUp(true)
          }
        }).catch(err => Promise.reject(err))
      }
    }
  }
  const handleComment = () => {
    if (!joinStatus) {
      return
    } else {
      setFlag(false)
      setReplyUser("")
    }
  }
  const reply = ({ user }) => {
    if (!joinStatus) {
      return
    } else {
      if (flag) {
        setFlag(false)
      }
      setReplyUser(`@${user.username}`)
    }
  }
  const handleScroll = () => {
    // 没有下拉加载的数据
    // if (showComments && showStatistical) {
    //   let eventsHeight = eventsRef.current.offsetHeight + htmlFontSize * 2.4;
    //   let clientHeight = scrollRef.current.offsetHeight
    //   let scrollTop = e.target.scrollTop
    //   // console.log(scrollTop, clientHeight, eventsHeight);
    //   if (scrollTop + clientHeight > eventsHeight - 10) {
    //     console.log('触底了');
    //   }
    // }
  }
  return (
    <div className={eventPageStyle.container} >
      <Header ref={headerRef}></Header>
      {isLoading ? <Loading /> : (<div className={eventPageStyle.content} ref={scrollRef} onScroll={handleScroll}>
        <div className={eventPageStyle.top}>
          <div className={eventPageStyle.channel}>{event.channel?.name}</div>
          <p className={eventPageStyle.title}>{event.name}</p>
          <div className={eventPageStyle.desc}>
            <img className={eventPageStyle.left} alt="img" src={event.creator?.avatar} />
            <div className={eventPageStyle.right}>
              <p>{event.creator?.username}</p>
              <p>Published {event.day_diff} days ago</p>
            </div>
          </div>
        </div>
        <div className={eventPageStyle.tabList}>
          <ul>
            {tabInfo.map((tab) => {
              return (
                <li key={tab.id} onTouchStart={() => checkTab(tab)}>
                  <img src={tab.isActive ? tab.defaultSvg : tab.tempSvg} alt="img" />
                  <span className={tab.isActive ? eventPageStyle.active : ""}>{tab.message}</span>
                </li>
              )
            })}
          </ul>
        </div>
        <div className={eventPageStyle.tabEvents} ref={eventsRef}>
          <div className={eventPageStyle.wrapper}>
            <ul className={eventPageStyle.clearfix}>
              {event.images?.map((img, idx) => {
                return (
                  <li key={idx}>
                    <img src={img} alt="img" />
                  </li>
                )
              })}
            </ul>
          </div>
          <div className={eventPageStyle.information}>
            {event.description}
            {showDesc ? "" : <div className={eventPageStyle.dimMask}>
              <button className={eventPageStyle.viewAll} onTouchStart={() => setShowDesc(true)} >VIEW ALL</button>
            </div>}
          </div>
          <div className={eventPageStyle.planTime}>
            <div className={eventPageStyle.specificTime}>When</div>
            <div className={eventPageStyle.allTime}>
              <div className={eventPageStyle.allLeft}>
                <img src={dateFromSvg} alt="img" />
                <span>{event.create_time?.finished_time}</span>
                <span>
                  {event.create_time?.str}&nbsp;
                  <span>{event.create_time?.ap}</span>
                </span>
              </div>
              <div className={eventPageStyle.allRight}>
                <img src={dateToSvg} alt="img" />
                <span>{event.end_time?.finished_time}</span>
              </div>
            </div>
          </div>
          <div className={eventPageStyle.planPlace}>
            <div className={eventPageStyle.specificPlace}>Where</div>
            <div className={eventPageStyle.placeMes}>
              {event.location}<br />
              <p>{event.location_detail}</p>
            </div>
            <div className={eventPageStyle.map}></div>
          </div>
          {showStatistical ? <div className={eventPageStyle.statistical} ref={partRef}>
            <div className={eventPageStyle.goLikeWrapper}>
              <div className={`${eventPageStyle.wrapperTop} ${eventPageStyle.clearfix}`}>
                <div className={eventPageStyle.wrapperTopLeft}>
                  <img src={checkOutLineSvg} alt="img" />
                  <span>{partUsers.length} going</span>
                </div>
                <div className={eventPageStyle.wrapperTopRight}>
                  <ul>
                    {partUsers.map(user => {
                      return (
                        <li key={user.id}>
                          <img src={user.avatar} alt="img" />
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
              <div className={`${eventPageStyle.wrapperBottom} ${eventPageStyle.clearfix}`}>
                <div className={eventPageStyle.wrapperBottomLeft}>
                  <img src={likeOutLineSvg} alt="img" />
                  <span>{likeUsers.length} likes</span>
                </div>
                <div className={eventPageStyle.wrapperBottomRight}>
                  <ul>
                    {likeUsers.map(user => {
                      return (
                        <li key={user.id}>
                          <img src={user.avatar} alt="img"/>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div> : null}
          {showComments ? <div className={eventPageStyle.commentsSection} ref={commentRef}>
            {comments.map((comment) => {
              return (
                <div key={comment.id} className={eventPageStyle.commentAll}>
                  <div className={eventPageStyle.commentAvator}>
                    <img src={comment.user.avatar} alt="img" />
                  </div>
                  <div className={eventPageStyle.main}>
                    <div className={eventPageStyle.userInfo}>
                      <div className={eventPageStyle.username}>{comment.user.username}</div>
                      <div className={eventPageStyle.replyTime}>{comment.create_time}</div>
                      <img src={replySvg} alt="img" onTouchStart={() => reply(comment)} />
                    </div>
                    <div className={eventPageStyle.commentContent}>{comment.comment}</div>
                  </div>
                </div>
              )
            })}
          </div> : null}
        </div>
      </div>)}
      {/* 底部按钮 */}
      {flag ? <footer>
        <div className={eventPageStyle.footLeft}>
          <img src={commentSingleSvg} alt="img" onTouchStart={handleComment} />
          <img src={thumbsUp ? likeOneSvg : likeOutLineOneSvg} alt="img" onTouchStart={handleHumbsUp} />
        </div>
        <div className={eventPageStyle.footRight} onTouchStart={() => handleGo()}>
          <img src={joinStatus ? checkOneSvg : checkOutLineOneSvg} alt="img" className={joinStatus ? eventPageStyle.sel : ""} />
          <span className={joinStatus ? eventPageStyle.join : ""}>{joinStatus ? "I am going" : "Join"}</span>
        </div>
      </footer> : <FooterComment setFlag={setFlag} replyUser={replyUser} id={match.params.id} />}
    </div>
  )
})

export default EventPage
