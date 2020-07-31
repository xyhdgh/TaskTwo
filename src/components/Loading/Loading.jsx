import React, {useRef, useEffect} from 'react'
import loadingStyle from './loading.module.css'

const Loading = () => {
  const loadingRef = useRef(null)
  useEffect(() => {
    const stop = e => {
      e.preventDefault()
    }
    loadingRef.current.addEventListener('touchmove', stop, false)
    return () => {
      loadingRef.current.removeEventListener('touchmove', stop, false)
    }
  }, [])
  return (
    <div className={loadingStyle.container} ref={loadingRef}>
      <div className={loadingStyle.box}>
        <div className={loadingStyle.rotate}></div>
      </div>
    </div>
  )
}

export default Loading
