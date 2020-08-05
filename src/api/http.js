import axios from 'axios';

const baseUrl = 'http://localhost:3000/api/v1'

/**
 * 用户登录
 * @param {*} url 
 * @param {*} payload 
 */
export const login = async (url, payload) => {
  return await axios.post(`${baseUrl}${url}`, payload)
}
/**
 * 用户注册
 * @param {*} url 
 * @param {*} payload 
 */
export const register = async (url, payload) => {
  return await axios.post(`${baseUrl}${url}`, payload)
}

/**
 * 注销tokenß
 * @param {*} url 
 * @param {*} token 
 */
export const cancel_login = async (url, token) => {
  return await axios.delete(`${baseUrl}${url}`, {
    headers: {
      "X-BLACKCAT-TOKEN": token
    }
  })
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

/**
 * 用户参与
 * @param {*} url 
 * @param {*} token 
 */
export const join_event_participants = async (url, token) => {
  return await axios.post(`${baseUrl}${url}`, {}, {
    headers: {
      "X-BLACKCAT-TOKEN": token
    }
  })
}

/**
 * 用户取消参与
 * @param {*} url 
 * @param {*} token 
 */
export const cancel_event_participants = async (url, token) => {
  return await axios.delete(`${baseUrl}${url}`, {
    headers: {
      "X-BLACKCAT-TOKEN": token
    }
  })
}

/**
 * 用户获取评论
 * @param {*} url 
 * @param {*} payload 
 * @param {*} token 
 */
export const get_event_comments = async (url, payload, token) => {
  let defaultObj = {
    offset: 0,
    limit: 25
  }
  let currentObj = Object.assign(defaultObj, payload)
  let arr = []
  Object.keys(currentObj).forEach((key) => {
    arr.push(`${key}=${currentObj[key]}`)
  })
  let str = arr.join('&')
  return await axios.get(`${baseUrl}${url}?${str}`, {
    headers: {
      "X-BLACKCAT-TOKEN": token
    }
  })
}

/**
 * 用户发表评论
 * @param {*} url 
 * @param {*} payload 
 * @param {*} token 
 */
export const post_event_comments = async (url, payload, token) => {
  return await axios.post(`${baseUrl}${url}`, payload, {
    headers: {
      "X-BLACKCAT-TOKEN": token
    }
  })
}

/**
 * 用户获取当前event likes的列表
 * @param {*} url 
 * @param {*} payload 
 * @param {*} token 
 */
export const get_event_likes = async (url, payload, token) => {
  let defaultObj = {
    offset: 0,
    limit: 25
  }
  let currentObj = Object.assign(defaultObj, payload)
  let arr = []
  Object.keys(currentObj).forEach((key) => {
    arr.push(`${key}=${currentObj[key]}`)
  })
  let str = arr.join('&')
  return await axios.get(`${baseUrl}${url}?${str}`, {
    headers: {
      "X-BLACKCAT-TOKEN": token
    }
  })
}

/**
 * 用户点赞
 * @param {*} url 
 * @param {*} token 
 */
export const post_event_likes = async (url, token) => {
  return await axios.post(`${baseUrl}${url}`, {}, {
    headers: {
      "X-BLACKCAT-TOKEN": token
    }
  })
}

/**
 * 用户取消点赞
 * @param {*} url 
 * @param {*} token 
 */
export const cancel_event_likes = async (url, token) => {
  return await axios.delete(`${baseUrl}${url}`, {
    headers: {
      "X-BLACKCAT-TOKEN": token
    }
  })
}

/**
 * 用户获取个人信息
 * @param {*} url 
 * @param {*} token 
 */
export const get_user = async (url, token) => {
  return await axios.get(`${baseUrl}${url}`, {
    headers: {
      "X-BLACKCAT-TOKEN": token
    }
  })
}

/**
 * 用户获取参与活动信息
 * @param {*} url 
 * @param {*} token 
 */
export const get_user_events = async (url, payload, token) => {
  let defaultObj = {
    offset: 0,
    limit: 25
  }
  let currentObj = Object.assign(defaultObj, payload)
  let arr = []
  Object.keys(currentObj).forEach((key) => {
    arr.push(`${key}=${currentObj[key]}`)
  })
  let str = arr.join('&')
  return await axios.get(`${baseUrl}${url}?${str}`, {
    headers: {
      "X-BLACKCAT-TOKEN": token
    }
  })
}