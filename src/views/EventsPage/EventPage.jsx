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
import {withRouter} from 'react-router-dom'
import FooterComment from '../../components/FooterComment/FooterComment.jsx'
import { get_event_detail } from '../../api/http.js'
import Loading from '../../components/Loading/Loading.jsx'
import {getCurrentStamp, initialTime} from '../../util/getTime.js'
import {get_event_participants} from '../../api/http.js'

const EventPage = withRouter(({match}) => {
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
  // 点击按钮展开描述
  const [showDesc, setShowDesc] = useState(false)
  // 评论内容
  const [comments, setComments] = useState([
    {
      id: 1,
      avator: "",
      username: "Little Prince",
      publish_time: "9 hours ago",
      replySvg: replySvg,
      comment: "Nullam ut tincidunt nunc. Petus lacus, commodo eget justo ut, rutrum varius nunc."
    },
    {
      id: 2,
      avator: "",
      username: "Little Princess",
      publish_time: "9 hours ago",
      replySvg: replySvg,
      comment: "Petus lacus, commodo!!"
    },
    {
      id: 3,
      avator: "",
      username: "Little Princess",
      publish_time: "1 hours ago",
      replySvg: replySvg,
      comment: "Petus lacus, commodo!!"
    },
    {
      id: 4,
      avator: "Petus lacus, commodo!!",
      username: "Little Princess",
      publish_time: "9 hours ago",
      replySvg: replySvg,
      comment: "Petus lacus, commodo!!"
    },
    {
      id: 5,
      avator: "",
      username: "Little Princess",
      publish_time: "1 hours ago",
      replySvg: replySvg,
      comment: "Petus lacus, commodo!!"
    },
    {
      id: 6,
      avator: "",
      username: "Little Princess",
      publish_time: "1 hours ago",
      replySvg: replySvg,
      comment: "Petus lacus, commodo!!"
    },
    {
      id: 7,
      avator: "",
      username: "Little Princess",
      publish_time: "1 hours ago",
      replySvg: replySvg,
      comment: "Petus lacus, commodo!!"
    },
    {
      id: 8,
      avator: "",
      username: "Little Princess",
      publish_time: "1 hours ago",
      replySvg: replySvg,
      comment: "Petus lacus, commodo!!"
    },
    {
      id: 9,
      avator: "",
      username: "Little Princess",
      publish_time: "1 hours ago",
      replySvg: replySvg,
      comment: "Petus lacus, commodo!!"
    },
    {
      id: 10,
      avator: "",
      username: "Little Princess",
      publish_time: "1 hours ago",
      replySvg: replySvg,
      comment: "Petus lacus, commodo!!"
    },
    {
      id: 11,
      avator: "",
      username: "Little Princess",
      publish_time: "1 hours ago",
      replySvg: replySvg,
      comment: "Petus lacus, commodo!!"
    }
  ])
  // 存储participants数组
  const [partUsers, setPartUsers] = useState([])
  // 存储join状态
  const [joinStatus, setJoinStatus] = useState(false)
  // 存储点赞状态
  const [thumbsUp, setThumbsUp] = useState(false)
  // 存储partRef距离顶部的距离
  const [partHeight, setPartHeight] = useState(0)
  // 获取滑动框
  const scrollRef = useRef()
  // 获取指定元素
  const partRef = useRef()
  // 获取header
  let headerRef = useRef()
  // 存储header高度
  const [headHeight, setHeadHeight] = useState(0)
  // 存储tab高度
  let [tabHeight, setTabHeight] = useState(0)
  // 获取tabUl
  let tabRef = useRef()
  // 获取tabList距顶部距离
  const [tablistTop, setTablistTop] = useState(0)
  // 切换组件的标示
  const [flag, setFlag] = useState(true)
  // 存储回复人的名字
  const [replyUser, setReplyUser] = useState("")
  let eventsRef = useRef()
  // 获取评论区距离
  let commentRef = useRef()
  // 存储评论区距顶部高度
  const [commentHeight, setCommentHeight] = useState(0)
  let htmlFontSize = document.documentElement.style.fontSize; // 100
  const [isLoading, setIsLoading] = useState(false)
  // 请求数据
  const [event, setEvent] = useState({})
  // 区分tab样式
  const diffTab = (num) => {
    const currentTabArr = [...tabInfo]
    currentTabArr.forEach(tab => {
      tab.isActive = false
      if (tab.id === num) {
        tab.isActive = true
      }
    })
    setTabInfo(currentTabArr)
  }
  // 滚动事件
  const handleScroll = e => {
    let scrollTop = e.target.scrollTop;
    let commentOffsetTop = commentRef.current.offsetTop;
    setCommentHeight(commentOffsetTop)
    let headHeight = headerRef.current.headHeight;
    setHeadHeight(headHeight)
    let partOffsetTop = partRef.current.offsetTop;
    setPartHeight(partOffsetTop)
    let tabHeight = tabRef.current.offsetHeight;
    setTabHeight(tabHeight)
    const partDiff = partOffsetTop - scrollTop - headHeight - tabHeight;
    const commentDiff = commentOffsetTop - scrollTop - headHeight - tabHeight;
    if (partDiff > 0) { // 第一个tab
      diffTab(1)
    }
    if (partDiff < 0 || partDiff === 0) { // 第二个tab
      diffTab(2)
    }
    if (commentDiff < parseInt(htmlFontSize) * 0.24 || commentDiff === parseInt(htmlFontSize) * 0.24) { // 第三个tab
      diffTab(3)
    } 
  }
  useEffect(() => {
    scrollRef.current.addEventListener('scroll', handleScroll, false)
    return () => {
      scrollRef.current.removeEventListener('scroll', handleScroll, false)
    }
  }, [])
  const checkTab = ({ id }) => {
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
      scrollRef.current.scrollTop = tablistTop;
    } else if (id === 2) {
      scrollRef.current.scrollTop = partHeight - tabHeight - headHeight;
      // 请求...
      get_event_participants(`/events/${match.params.id}/participants`, token).then(res => {
        if (res.status === 200) {
          console.log(res);
          setPartUsers(res.data.users)
          // console.log(partUsers);
        }
      }).catch(err => Promise.reject(err))
    } else if (id === 3) {
      scrollRef.current.scrollTop = commentHeight - tabHeight - headHeight - parseInt(htmlFontSize) * .24;
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
          setIsLoading(false)
          let currentData = {...res.data.event}
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
          // console.log('currentData::', currentData);
          setEvent(currentData)
        }
      }).catch(err => Promise.reject(err))
    }
  }, [])
  const handleGo = () => {
    // console.log(match.params.id);
    // 请求...
    setJoinStatus(true)
  }
  const handleHumbsUp = () => {
    if (!joinStatus) {
      return
    } else {
      // console.log(match.params.id);
      // 请求...
      setThumbsUp(!thumbsUp)
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
  const reply = ({username}) => {
    if (!joinStatus) {
      return
    } else {
      if (flag) {
        setFlag(false)
      }
      setReplyUser(`@${username}`)
    }
  }
  return (
    <div className={eventPageStyle.container} >
      <Header ref={headerRef}></Header>
      <div className={eventPageStyle.content} ref={scrollRef}>
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
        <div className={eventPageStyle.tabList} ref={tabRef}>
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
                    <img src={img} alt="img"/>
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
          <div className={eventPageStyle.statistical} ref={partRef}>
            <div className={eventPageStyle.goLikeWrapper}>
              <div className={eventPageStyle.wrapperTop}>
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
              <div className={eventPageStyle.wrapperBottom}>
                <div className={eventPageStyle.wrapperBottomLeft}>
                  <img src={likeOutLineSvg} alt="img" />
                  <span>7 likes</span>
                </div>
                <div className={eventPageStyle.wrapperBottomRight}>
                  <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className={eventPageStyle.commentsSection} ref={commentRef}>
            {comments.map((comment) => {
              return (
                <div key={comment.id} className={eventPageStyle.commentAll}>
                  <div className={eventPageStyle.commentAvator}></div>
                  <div className={eventPageStyle.main}>
                    <div className={eventPageStyle.userInfo}>
                      <div className={eventPageStyle.username}>{comment.username}</div>
                      <div className={eventPageStyle.replyTime}>{comment.publish_time}</div>
                      <img src={comment.replySvg} alt="img" onTouchStart={() => reply(comment)}/>
                    </div>
                    <div className={eventPageStyle.commentContent}>{comment.comment}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {/* 底部按钮 */}
      {flag ? <footer>
        <div className={eventPageStyle.footLeft}>
          <img src={commentSingleSvg} alt="img" onTouchStart={handleComment}/>
          <img src={thumbsUp ? likeOneSvg : likeOutLineOneSvg} alt="img" onTouchStart={handleHumbsUp}/>
        </div>
        <div className={eventPageStyle.footRight} onTouchStart={() => handleGo()}>
          <img src={joinStatus ? checkOneSvg : checkOutLineOneSvg} alt="img" className={joinStatus ? eventPageStyle.sel : ""} />
          <span className={joinStatus ? eventPageStyle.join : ""}>{joinStatus ? "I am going" : "Join"}</span>
        </div>
      </footer> : <FooterComment setFlag={setFlag} replyUser={replyUser} />}
      {isLoading ? <Loading /> : null}
    </div>
  )
})

export default EventPage
