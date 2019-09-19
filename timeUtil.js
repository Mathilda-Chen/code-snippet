
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
  return [year, month, day, hour, minute, second, str]
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

/**
 * 转换时间戳
 * 格式 [year,month,day]
 * 计算当月或下个月的时间戳
 */
function changeTime(time, isAdd, spe) {
  var year = parseInt(time[0])
  var month = parseInt(time[1])
  if (isAdd) {
    year = month == 12 ? year + 1 : year
    month = month == 12 ? 1 : month + 1
  }
  var day = time[2] ? time[2] : 1
  var hour = spe ? spe : '00:00:00'
  var newTime = `${year}/${month}/${day} ${hour}`
  var date = new Date(newTime)
  return Date.parse(date)
}

/**
 * 获取每个月的天数
 */
function getCountDays(month) {
  var year = new Date().getFullYear()
  var thisDate = new Date(year, month, 0) //当天数为0 js自动处理为上一月的最后一天
  return thisDate.getDate()
}

/**
 * 获取本周第一天或第七天
 */
function getSomeday(type, dates) {
  var now = new Date();
  var nowTime = now.getTime();
  var day = now.getDay();
  var longTime = 24 * 60 * 60 * 1000;
  var n = longTime * 7 * (dates || 0);
  if (type == "s") {
    var dd = nowTime - (day - 1) * longTime + n;
  };
  if (type == "e") {
    var dd = nowTime + (7 - day) * longTime + n;
  };
  var time = new Date(dd);
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var day = time.getDate();
  return [year, month, day];
}

// 获取周一日期
function getMonDate(date) {
  var d = new Date();
  var day = d.getDay();
  console.log(date, day)
  if (day == 1) {
    return d;
  }
  if (day == 0) {
    d.setDate(date - 6);
  } else {
    d.setDate(date - day + 1);
  }
  return d;
}

/**
 * 获取每月第一周周一日期
 */
function getFirstMonday(year, month, weekday) {
  var d = new Date();
  // 该月第一天
  d.setFullYear(year, month - 1, 1);
  var w1 = d.getDay();
  if (w1 == 0) w1 = 7;
  // 该月天数
  d.setFullYear(year, month, 0);
  var dd = d.getDate();
  // 第一个周一
  let d1;
  if (w1 != 1) d1 = 7 - w1 + 2;
  else d1 = 1;
  var monday = d1 + (weekday - 1) * 7;
  return monday;
}


export default {
  formatDate, getHour, getTime, changeTime, getCountDays, getSomeday, getMonDate, getFirstMonday
}
