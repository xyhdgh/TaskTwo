const beautyTime = (time) => {
  let currentTime = new Date(time)
  let currentArr = currentTime.toString().split(" ") // [Wed, Jul, 29, 2020, 12:13:53, GMT+0800, (中国标准时间)]
  let beginArr = []
  beginArr.push(currentArr[2])
  beginArr.push(currentArr[1])
  beginArr.push(currentArr[3])
  beginArr.push(currentArr[4].slice(0, 5))
  return beginArr.join(" ")
}

export default beautyTime