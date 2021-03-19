import API from "./api.js"
/**
 * 知晓云注册功能
 * username 手机号
 * password 密码 
 */
// #ifdef MP-WEIXIN
const ClientID = '2f7b2813e057a74e981d'
// #endif
// #ifdef QUICKAPP-WEBVIEW
const ClientID = '34badd3f1767c58eaa3d'
// #endif
const host = 'https://' + ClientID + '.myminapp.com/hserve/v2.2/'
const host1 = 'https://' + ClientID + '.myminapp.com/hserve/v2.1/'
const password = 'b7720'

function register(openid) {
	return new Promise((resolve, reject) => {
		// #ifdef MP-WEIXIN
		const url = host1 + 'register/email/'
		// #endif
		// #ifdef QUICKAPP-WEBVIEW
		const url = host1 + 'register/username/'
		// #endif
		uni.request({
			url,
			method: "POST",
			header: {
				'X-Hydrogen-Client-ID': ClientID,
				'Content-Type': 'application/json'
			},
			data: JSON.stringify({
				// #ifdef MP-WEIXIN
				'email': `${openid}@netpower.com`,
				// #endif
				// #ifdef QUICKAPP-WEBVIEW
				'username': openid,
				// #endif
				'password': password
			}),
			success: res => {
				if (res.statusCode == 201) {
					resolve(res)
				} else if (res.data.status == 'error' && res.data.error_msg.indexOf("ready exists") != -1) {
					resolve(null)
				}
			},
			fail: (error) => {
				API.showMsg(0, "网络不佳，请重新尝试", null, "none")
			}
		})
	})
}

function login(openid) {
	return new Promise((resolve, reject) => {
		// #ifdef MP-WEIXIN
		const url = host1 + 'login/email/'
		// #endif
		// #ifdef QUICKAPP-WEBVIEW
		const url = host1 + 'login/username/'
		// #endif
		uni.request({
			url,
			method: "POST",
			header: {
				'X-Hydrogen-Client-ID': ClientID,
				'Content-Type': 'application/json'
			},
			data: JSON.stringify({
				// #ifdef MP-WEIXIN
				'email': `${openid}@netpower.com`,
				// #endif
				// #ifdef QUICKAPP-WEBVIEW
				'username': openid,
				// #endif
				'password': password
			}),
			success: (res) => {
				if (res.statusCode == 201) {
					resolve(res.data.token)
				} else if (res.statusCode == 400) {
					resolve(null)
				}
			},
			fail: (error) => {
				API.showMsg(0, "网络不佳，请重新尝试", null, "none")
			}
		})
	})
}
//先登录，再插入数据
async function insert(table, data) {
	if (!data) return
	var { token } = await API.getStorage("minToken")
	const url = host + 'table/' + table + '/record/'
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			method: "POST",
			header: {
				'X-Hydrogen-Client-ID': ClientID,
				'Content-Type': 'application/json',
				'Authorization': 'Hydrogen-r1 ' + token
			},
			data,
			success: (res) => {
				if (res.statusCode == 201) {
					resolve(res.data)
				} else {
					API.showMsg(0, "网络不佳，请重新尝试", null, "none")
				}
			},
			fail: (error) => {
				API.showMsg(0, "网络不佳，请重新尝试", null, "none")
			}
		})
	})
}
//先登录，再更新数据
async function updateAll(table, where, data) {
	var { token } = await API.getStorage("minToken")
	var search = encodeURI(JSON.stringify(where))
	const url = host + 'table/' + table + '/record/' + '?where=' + search
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			method: "PUT",
			header: {
				'X-Hydrogen-Client-ID': ClientID,
				'Content-Type': 'application/json',
				'Authorization': 'Hydrogen-r1 ' + token
			},
			data,
			success: (res) => {
				if (res.statusCode == 200) {
					resolve(res.data)
				} else {
					reject(res)
				}
			},
			fail: (error) => {
				API.showMsg(0, "网络不佳，请重新尝试", null, "none")
			}
		})
	})
}
//按条件批量删除数据
async function deleteAll(table, where) {
	var search = encodeURI(JSON.stringify(where))
	var { token } = await API.getStorage("minToken")
	const url = host + 'table/' + table + '/record/' + '?where=' + search
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			method: "DELETE",
			header: {
				'X-Hydrogen-Client-ID': ClientID,
				'Content-Type': 'application/json',
				'Authorization': 'Hydrogen-r1 ' + token
			},
			success: (res) => {
				if (res.statusCode == 200) {
					resolve(res)
				} else {
					reject(res)
				}
			},
			fail: (error) => {
				API.showMsg(0, "网络不佳，请重新尝试", null, "none")
			}
		})
	})
}

async function update(table, id, data) {
	var { token } = await API.getStorage("minToken")
	const url = host + 'table/' + table + '/record/' + id + '/'
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			method: "PUT",
			header: {
				'X-Hydrogen-Client-ID': ClientID,
				'Content-Type': 'application/json',
				'Authorization': 'Hydrogen-r1 ' + token
			},
			data: JSON.stringify({
				'$set': data
			}),
			success: (res) => {
				if (res.statusCode == 200) {
					resolve(res.data)
				} else {
					reject(res)
				}
			},
			fail: (error) => {
				API.showMsg(0, "网络不佳，请重新尝试", null, "none")
			}
		})
	})
}
//获取表中的所有数据,设置返回最大条数为1000，不设置分页
function findAll(table, where = {}) {
	var search = encodeURI(JSON.stringify(where))
	const url = host + 'table/' + table + '/record/' + '?limit=1000' + '&where=' + search +
		'&order_by=-created_at'
	return new Promise((resolve, reject) => {
		var test = JSON.stringify(where)
		if (test == '{}') resolve([])
		uni.request({
			url,
			method: "GET",
			header: {
				'X-Hydrogen-Client-ID': ClientID,
				'Content-Type': 'application/json',
			},
			success: res => {
				if (res.statusCode == 200) {
					resolve(res.data.objects)
				} else {
					resolve([])
				}
			},
			fail: (error) => {
				API.showMsg(0, "网络不佳，请重新尝试", null, "none")
			}
		})
	})
}

function findOne(table, id) {
	const url = host + 'table/' + table + '/record/' + id
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			method: "GET",
			header: {
				'X-Hydrogen-Client-ID': ClientID,
				'Content-Type': 'application/json',
			},
			success: (res) => {
				if (res.statusCode == 200) {
					resolve(res.data)
				} else {
					resolve([])
				}
			},
			fail: (error) => {
				API.showMsg(0, "网络不佳，请重新尝试", null, "none")
			}
		})
	})
}

async function deleteOne(table, id) {
	var { token } = await API.getStorage("minToken")
	const url = host + 'table/' + table + '/record/' + id + '/'
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			method: "DELETE",
			header: {
				'X-Hydrogen-Client-ID': ClientID,
				'Content-Type': 'application/json',
				'Authorization': 'Hydrogen-r1 ' + token
			},
			success: (res) => {
				if (res.statusCode == 204) {
					resolve(res)
				} else {
					reject(res)
				}
			},
			fail: (error) => {
				API.showMsg(0, "网络不佳，请重新尝试", null, "none")
			}
		})
	})
}

async function upload(uri) {
	var { token } = await API.getStorage("minToken")
	const url = `https://${ClientID}.myminapp.com/hserve/v2.1/upload/`
	const date = new Date().getTime()
	var base = await API.fileTobase64(uri)
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			method: "POST",
			header: {
				'X-Hydrogen-Client-ID': ClientID,
				'Content-Type': 'application/json',
				'Authorization': 'Hydrogen-r1 ' + token
			},
			data: JSON.stringify({
				'filename': new Date().getTime(),
				'category_name': 'IMAGE'
			}),
			success: (res) => {
				if (res.statusCode == 200) {
					var response = res.data
					uni.uploadFile({
						url: response.upload_url,
						filePath: uri,
						name: 'file',
						formData: {
							'authorization': response.authorization,
							'file': '@' + uri,
							'policy': response.policy
						},
						success: uploadFileRes => {
							if (uploadFileRes.statusCode == 200) {
								var info = JSON.parse(uploadFileRes.data)
								info.id = response.id
								resolve(info)
							} else {
								API.showMsg(0, "网络不佳，请重新尝试", null, "none")
							}
						},
						fail: (err) => {
							console.log('upload', '失败');
							API.showMsg(0, "网络不佳，请重新尝试", null, "none")
						}
					});
				}
			},
			fail: (error) => {
				console.log('upload', '失败');
				API.showMsg(0, "网络不佳，请重新尝试", null, "none")
			}
		})
	})
}

async function deleteFileAll(idArr) {
	var { token } = await API.getStorage("minToken")
	const url = host + 'uploaded-file/'
	return new Promise(resolve => {
		uni.request({
			url,
			method: "DELETE",
			header: {
				'X-Hydrogen-Client-ID': ClientID,
				'Content-Type': 'application/json',
				'Authorization': 'Hydrogen-r1 ' + token,
			},
			data: JSON.stringify({ "id__in": idArr }),
			success: res => {
				if (res.statusCode == 204) {
					resolve()
				} else {
					API.showMsg(0, "删除失败，请联系客服或重新尝试", null, "none")
				}
			},
			fail: error => {
				API.showMsg(0, "网络不佳，请重新尝试", null, "none")
			}
		})
	})
}

async function deleteFileOne(id) {
	var { token } = await API.getStorage("minToken")
	const url = host + `uploaded-file/${id}/`
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			method: "DELETE",
			header: {
				'X-Hydrogen-Client-ID': ClientID,
				'Content-Type': 'application/json',
				'Authorization': 'Hydrogen-r1 ' + token
			},
			success: res => {
				resolve()
			},
			fail: error => {
				API.showMsg(0, "网络不佳，请重新尝试", null, "none")
			}
		})
	})
}

async function deleteFileAll2(idArr, i) {
	if (i == idArr.length) {
		// console.log("删除完成",idArr)
	} else {
		await deleteFileOne(idArr[i])
		deleteFileAll2(idArr, i + 1)
	}
}

async function destroy() {
	var { token } = await API.getStorage("minToken")
	const url = host + 'session/destroy/'
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			method: "POST",
			header: {
				'X-Hydrogen-Client-ID': ClientID,
				'Content-Type': 'application/json',
				'Authorization': 'Hydrogen-r1 ' + token
			},
			data: JSON.stringify({}),
			success: (res) => {
				if (res.statusCode == 201) {
					resolve(res)
				} else {
					reject(res)
				}
			},
			fail: (error) => {
				API.showMsg(0, "网络不佳，请重新尝试", null, "none")
			}
		})
	})
}
module.exports = {
	register,
	login,
	insert,
	update,
	findAll,
	findOne,
	deleteOne,
	upload,
	updateAll,
	deleteAll,
	deleteFileAll,
	deleteFileOne,
	deleteFileAll2,
	destroy
}
