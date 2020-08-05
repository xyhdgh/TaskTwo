import React, {useState, useEffect, useRef} from 'react'
import footerCommentStyle from './footercomment.module.css'
import crossSvg from '../../static/svgs/cross.svg'
import sendSvg from '../../static/svgs/send.svg'
import { post_event_comments } from '../../api/http.js'

const FooterComment = ({setFlag, replyUser, id}) => {
  const [inpVal, setInpVal] = useState("")
  const changeValue = (e) => {
    setInpVal(e.target.value)
  }
  const inpRef = useRef()
  useEffect(() => {
    if (replyUser) {
      inpRef.current.focus()
      setInpVal(replyUser)
    }
  }, [replyUser])
  const handleSend = () => {
    let token = sessionStorage.getItem('token')
    if (inpRef.current.value === "") {
      return
    } else {
      post_event_comments(`/events/${id}/comments`, {
        comment: inpRef.current.value
      }, token).then(res => {
        console.log(res);
      }).catch(err => Promise.reject(err))
    }
  }
  return (
    <footer>
      <div className={footerCommentStyle.left}>
        <img src={crossSvg} alt="img" onTouchStart={() => setFlag(true)}/>
        <input type="text" onChange={changeValue} ref={inpRef} value={inpVal} placeholder='Leave your comment here'/>
      </div>
      <div className={footerCommentStyle.right}>
        <img src={sendSvg} alt="img" onTouchStart={handleSend} />
      </div>
    </footer>
  )
}

export default FooterComment
