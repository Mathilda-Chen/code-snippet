/**
 *  拼多多接口
 *  type API名称
 *  timestamp 时间戳
 *  info sign参数
 *  param 传参
 */
  const PayUtil = require("./utils/pay/payUtil.js");
  getDdk(type, timestamp, info, param, callback) {
    var sign = PayUtil.signDdk(info);
    var obj = {
      client_id: "必填", // 填写client_id
      sign: sign,
      timestamp: timestamp,
      type: type,
    }
    if (param) {
      obj = Object.assign(obj, param);
    }
    wx.request({
      url: "https://gw-api.pinduoduo.com/api/router",
      data: obj,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "POST",
      success: callback,
      fail: err => {
        wx.showToast({
          title: '获取数据失败！',
          icon: 'none',
          mask: true
        })
      }
    })
  },
