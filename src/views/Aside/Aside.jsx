import React, { forwardRef, useState, useRef, useImperativeHandle } from 'react'
import AsideStyle from './aside.module.css'
import search from '../../static/svgs/search-aside.svg'
import SearchBox from '../../components/SearchBox/SearchBox.jsx'
import { useEffect } from 'react'
import { get_channels } from '../../api/http.js'
import { getTodayStartStamp, getTodayEndStamp, getTomStartStamp, getTomEndStamp, getWeekStartStamp, getWeekEndStamp, getMonthStartStamp, getMonthEndStamp, getCurrentTime } from '../../util/getTime.js'

const Aside = forwardRef(({ handleSearch }, ref) => {
  const [timeList, setTimeList] = useState([
    {
      id: 1,
      isSel: false,
      time: "ANYTIME"
    },
    {
      id: 2,
      isSel: false,
      time: "TODAY"
    },
    {
      id: 3,
      isSel: false,
      time: "TOMORROW"
    },
    {
      id: 4,
      isSel: false,
      time: "THIS WEEK"
    },
    {
      id: 5,
      isSel: false,
      time: "THIS MONTH"
    },
    {
      id: 6,
      isSel: false,
      time: "LATER"
    },
  ])
  const [channels, setChannels] = useState([])
  const [allSel, setAllSel] = useState(false)
  // 点击channel的名字
  const [channel, setChannel] = useState("")
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const selfRef = useRef(null)
  // 开始时间戳
  const [startStamp, setStartStamp] = useState()
  // 结束时间戳
  const [endStamp, setEndStamp] = useState()
  // serachbox状态
  const [showSearchBox, setShowSearchBox] = useState(false)
  // 管理button提示的状态
  const [buttonTip, setButtonTip] = useState('')
  // 管理传参的数据
  const [filterData, setFilterData] = useState({})
  // 过滤状态
  const [isSearch, setIsSearch] = useState(false)
  useImperativeHandle(ref, () => {
    return {
      selfRef,
      filterData,
      isSearch
    }
  }, [filterData])
  useEffect(() => {
    let token = sessionStorage.getItem('token')
    get_channels('/channels', token).then(res => {
      if (res.status === 200) {
        let channels = res.data.channels;
        let currentArr = [...channels]
        currentArr.forEach(channel => {
          channel['isSel'] = false
        })
        let insert_obj = {
          id: currentArr.length + 1,
          name: "All",
          isSel: false
        }
        currentArr.unshift(insert_obj)
        setChannels(currentArr)
      }
    }).catch(err => Promise.reject(err))
  }, [])
  useEffect(() => {
    let start = getCurrentTime(startStamp)
    let end = getCurrentTime(endStamp)
    setStartTime(`${start.day}/${start.month}`)
    setEndTime(`${end.day}/${end.month}`)
  }, [startStamp, endStamp])
  const selTime = ({id, time}) => {
    switch (id) {
      case 1:
        setStartStamp('')
        setEndStamp('')
        setShowSearchBox(false)
        setButtonTip(time)
        break
      case 2:
        setStartStamp(getTodayStartStamp())
        setEndStamp(getTodayEndStamp())
        setShowSearchBox(false)
        setButtonTip(time)
        break
      case 3:
        setStartStamp(getTomStartStamp())
        setEndStamp(getTomEndStamp())
        setShowSearchBox(false)
        setButtonTip(time)
        break
      case 4:
        setStartStamp(getWeekStartStamp())
        setEndStamp(getWeekEndStamp())
        setShowSearchBox(false)
        setButtonTip(time)
        break
      case 5:
        setStartStamp(getMonthStartStamp())
        setEndStamp(getMonthEndStamp())
        setShowSearchBox(false)
        setButtonTip(time)
        break
      case 6:
        setShowSearchBox(true)
    }
    const currentList = [...timeList]
    currentList.forEach(time => {
      time.isSel = false
      if (time.id === id) {
        time.isSel = true
      }
    })
    setTimeList(currentList)
  }
  const selChannel = ({ id, name }) => {
    const currentList = [...channels]
    let allStatus = currentList[0].isSel
    currentList.forEach((channel) => {
      // 点击的是All 全选
      if (id === currentList.length) {
        channel.isSel = !allStatus
      } else {
        // 点击其余的 会多选
        if (channel.id === id) {
          channel.isSel = !channel.isSel
        }
      }
    })
    setChannels(currentList)
    setChannel(name)
  }
  useEffect(() => {
    let isTimeSel = timeList.some(({ isSel }) => {
      return isSel === true
    })
    let isTodoSel = channels.some(({ isSel }) => {
      return isSel === true
    })
    if (isTimeSel && isTodoSel) {
      setAllSel(true)
    } else {
      setAllSel(false)
    }
  }, [timeList, channels])
  const searchFunc = () => {
    if (allSel) {
      // 创建过滤对象
      let filter_obj = {}
      let id_arr = [];
      channels.forEach(val => {
        if (val.isSel && val.id !== 11) {
          id_arr.push(val.id)
        }
      })
      // 获取channel的id字符串
      let id_str = id_arr.join(',')
      filter_obj['channels'] = id_str
      filter_obj['after'] = startStamp
      filter_obj['end'] = endStamp
      setFilterData(filter_obj)
      handleSearch()
      setIsSearch(true)
    }
  }
  return (
    <aside ref={selfRef}>
      <div className={AsideStyle.main}>
        <div className={AsideStyle.topTitle}>
          DATE
        </div>
        <div className={AsideStyle.topContent}>
          <ul>
            {timeList.map(time => {
              return <li key={time.id} className={time.isSel ? AsideStyle.sel : ""} onTouchStart={() => selTime(time)}>{time.time}</li>
            })}
          </ul>
          {showSearchBox ? <SearchBox setStartStamp={setStartStamp} setEndStamp={setEndStamp} startTime={startTime} endTime={endTime} setButtonTip={setButtonTip}/> : null}
        </div>
        <div className={AsideStyle.middleTitle}>
          CHANNEL
        </div>
        <div className={AsideStyle.middleContent}>
          <ul>
            {channels.map(channel => {
              return <li key={channel.id} className={channel.isSel ? AsideStyle.todoSel : ""} onTouchStart={() => selChannel(channel)}>{channel.name}</li>
            })}
          </ul>
        </div>
      </div>
      <div className={`${AsideStyle.button} ${allSel ? AsideStyle.highLight : ""}`} onTouchStart={() => searchFunc()}>
        <img src={search} alt="img" className={allSel ? AsideStyle.move : ""} />
        <span className={allSel ? AsideStyle.move : ""}>SEARCH</span>
        <p className={allSel ? AsideStyle.show : ""}>{channel} activities {buttonTip}</p>
      </div>
    </aside>
  )
})

export default Aside