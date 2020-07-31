import React, {useState, useEffect, useRef} from 'react'
import footerCommentStyle from './footercomment.module.css'
import crossSvg from '../../static/svgs/cross.svg'
import sendSvg from '../../static/svgs/send.svg'

const FooterComment = ({setFlag, replyUser}) => {
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
  return (
    <footer>
      <div className={footerCommentStyle.left}>
        <img src={crossSvg} alt="img" onTouchStart={() => setFlag(true)}/>
        <input type="text" onChange={changeValue} ref={inpRef} value={inpVal}/>
      </div>
      <div className={footerCommentStyle.right}>
        <img src={sendSvg} alt="img"/>
      </div>
    </footer>
  )
}

export default FooterComment
