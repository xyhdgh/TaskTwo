import React from 'react';
import RegisterStyle from './register.module.css';
import LogOrRegInput from '../../components/LogOrRegInput/LogOrRegInput.jsx';
import useUserInfo from '../../hooks/useUserInfo.js';
import { register } from '../../api/http.js';
import avatar from '../../static/imgs/avatar.jpg';
import { useHistory } from 'react-router-dom'

const RegisterPage = () => {
  const { username, setUserName, password, setPassWord, email, setEmail, userSvg, passSvg, emailSvg } = useUserInfo()
  const history = useHistory()
  const handleRegister = () => {
    register('/join', { username, password, email, avatar }).then(res => {
      if (res.status === 200) {
        sessionStorage.setItem('token', res.data.token)
        history.goBack()
      }
    }).catch(err => {
      if (err.response) {
        let code = err.response.status
        switch (code) {
          case 400:
            console.log('Username or password missing');
            break;
          case 403:
            console.log('Username already exists');
            break;
          default: 
            break;
        }
      }
      return Promise.reject(err)
    })
  }
  return (
    <div className={RegisterStyle.container}>
      <header>
        <div onTouchStart={() => history.goBack()}></div>
        <p>BRAND</p>
      </header>
      <div className={RegisterStyle.content}>
        <form>
          <LogOrRegInput id={"username"} placeholder={"Username"} svg={userSvg} setHook={setUserName} />
          <LogOrRegInput id={"password"} placeholder={"Password"} svg={passSvg} setHook={setPassWord} />
          <LogOrRegInput id={"email"} placeholder={"Email"} svg={emailSvg} setHook={setEmail} />
        </form>
      </div>
      <footer onTouchStart={handleRegister} className={RegisterStyle.footer}>Register</footer>
    </div>
  )
}

export default RegisterPage
