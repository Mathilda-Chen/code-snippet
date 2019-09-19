/**
 * 按照某字段排序(从小到大))
 */
function compare(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value2 - value1;
  }
}
/**
 * 数组排序(从小到大))
 */
function minSort(arr) {
  var min;
  for (var i = 0; i < arr.length; i++) {
    for (var j = i; j < arr.length; j++) {
      if (parseInt(arr[i]) > parseInt(arr[j])) {
        min = arr[j]
        arr[j] = arr[i]
        arr[i] = min
      }
    }
  }
  return arr
}

/**
 * 累加数组元素
 */
function sum(arr) {
  var a = 0;
  for (var i = 0; i < arr.length; i++) {
    a += arr[i];
  }
  return a;
}

/**
 * 百分比
 */
function mod(val, all) {
  var num = Math.ceil(val / all * 100) + "%";
  return num.toString();
}

/**
 * 保留两位小数
 */
function fixed(val) {
  var num = Math.round(val * 100) / 100;
  return num.toString();
}

/**
 * 判断数组中有多少数值
 */
function unique(arr) {
  var result = [],
    hash = {};
  for (var i = 0, elem;(elem = arr[i]) != null; i++) {
    if (!hash[elem]) {
      result.push(elem);
      hash[elem] = true;
    }
  }
  return result;
}

/**
 * 数字转换大写文字
 */
function numUpper(num) {
  num = parseInt(num);
  var changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  var unit = ["", "十", "百", "千", "万"];
  var strArr = num.toString().split("").reverse();
  var newNum = "";
  for (var i = 0; i < strArr.length; i++) {
    newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[parseInt(strArr[i])] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
  }
  if (strArr.length == 2 && strArr[1] == 1) {
    newNum = newNum.substring(1, newNum.length);
  }
  return newNum;
}

/**
 * 复制对象/数组
 * @param val
 * @param type 0:对象 1： 数组
 */
copyObj(type, val) {
  var obj = type ? [...val] : JSON.parse(JSON.stringify(val))
  return obj
}

exports default = {
  compare, minSort, sum, mod, fixed, unique, numUpper, copyObj
}
