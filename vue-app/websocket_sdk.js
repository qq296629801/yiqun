import packetCode from './PacketCodeC.js'
import store from './store/index.js'
export default class Websocket {
    constructor({
        heartCheck,
        isReconnection
    }) {
        // 是否连接
        this._isLogin = false;
        // 当前网络状态
        this._netWork = true;
        // 是否人为退出
        this._isClosed = false;
        // 心跳检测频率
        this._timeout = 3000;
        this._timeoutObj = null;
        // 当前重连次数
        this._connectNum = 0;
        // 心跳检测和断线重连开关，true为启用，false为关闭
        this._heartCheck = heartCheck;
        this._isReconnection = isReconnection;
        // this._onSocketOpened();
    }
    // 心跳重置
    _reset() {
        clearTimeout(this._timeoutObj);
        return this;
    }
    // 心跳开始
    _start() {
        let _this = this;
        this._timeoutObj = setInterval(() => {
            //发送心跳
            _this.sendHeartbeatData();
        }, this._timeout);
    }
    // 监听websocket连接关闭
    onSocketClosed(options) {
		uni.onSocketError(err => {
			console.log('当前websocket连接已关闭,错误信息为:' + JSON.stringify(err));
			// 停止心跳连接
			if (this._heartCheck) {
			    this._reset();
			}
			// 关闭已登录开关
			this._isLogin = false;
			// 检测是否是用户自己退出小程序
			console.log('------------------开启重连--------------------------------')
			if (!this._isClosed) {
			    // 进行重连
			    if (this._isReconnection) {
			        this._reConnect(options)
			    }
			}
			
		})
        uni.onSocketClose(err => {
        })
    }
    // 检测网络变化
    onNetworkChange(options) {
        uni.onNetworkStatusChange(res => {
            console.log('当前网络状态:' + res.isConnected);
            if (!this._netWork) {
                this._isLogin = false;
                // 进行重连
                if (this._isReconnection) {
                    this._reConnect(options)
                }
            }
        })
    }
    _onSocketOpened() {
        uni.onSocketOpen(res => {
            console.log('【websocket】已打开');
            // 打开已登录开关
            this._isLogin = true;
            // 发送心跳
            if (this._heartCheck) {
                this._reset()._start();
            }
            // 发送登录信息
            this.sendLoginData();
            // 打开网络开关
            this._netWork = true;
        })
    }
    // 接收服务器返回的消息
    onReceivedMsg(callBack) {
        uni.onSocketMessage(event => {
            if (typeof callBack == "function") {
                callBack(event)
            } else {
                console.log('参数的类型必须为函数')
            }
        })
    }

    // 建立websocket连接
    initWebSocket(options) {
        let _this = this;
        if (this._isLogin) {
            console.log("您已经登录了");
        } else {
            // 检查网络
            uni.getNetworkType({
                success(result) {
                    if (result.networkType != 'none') {
                        // 开始建立连接
                        console.log('建立websocket连接' + options.url);
                        uni.connectSocket({
                            url: options.url,
                            success(res) {
                                if (typeof options.success == "function") {
                                    options.success(res)
                                    _this._onSocketOpened();
                                } else {
                                    console.log('参数的类型必须为函数')
                                }
                            },
                            fail(err) {
                                if (typeof options.fail == "function") {
                                    options.fail(err)
                                } else {
                                    console.log('参数的类型必须为函数')
                                }
                            }
                        })
                    } else {
                        console.log('网络已断开');
                        _this._netWork = false;
                        // 网络断开后显示model
                        uni.showModal({
                            title: '网络错误',
                            content: '请重新打开网络',
                            showCancel: false,
                            success: function(res) {
                                if (res.confirm) {
                                    console.log('用户点击确定')
                                }
                            }
                        })
                    }
                }
            })
        }
    }
    // 发送websocket消息
    sendWebSocketMsg(options) {
        this.sendBinary(1,options);
    }

    //发送心跳连接
    sendHeartbeatData() {
		let packet = {
		  version: 1,
		  command: 17,
		  token: store.state.userData.token
		}
        this.sendBinary(99, {
            data: packet,
            success(res) {
              // console.log('【websocket】心跳连接成功');
            },
            fail(err) {
                console.log('【websocket】心跳连接失败');
                console.log(err)
				//开启重连
				
            }
        });
    }

    //发送第一次连接数据
    sendLoginData() {
        this.sendBinary(99, {
            data: {},
            success(res) {
                console.log('【websocket】第一次连接成功')
            },
            fail(err) {
                console.log('【websocket】第一次连接失败')
                console.log(err)
            }
        });
        // this.sendBinary(99, {});
        // socket.sendSocketMessage({
        //  // 这里是第一次建立连接所发送的信息，应由前后端商量后决定
        //  data: JSON.stringify({
        //      "key": 'value'
        //  })
        // })
    }

    // 重连方法，会根据时间频率越来越慢
    _reConnect(options) {
        let timer, _this = this;
        if (this._connectNum < 20) {
            timer = setTimeout(() => {
                this.initWebSocket(options)
            }, 500)
            this._connectNum += 1;
        } else if (this._connectNum < 50) {
            timer = setTimeout(() => {
                this.initWebSocket(options)
            }, 1000)
            this._connectNum += 1;
        } else {
            timer = setTimeout(() => {
                this.initWebSocket(options)
            }, 3000)
            this._connectNum += 1;
        }
    }
    // 关闭websocket连接
    closeWebSocket() {
        uni.closeSocket();
        this._isClosed = true;
    }

    //发送二进制
    sendBinary(commendType, options) {
        uni.sendSocketMessage({
            data: packetCode.encode(options.data),
            success(res) {
                if (typeof options.success == "function") {
                    options.success(res)
                } else {
                    console.log('参数的类型必须为函数')
                }
            },
            fail(err) {
                if (typeof options.fail == "function") {
                    options.fail(err)
                } else {
                    console.log('参数的类型必须为函数')
                }
            }
        });
    }
}