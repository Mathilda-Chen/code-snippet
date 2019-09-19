/**
 * 微信支付
 * 方法封装
 * @param _openid: 用户openid
 * @param appid: 小程序appid
 * @param mch_id: 商务号id
 * @param body: 支付提示文字信息（ex:'某某小程序VIP内购增值服务'）
 * @param timeStamp: 时间戳（Date.parse(new Date()) / 1000）
 */
  const PayUtil = require("./utils/pay/payUtil.js");
  pay(_openid, appid, mch_id, body, timeStamp, callback) {
    var nonce_str = PayUtil.getnotsrc(32);
    var payInfo = {
      body: body,
      total_fee: 1.99 * 100,
    };
    var out_trade_no = 'YY-' + timeStamp + '-' + appid;
    var notify_url = "http://121.40.61.21:8080/Statistics_branch/transit/page";
    var spbill_create_ip = "192.168.0.33";
    var trade_type = "JSAPI";
    var sign = PayUtil.singOrder(appid, payInfo.body, mch_id, nonce_str, notify_url, _openid, out_trade_no, spbill_create_ip, payInfo.total_fee, trade_type);
    var forData = "<xml>\n"
    forData += "<appid>" + appid + "</appid>\n";
    forData += "<body>" + payInfo.body + "</body>\n";
    forData += "<mch_id>" + mch_id + "</mch_id>\n";
    forData += "<nonce_str>" + nonce_str + "</nonce_str>\n";
    forData += "<notify_url>" + notify_url + "</notify_url>\n";
    forData += "<openid>" + _openid + "</openid>\n";
    forData += "<out_trade_no>" + out_trade_no + "</out_trade_no>\n";
    forData += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>\n";
    forData += "<total_fee>" + payInfo.total_fee + "</total_fee>\n";
    forData += "<trade_type>" + trade_type + "</trade_type>\n";
    forData += "<sign>" + sign + "</sign>\n";
    forData += "</xml>";
    wx.request({
      url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
      method: 'POST',
      head: 'application/x-www-form-urlencoded;charset=utf-8',
      data: forData,
      success(res) {
        var xml = res.data;
        var XMLParser = new Parser.DOMParser();
        var doc = XMLParser.parseFromString(xml);
        var return_code = doc.getElementsByTagName('return_code')[0].firstChild.nodeValue;
        if (return_code == 'SUCCESS') {
          var prepay_id = doc.getElementsByTagName('prepay_id')[0].firstChild.nodeValue;
          var noteStr2 = PayUtil.getnotsrc(30);
          var paySign = PayUtil.singPay(appid, noteStr2, prepay_id, timeStamp);
          wx.requestPayment({
            timeStamp: String(timeStamp),
            nonceStr: noteStr2,
            package: 'prepay_id=' + prepay_id,
            signType: 'MD5',
            paySign: paySign,
            success: callback,
            fail: function(res) {
              wx.showToast({
                title: '取消支付',
                icon: "none",
              })
            }
          })
        }
      },
      fail(res) {
        console.log('wrong', res);
      }
    })
  }
  
/**
 * PayUtil.js
 */  
import md5 from './md5.js';
var key = '必填'; // 填写key值
/**
 * 随机数
 */
function getnotsrc(length) {
  var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = chars.length;
  var pwd = '';
  for (var i = 0; i < length; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

/**
 * 统一下单时sign签名  参数按照ASCII码排序
 */
function singOrder(appid, body, mch_id, noteStr, notify_url, openid, time, spbill_create_ip, total_fee, trade_type) {
  var stringA = "appid=" + appid + "&body=" + body + "&mch_id=" + mch_id + "&nonce_str=" + noteStr + "&notify_url=" + notify_url + "&openid=" + openid + "&out_trade_no=" + time + "&spbill_create_ip=" + spbill_create_ip + "&total_fee=" + total_fee + "&trade_type=" + trade_type;
  var stringSignTemp = stringA + "&key=" + key//注：key为商户平台设置的密钥key
  // console.log('key', key);
  stringSignTemp = md5(stringSignTemp).toUpperCase();
  // console.log('sign签名', stringSignTemp);
  return stringSignTemp
}

/**
 * 调用支付时sign签名
 */
function singPay(appid, nonceStr, prepay_id, timeStamp) {

  var stringA = "appId=" + appid + "&nonceStr=" + nonceStr + "&package=prepay_id=" + prepay_id + "&signType=MD5&timeStamp=" + String(timeStamp);
  // console.log('stringA', stringA);
  var stringSignTemp = stringA + "&key=" + key//注：key为商户平台设置的密钥key
  stringSignTemp = md5(stringSignTemp).toUpperCase();
  // console.log('sign签名', stringSignTemp);
  return stringSignTemp
}

function formatTimeDate(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return year + '-' + (month < 10 ? "0" : "") + month + '-' + (day < 10 ? "0" : "") + day;
}

function formatTimeMinenu(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + '-' + [hour, minute, second].map(formatNumber).join('-')
}


function num_data(startTime, endTime) {
  var start_date = new Date(startTime.replace(/-/g, "/"));
  var end_date = new Date(endTime.replace(/-/g, "/"));
  var days = end_date.getTime() - start_date.getTime();
  var day = parseInt(days / (1000 * 60 * 60 * 24));
  return day;
}


function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('') + '' + [hour, minute, second].map(formatNumber).join('')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

exports default= {
  formatTime, getnotsrc, singOrder, singPay, formatTimeDate, num_data, formatTimeMinenu
}

/**
 * md5.js
 */  

 /*  
 * 小程序MD5加密算法封装
 * +-----------------------------------------------------
 * Author: 武当山道士
 * Created: 2018-01-06
 * Md5 Lib Source: http://cdn.bootcss.com/blueimp-md5/1.1.0/js/md5.js
 * Tips: js库文件改装,加密算法没动，我只是封装了一下，便于小程序调用
 * Thanks: 感谢js库文件作者 Sebastian Tschan 的辛勤付出
 * +-----------------------------------------------------
 * Usage: 
 * 
 *    引入(比如index.js页面引入md5.js):
 *       //pages/index.js
 *       import md5 from 'utils/md5.js';
 * 
 *    调用base64MD5加密:
 *       var encryptedStr = md5('需要加密的字符串');
 */

function safe_add(x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF),
    msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
* Bitwise rotate a 32-bit number to the left.
*/
function bit_rol(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
* These functions implement the four basic operations the algorithm uses.
*/
function md5_cmn(q, a, b, x, s, t) {
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
}
function md5_ff(a, b, c, d, x, s, t) {
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t) {
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t) {
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t) {
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
* Calculate the MD5 of an array of little-endian words, and a bit length.
*/
function binl_md5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << (len % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var i, olda, oldb, oldc, oldd,
    a = 1732584193,
    b = -271733879,
    c = -1732584194,
    d = 271733878;

  for (i = 0; i < x.length; i += 16) {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;

    a = md5_ff(a, b, c, d, x[i], 7, -680876936);
    d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

    a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5_gg(b, c, d, a, x[i], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5_hh(d, a, b, c, x[i], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i], 6, -198630844);
    d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return [a, b, c, d];
}

/*
* Convert an array of little-endian words to a string
*/
function binl2rstr(input) {
  var i,
    output = '';
  for (i = 0; i < input.length * 32; i += 8) {
    output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
  }
  return output;
}

/*
* Convert a raw string to an array of little-endian words
* Characters >255 have their high-byte silently ignored.
*/
function rstr2binl(input) {
  var i,
    output = [];
  output[(input.length >> 2) - 1] = undefined;
  for (i = 0; i < output.length; i += 1) {
    output[i] = 0;
  }
  for (i = 0; i < input.length * 8; i += 8) {
    output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
  }
  return output;
}

/*
* Calculate the MD5 of a raw string
*/
function rstr_md5(s) {
  return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
}

/*
* Calculate the HMAC-MD5, of a key and some data (raw strings)
*/
function rstr_hmac_md5(key, data) {
  var i,
    bkey = rstr2binl(key),
    ipad = [],
    opad = [],
    hash;
  ipad[15] = opad[15] = undefined;
  if (bkey.length > 16) {
    bkey = binl_md5(bkey, key.length * 8);
  }
  for (i = 0; i < 16; i += 1) {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }
  hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
  return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
}

/*
* Convert a raw string to a hex string
*/
function rstr2hex(input) {
  var hex_tab = '0123456789abcdef',
    output = '',
    x,
    i;
  for (i = 0; i < input.length; i += 1) {
    x = input.charCodeAt(i);
    output += hex_tab.charAt((x >>> 4) & 0x0F) +
      hex_tab.charAt(x & 0x0F);
  }
  return output;
}

/*
* Encode a string as utf-8
*/
function str2rstr_utf8(input) {
  return unescape(encodeURIComponent(input));
}

/*
* Take string arguments and return either raw or hex encoded strings
*/
function raw_md5(s) {
  return rstr_md5(str2rstr_utf8(s));
}
function hex_md5(s) {
  return rstr2hex(raw_md5(s));
}
function raw_hmac_md5(k, d) {
  return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
}
function hex_hmac_md5(k, d) {
  return rstr2hex(raw_hmac_md5(k, d));
}

/** 
 * 暴露接口给小程序 因为export default，所以引入的时候可以自定义方法名称 
 * +--------------------
 * @param {String}   string  需要加密的字符串
 * @param {String}   key     加密key
 * @param {Boolean}  raw     规则 false: 返回hex_md5, true: 返回raw_md5
 */
export default function md5(string, key, raw) {
  if (!key) {
    if (!raw) {
      return hex_md5(string);
    }
    return raw_md5(string);
  }
  if (!raw) {
    return hex_hmac_md5(key, string);
  }
  return raw_hmac_md5(key, string);
}
