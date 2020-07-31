import {useEffect, useState} from 'react'

const useLoading = (time) => {
  const [isLoading, setIsLoading] = useState(false)
  const clearLoading = () => {
    return setTimeout(() => {
      // console.log(time)
      setIsLoading(false)
    }, time)
  }
  useEffect(() => {
    setIsLoading(true)
    let timer;
    timer = clearLoading()
    return () => {
      clearTimeout(timer)
    }
  }, [])
  return {isLoading, setIsLoading, clearLoading}
}

export default useLoading