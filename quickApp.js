/**
 * 存储缓存数据
 * @param key
 */
setStorage(key, val) {
  return new Promise(resolve => {
    storage.set({
      key: key,
      value: val,
      success: () => {
        resolve()
      },
      fail: () => {
        prompt.showToast({
          message: '获取失败，请重试'
        })
      }
    })
  })
},

/**
 * 获取缓存数据
 * @param key
 */
getStorage(key) {
  return new Promise(resolve => {
    storage.get({
      key: key,
      success: res => {
        if (res == '' || res == null || res == undefined || res == '0') {
          resolve(null)
        } else {
          var json = JSON.parse(res)
          resolve(json)
        }
      },
      fail: () => {
        prompt.showToast({
          message: '存储失败，请重试'
        })
      }
    })
  })
},

/**
 * 清除缓存
 */
clearStrorage() {
  storage.clear()
}

/**
 * 设置 app 缓存的数据
 * @param key
 * @param val
 */
getAppData(key) {
  return this.dataCache[key]
},

setAppData(key, val) {
  this.dataCache[key] = val
},

/**
 * 消息提示
 * @param type 0:弹框 1： 对话框 2: shift框
 * @param val 
 */
showMsg(type, val) {
  if (type == 0) {
    prompt.showToast({
      message: val
    })
  } else if (type == 1) {
    return new Promise(resolve => {
      prompt.showDialog({
        title: val[0],
        message: val[1],
        buttons: val[2],
        success: function (data) {
          resolve(parseInt(data.index))
        }
      })
    })
  } else {
    return new Promise(resolve => {
      prompt.showContextMenu({
        itemList: val,
        success: function (data) {
          resolve(parseInt(data.index))
        }
      })
    })
  }
},
