let now = new Date()
let year = now.getFullYear()
let month = now.getMonth() + 1
let day = now.getDate()
let weekDay = now.getDay()
/**
 * 获取本周第一天时间戳
 */
export const getWeekStartStamp = () => {
  if (weekDay === 0) {
    weekDay = 7
  }
  // 今天零时的时间戳
  let stamp = new Date(`${year}-${month}-${day} 00:00:00`).getTime()
  let firstStamp = stamp - ((weekDay - 1) * 24 * 3600 * 1000)
  return firstStamp
}

/**
 * 获取本周最后一天时间戳
 */
export const getWeekEndStamp = () => {
  if (weekDay === 0) {
    weekDay = 7
  }
  // 今天零时的时间戳
  let stamp = new Date(`${year}-${month}-${day} 00:00:00`).getTime()
  // 周日23时59分59秒时间戳
  let lastStamp = stamp + (7 * 24 * 3600 * 1000) - 1000
  return lastStamp
}

/**
 * 获取本月第一天的时间戳
 */
export const getMonthStartStamp = () => {
  let firstDay = `${year}-${month}-1 00:00:00`
  return new Date(firstDay).getTime()
}

/**
 * 获取本月最后一天的时间戳
 */
export const getMonthEndStamp = () => {
  // 下个月的第一天
  if (month > 11) {
    year += 1
  }
  let lastDay = `${year}-${month + 1}-1`
  return new Date(`${lastDay} 00:00:00`).getTime() - 1000
}

/**
 * 获取今天零时的时间戳
 */
export const getTodayStartStamp = () => {
  return new Date(`${year}-${month}-${day} 00:00:00`).getTime()
}

/**
 * 获取今天23时59分59秒时间戳
 */
export const getTodayEndStamp = () => {
  return new Date(`${year}-${month}-${day} 23:59:59`).getTime()
}

/**
 * 获取明天零时的时间戳
 */

export const getTomStartStamp = () => {
  return getTodayStartStamp() + 24 * 3600 * 1000
}

/**
 * 获取明天23时59分59秒的时间戳
 */
export const getTomEndStamp = () => {
  return getTodayEndStamp() + 24 * 3600 * 1000
}

/**
 * 根据时间戳获取对应的年月日
 * @param {*} stamp 
 */
export const getCurrentTime = (stamp) => {
  let time = new Date(stamp)
  let year = time.getFullYear()
  let month = time.getMonth() + 1
  let day = time.getDate()
  month = month.toString().length === 1 ? `0${month}` : month.toString()
  day = day.toString().length === 1 ? `0${day}` : day.toString()
  return {year, month, day}
}

/**
 * 获取现在的时间戳
 */
export const getCurrentStamp = () => {
  return now.getTime()
}


export const initialTime = (time_str) => {
  let current_arr = time_str.split(' ')
  let time_arr = []
  time_arr.push(current_arr[2])
  time_arr.push(current_arr[1])
  time_arr.push(current_arr[3])
  let finished_time = time_arr.join(' ')
  let current_time = current_arr[4]
  let arr = current_time.split(":") // ['09', '00', '00]
  arr[0] = arr[0][0] === '0' ? arr[0][1] : arr[0]
  let str = `${arr[0]}:${arr[1]}` // '9:00'
  let ap = arr[0] * 1 > 11 ? 'pm' : 'am'
  return {str, ap, finished_time}
}