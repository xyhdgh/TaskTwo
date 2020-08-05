import React, {forwardRef, useImperativeHandle, useRef, useEffect, useState} from 'react'
import HeaderStyle from './Header.module.css'
import HomeSvg from '../../static/svgs/home.svg'
import LogoCatSvg from '../../static/svgs/logo-cat.svg'
import SearchSvg from '../../static/svgs/search.svg'
import {useHistory} from 'react-router-dom'
import {cancel_login} from '../../api/http.js'

const Header = forwardRef((props, ref) => {
  const headRef = useRef()
  useImperativeHandle(ref, () => ({
    headHeight: headRef.current.offsetHeight
  }), [])
  const [avatar, setAvatar] = useState('')
  const history = useHistory()
  const judgeFlag = () => {
    if (props.flag === "search") {
      return
    } else {
      history.push('/')
    }
  }
  const cancalLogin = () => {
    let token = sessionStorage.getItem('token')
    if (token) {
      let res = cancel_login('/auth/token', token)
      res.then(v => {
        if (v.status === 200) {
          sessionStorage.removeItem('token')
          history.push('/login')
        }
      }).catch(err => Promise.reject(err))
    }
  }
  const goMinePage = () => {
    history.push('/mine')
  }
  useEffect(() => {
    let token = sessionStorage.getItem('token')
    if (token) {
      const user = JSON.parse(sessionStorage.getItem('user'))
      setAvatar(user.avatar)
    } else {
      return
    }
  }, [])

  return (
    <header ref={headRef}>
      <div className={HeaderStyle.left} onTouchStart={judgeFlag}>
        <img src={props.flag === "search" ? SearchSvg : HomeSvg} alt="img" style={props.style && props.style} />
      </div>
      <div className={HeaderStyle.middle} onTouchStart={cancalLogin}>
        <img src={LogoCatSvg} alt="img"/>
      </div>
      <div className={HeaderStyle.right} onTouchStart={goMinePage}>
        <img src={avatar} alt="img"/>
      </div>
    </header>
  )
})

export default Header