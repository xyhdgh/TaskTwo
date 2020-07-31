import { useState } from 'react';
import userSvg from '../static/svgs/user.svg'
import passSvg from '../static/svgs/password.svg'
import emailSvg from '../static/svgs/email.svg'

const useUserInfo = () => {
  const [username, setUserName] = useState('')
  const [password, setPassWord] = useState('')
  const [email, setEmail] = useState('')
  return { username, setUserName, password, setPassWord, email, setEmail, userSvg, passSvg, emailSvg }
}

export default useUserInfo