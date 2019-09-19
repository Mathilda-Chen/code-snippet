
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

export default = {
  fileToBase64
}
