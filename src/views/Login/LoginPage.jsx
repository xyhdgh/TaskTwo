import React, {useState} from 'react'
import LoginStyle from './login.module.css'
import { login } from '../../api/http.js'
import LogOrRegInput from '../../components/LogOrRegInput/LogOrRegInput.jsx'
import useUserInfo from '../../hooks/useUserInfo.js'
import { useHistory } from 'react-router-dom'

const LoginPage = () => {
  const {username, setUserName, password, setPassWord, userSvg, passSvg} = useUserInfo()
  const [user, setUser] = useState({})
  const history = useHistory()
  const handleLogin = () => {
    let data = login('/auth/token', {username, password})
    data.then(v => {
      sessionStorage.setItem('user', JSON.stringify(v.data.user))
      sessionStorage.setItem('token', v.data.token)
      setUser(v.data.user)
      history.push('/')
    }).catch(err => {
      Promise.reject(err)
    })
  }
  return (
    <div className={LoginStyle.container}>
      <div className={LoginStyle.mosk}>
        <div className={LoginStyle.main}>
          <span className={LoginStyle.title}>FIND THE MOST LOVED ACTIVITIES</span>
          <p>BLACK CAT</p>
          <div className={LoginStyle.logo} onTouchStart={() => history.push('/register')}>
            <div className={LoginStyle.center}></div>
          </div>
          <form>
            <LogOrRegInput id={"username"} placeholder={"Username"} svg={userSvg} setHook={setUserName} />
            <LogOrRegInput id={"password"} placeholder={"Password"} svg={passSvg} setHook={setPassWord} />
          </form>
        </div>
        <footer onTouchStart={handleLogin}>
          <div className={LoginStyle.content}>SIGN IN</div>
        </footer>
      </div>
    </div>
  )
}

export default LoginPage