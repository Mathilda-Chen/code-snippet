
/**
 * 时间戳转换时间
 */
function formatDate(timestamp) {
  let time = timestamp ? new Date(timestamp) : new Date()
  let year = time.getFullYear()
  let month = time.getMonth() + 1
  let day = time.getDate()
  let hour = time.getHours()
  let minute = time.getMinutes()
  let second = time.getSeconds()
  let week = time.getDay()
  var str
  if (hour > 12) {
    str = 'pm'
  } else {
    str = 'am'
  }
  month < 10 && (month = `0${month}`)
  day < 10 && (day = `0${day}`)
  hour < 10 && (hour = `0${hour}`)
  minute < 10 && (minute = `0${minute}`)
  second < 10 && (second = `0${second}`)
  return [year, month, day, hour, minute, week, str]
}

/**
 * 时间戳转换时间
 */
function getHour() {
  let time = new Date()
  let hour = time.getHours()
  let minute = time.getMinutes()
  let second = time.getSeconds()
  return `${hour}:${minute}:${second}`
}

/**
 * 当前时间戳
 */
function getTime() {
  return Date.parse(new Date())
}

export default {
  formatDate, getHour, getTime
}
