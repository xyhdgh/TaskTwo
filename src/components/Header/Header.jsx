import React, {forwardRef, useImperativeHandle, useRef} from 'react'
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
  return (
    <header ref={headRef}>
      <div className={HeaderStyle.left} onTouchStart={judgeFlag}>
        <img src={props.flag === "search" ? SearchSvg : HomeSvg} alt="img" style={props.style && props.style} />
      </div>
      <div className={HeaderStyle.middle}>
        <img src={LogoCatSvg} alt="img"/>
      </div>
      <div className={HeaderStyle.right} onTouchStart={cancalLogin}></div>
    </header>
  )
})

export default Header