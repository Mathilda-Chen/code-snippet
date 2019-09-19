
/**
 * 格式化数据(合并同一天)
 */
function formatDataDay(arr) {
  arr.forEach(e => {
    if (!isNaN(e.time)) {
      e.time = dateUtil.formatDate(e.time).split(' ')[0];
    }
  })
  let newArr = [];
  arr.forEach((a, i) => {
    let index = -1;
    let alreadyExsists = newArr.some((nA, j) => {
      if (a.time == nA.time) {
        index = j;
        return true;
      }
    });
    // 存在相同日期
    if (alreadyExsists) {
      if (a.type) {
        newArr[index].income += parseFloat(a.money)
      } else {
        newArr[index].outcome += parseFloat(a.money)
      }
      newArr[index].bill.push(a);
      return;
    }
    // 不存在且原数据为空
    if (!alreadyExsists && a.bill == undefined) {
      newArr.push({
        time: a.time,
        income: a.type ? parseFloat(a.money) : 0,
        outcome: a.type ? 0 : parseFloat(a.money),
        bill: [a]
      });
      // console.log(newArr)
    } else {
      newArr.push(a)
    }
  })
  return newArr
}

/**
 * 格式化数据(合并同一月，同一天)
 */
function formatData(arr) {
  let newArr = [];
  arr.forEach((a, i) => {
    // 判断是否存在date
    if (a.date) {
      newArr.push(a);
    } else {
      a.time = dateUtil.formatDate(a.time).split(' ')[0];
      // 判断数组中是否存在date
      if (newArr.length) {
        // 是否存在相同date
        let dateIndex = -1;
        let exsistsDate = newArr.some((nA, j) => {
          var date = a.time.slice(0, 8);
          if (date == nA.date) {
            dateIndex = j;
            return true;
          }
        })
        // 存在相同date
        if (exsistsDate) {
        // 是否存在相同time
          let timeIndex = -1;
          let exsistsTime = newArr[dateIndex].con.some((nC, n) => {
            if (a.time == nC.time) {
              timeIndex = n;
              return true;
            }
          })
          if (exsistsTime) {
            if (a.type) {
              newArr[dateIndex].income += parseFloat(a.money);
              newArr[dateIndex].con[timeIndex].income += parseFloat(a.money);
            } else {
              newArr[dateIndex].outcome += parseFloat(a.money)
              newArr[dateIndex].con[timeIndex].outcome += parseFloat(a.money)
            }
            newArr[dateIndex].con[timeIndex].bill.push(a);
          }
          if (!exsistsTime) {
            if (a.type) {
              newArr[dateIndex].income += parseFloat(a.money);
            } else {
              newArr[dateIndex].outcome += parseFloat(a.money)
            }
            newArr[dateIndex].con.push({
              time: a.time,
              income: a.type ? parseFloat(a.money) : 0,
              outcome: a.type ? 0 : parseFloat(a.money),
              bill: [a]
            });
          }
        }
        var param = {}
        if (!exsistsDate) {
          param = {
            date: a.time.slice(0,8),
            income: a.type ? parseFloat(a.money) : 0,
            outcome: a.type ? 0 : parseFloat(a.money),
            con: [
              {
                time: a.time,
                income: a.type ? parseFloat(a.money) : 0,
                outcome: a.type ? 0 : parseFloat(a.money),
                bill: [a]
              }
            ]
          }
          newArr.push(param);
        }
      } else {
        param = {
          date: a.time.slice(0, 8),
          income: a.type ? parseFloat(a.money) : 0,
          outcome: a.type ? 0 : parseFloat(a.money),
          con: [
            {
              time: a.time,
              income: a.type ? parseFloat(a.money) : 0,
              outcome: a.type ? 0 : parseFloat(a.money),
              bill: [a]
            }
          ]
        }
        newArr.push(param);
      }
    }
  })
  return newArr
}

/**
 * 格式化数据（合并同一类）
 */
function mergeCate(arr, callback) {
  var countArr = [[], []];
  arr.forEach(item => {
    let index = -1;
    let alreadyExsists = countArr[item.type].some((arr, j) => {
      if (item.cate == arr.name) {
        index = j;
        return true;
      }
    });
    if (alreadyExsists) {
      countArr[item.type][index].data += parseFloat(item.money);
    } else {
      countArr[item.type].push({
        name: item.cate,
        data: parseFloat(item.money),
        imgUrl: item.imgUrl
      })
    }
  })
  callback(countArr)
}

exports default = {
  formatDataDay, formatData, mergeCate
}
