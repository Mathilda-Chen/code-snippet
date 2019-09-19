/**
 * 提示更新
 */
if (wx.canIUse('getUpdateManager')) {
  const updateManager = wx.getUpdateManager()
  updateManager.onCheckForUpdate(function(res) {
    // 请求完新版本信息的回调
    if (res.hasUpdate) {
      updateManager.onUpdateReady(function() {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed(function() {
        // 新的版本下载失败
        wx.showModal({
          title: '已经有新版本了哟~',
          content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
        })
      })
    }
  })
} else {
  // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
  wx.showModal({
    title: '提示',
    content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
  })
}

/**
 * 获取屏幕转换比例
 */
getRatio() {
  var self = this;
  wx.getSystemInfo({
    success: function(res) {
      let clientWidth = res.windowWidth;
      let ratio = 750 / clientWidth;
      self.globalData.ratio = ratio;
      self.globalData.clientHeight = res.windowHeight;
      self.globalData.clientWidth = res.windowWidth;
      if (res.model == "iPhone X") {
        self.globalData.tabHeight = 82;
      } else {
        self.globalData.tabHeight = 48;
      }
      self.globalData.statusBarHeight = res.statusBarHeight;
      if (res.platform == "ios") {
        self.globalData.isIos = true;
      }
    }
  })
}


/**
 * 数据相关方法
 */
 
/**
 * 获取所有数据
 */
getAllBills(timestamp, param, callback) {
  var self = this;
  // console.log(111, param, timestamp)
  this.countData('bills', param, timestamp, res => {
    var total = res.total;
    if (!total) {
      callback(false)
      return;
    }
    var times = Math.ceil(total / 20);
    var info = [];
    var newArr = [];
    for (var i = 0; i < times; i++) {
      newArr.push(self.getData(timestamp, param, i));
    }
    Promise.all(newArr)
      .then(function(result) {
        var arr = [];
        result.forEach(e => {
          arr = arr.concat(e)
        })
        callback(arr)
      })
  })
}

// 查询数据数量
countData(name, param, time, callback) {
  if (time[0]) {
    var compareTime = _.gte(time[0]).and(_.lte(time[1]));
    param.time = compareTime;
  }
  db.collection(name).where(param).count({
    success: callback,
    fail: err => {
      wx.showToast({
        title: '不存在，请刷新！',
        icon: 'none',
        mask: true
      })
    }
  })
}

// 获取数据
getData(timestamp, param, i) {
  return new Promise(resolve => {
    this.searchData('bills', param, timestamp, i, res => {
      resolve(res.data)
    })
  })
}

/**
 * 调用云函数封装
 */
getCloud(name, data, callback) {
  wx.cloud.callFunction({
    name: name,
    data: data,
    success: callback,
    fail: err => {
      console.error('调用失败', err)
    }
  })
}

/**
 * 查询数据
 */
searchData(name, param, time, page, callback) {
  // 查询多个_openid的信息
  if (param._openid && param._openid.indexOf(",") != -1) {
    var arr = [];
    param._openid.split(",").forEach(e => {
      arr.push({
        _openid: e
      })
    })
    param = _.or(arr)
  }
  // 查询多个_id的信息
  if (param._id && param._id.indexOf(",") != -1) {
    var arr = [];
    param._id.split(",").forEach(e => {
      arr.push({
        _id: e
      })
    })
    param = _.or(arr)
  }
  if (time[0]) {
    var compareTime = _.gte(time[0]).and(_.lt(time[1]));
    param.time = compareTime;
  }
  db.collection(name).where(param).orderBy('time', 'desc').skip(20 * page).get({
    success: callback,
    fail: err => {
      console.error('获取失败', err)
    }
  })
},

/**
 * 添加数据
 */
addData(name, param, callback) {
  db.collection(name).add({
    data: param,
    success: callback,
    fail: err => {
      console.error('添加失败', err)
    }
  })
}

/**
 * 删除数据
 */
delData(name, id, callback) {
  db.collection(name).doc(id).remove({
    success: callback,
    fail: err => {
      wx.showToast({
        title: '不存在，请刷新！',
        icon: 'none',
        mask: true
      })
    }
  });
}

/**
 * 修改数据
 */
editData(name, id, param, callback) {
  if (param.is_default == 2) {
    param.is_default = _.remove()
  }
  db.collection(name).doc(id).update({
    data: param,
    success: callback,
    fail: err => {
      wx.showToast({
        title: '不存在，请刷新！',
        icon: 'none',
        mask: true
      })
    }
  })
}

/**
 * 设置tabBar
 */
setTabBar(index, text) {
  var self = this
  wx.setTabBarItem({
    index: index,
    text: text,
    iconPath: `/images/tab/tab_icon${index + 1}_1@2x.png`,
    selectedIconPath: `/images/vipCloth/tab_icon${index + 1}_2_t${self.globalData.userinfo.clothid || 0}.png`
  })
  wx.setTabBarStyle({
    selectedColor: self.globalData.userinfo.clothcolor[0],
  })
}
