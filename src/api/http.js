import axios from 'axios';

const baseUrl = 'http://localhost:3000/api/v1'

/**
 * 用户登录
 * @param {*} url 
 * @param {*} payload 
 */
export const login = async (url, payload) => {
  let res = await axios.post(`${baseUrl}${url}`, payload)
  return res;
}
/**
 * 用户注册
 * @param {*} url 
 * @param {*} payload 
 */
export const register = async (url, payload) => {
  let res = await axios.post(`${baseUrl}${url}`, payload)
  return res;
}

/**
 * 注销tokenß
 * @param {*} url 
 * @param {*} token 
 */
export const cancel_login = async (url, token) => {
  // console.log(url, token)
  let res = await axios.delete(`${baseUrl}${url}`, {
    headers: {
      "X-BLACKCAT-TOKEN": token
    }
  })
  return res
}

/**
 * 获取channels
 * @param {*} url 
 * @param {*} token 
 */
export const get_channels = async (url, token) => {
  return await axios.get(`${baseUrl}${url}`, {
    headers: {
      "X-BLACKCAT-TOKEN": token
    }
  })
}

/**
 * 获取events
 * @param {*} url 
 * @param {*} payload 
 * @param {*} token 
 */
export const get_events = async (url, payload, token) => {
  let params = {offset: 0, limit: 25}
  for (let key in payload) {
    if (payload[key] !== "") {
      params[key] = payload[key]
    }
  }
  let arr = []
  Object.keys(params).forEach((key) => {
    arr.push(`${key}=${params[key]}`)
  })
  let str = arr.join('&')
  let completeUrl = `${baseUrl}${url}?${str}`
  return await axios.get(`${completeUrl}`, {
    headers: {
      "X-BLACKCAT-TOKEN": token
    }
  })
}

/**
 * 获取event详情
 * @param {*} url 
 * @param {*} token 
 */
export const get_event_detail = async (url, token) => {
  return await axios.get(`${baseUrl}${url}`, {
    headers: {
      "X-BLACKCAT-TOKEN": token
    }
  })
}

/**
 * 获取event participants
 * @param {*} url 
 * @param {*} token 
 */
export const get_event_participants = async (url, token) => {
  return await axios.get(`${baseUrl}${url}`, {
    headers: {
      "X-BLACKCAT-TOKEN": token
    }
  })
}