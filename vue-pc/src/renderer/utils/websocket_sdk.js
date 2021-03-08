import packetCode from './PacketCodeC.js'
import webim from "./webim";
import store from "../store/store";
let socket
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
        socket.onerror = function (event) {
            webim.isConnected = false
            // 停止心跳连接
            if (this._heartCheck) {
                this._reset();
            }
            // 关闭已登录开关
            this._isLogin = false;
            // 检测是否是用户自己退出小程序
            if (!this._isClosed) {
                // 进行重连
                if (this._isReconnection) {
                    this._reConnect(options)
                }
            }
        }
    }
    _onSocketOpened() {
        let _this = this;
        socket.onopen = function (event) {
            // 打开已登录开关
            _this._isLogin = true;
            // 发送心跳
            if (this._heartCheck) {
                _this._reset()._start();
            }
            // 发送登录信息
            _this.sendLoginData();
            // 打开网络开关
            _this._netWork = true;
        }
    }
    // 接收服务器返回的消息
    onReceivedMsg(callBack) {
        socket.onmessage = function (event) {
            if (typeof callBack == "function") {
                callBack(event)
            }
        }
    }

    // 建立websocket连接
    initWebSocket(options) {
        let _this = this;
        if (!this._isLogin) {
            socket = new WebSocket(options.url)
            socket.binaryType = 'arraybuffer'
            _this._onSocketOpened();
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
          token: store.state.userData.token,
		}
        this.sendBinary(99, {
            data: packet,
            success(res) {
            },
            fail(err) {
            }
        });
    }

    //发送第一次连接数据
    sendLoginData() {
        this.sendBinary(99, {
            data: {},
            success(res) {
            },
            fail(err) {
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
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(packetCode.encode(options.data))
        }
    }
}