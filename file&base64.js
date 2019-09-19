var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('') //索引表
/**
 * 文件转换base64
 */
function fileToBase64(url) {
  // 读取文件
  return new Promise((resolve, reject) => {
    file.readArrayBuffer({
      uri: url,
      success: (data) => {
        // console.info('array' + data)
        var buffer = Uint8ArrayToString(data.buffer)
        var bin = stringToBin(buffer)
        var base64Str = binToBase64(bin)
        resolve(base64Str)
      },
      fail: (data) => {
        reject(data)
      }
    })
  })
}

/**
 * @description 将Uint8Array换为字符串
 */
function Uint8ArrayToString(fileData) {
  var dataString = "";
  for (var i = 0; i < fileData.length; i++) {
    dataString += String.fromCharCode(fileData[i]);
  }
  return dataString
}

/**
 * @description 将字符转换为二进制序列
 * @param  {String} str 
 * @return {String}    
 */
function stringToBin(str) {
  var result = "";
  for (var i = 0; i < str.length; i++) {
    var charCode = str.charCodeAt(i).toString(2);
    result += (new Array(9 - charCode.length).join("0") + charCode);
  }
  return result;
}

/**
 * @description 将二进制换为Base64
 * @param  {String} str 
 * @return {String}    
 */
function binToBase64(bitString) {
  var result = "";
  var tail = bitString.length % 6;
  var bitStringTemp1 = bitString.substr(0, bitString.length - tail);
  var bitStringTemp2 = bitString.substr(bitString.length - tail, tail);
  for (var i = 0; i < bitStringTemp1.length; i += 6) {
    var index = parseInt(bitStringTemp1.substr(i, 6), 2);
    result += code[index];
  }
  bitStringTemp2 += new Array(7 - tail).join("0");
  if (tail) {
    result += code[parseInt(bitStringTemp2, 2)];
    result += new Array((6 - tail) / 2 + 1).join("=");
  }
  return result;
}


/**
 * base64转文件
 */
function base64ToFile(dataURI) {
  // 写文件
  return new Promise((resolve, reject) => {
    var bin = base64ToBin(dataURI)
    var Str = BinToStr(bin)
    var buffer = stringToUint8Array(Str)
    // var buffer = Base64Binary.decode(dataURI)
    var newDateTime = (new Date()).valueOf()
    var url = 'internal://files/work/' + newDateTime + 'pigmentation.jpg'
    file.writeArrayBuffer({
      uri: url,
      buffer: buffer,
      position: 0,
      success: function () {
        resolve(url)
      },
      fail: (data, code) => {
        reject(data)
      }
    })
  })
}

/**
 * @description 将base64编码转换为二进制序列
 * @param {String}
 * @return {String}
 */
function base64ToBin(str) {
  var bitString = "";
  var tail = 0;
  for (var i = 0; i < str.length; i++) {
    if (str[i] != "=") {
      var decode = code.indexOf(str[i]).toString(2);
      bitString += (new Array(7 - decode.length)).join("0") + decode;
    } else {
      tail++;
    }
  }
  return bitString.substr(0, bitString.length - tail * 2);
}

/**
 * @description 将二进制序列转换为字符串
 * @param {String} Bin
 */
function BinToStr(Bin) {
  var result = "";
  for (var i = 0; i < Bin.length; i += 8) {
    result += String.fromCharCode(parseInt(Bin.substr(i, 8), 2));
  }
  return result;
}

/**
 * @description 将字符串换为Uint8Array
 */
function stringToUint8Array(str) {
  var arr = [];
  for (var i = 0, j = str.length; i < j; ++i) {
    arr.push(str.charCodeAt(i));
  }
  var tmpUint8Array = new Uint8Array(arr);
  return tmpUint8Array
}

export default = {
  fileToBase64, base64ToFile
}
