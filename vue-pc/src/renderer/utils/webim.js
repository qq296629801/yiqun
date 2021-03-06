import packetCode from './PacketCodeC'
import store from '../store/store'
import SKIMSDK from './websocket_sdk.js'
let eventDispatcher

const EventDispatcher = function () {
  this.listeners = {}
}

const WEBIM = {
    resource: "web",
    CHAT: "chat",
    GROUPCHAT: "groupchat",
    token: null,
    userId: null,
    nickName: "",
    isReadDel: 0,
    userIdStr: null,
    serverUrl: null,
    server: null,
    sendTimeOut: 15,
    waitReceiptMessageIds: {},
    heartCheck: false,
    isReconnection: false,
    options: null,
    initWebIM: function(serverUrl, heartCheck, isReconnection) {
        WEBIM.heartCheck = heartCheck;
        WEBIM.isReconnection = isReconnection;
        WEBIM.serverUrl = serverUrl;
        WEBIM.options = {
            url: serverUrl,
            success(res) {},
            fail() {}
        }
        eventDispatcher = new EventDispatcher();

        WEBIM.server = new SKIMSDK({
            heartCheck: heartCheck,
            isReconnection: isReconnection,
        });
        WEBIM.server.initWebSocket(WEBIM.options);

        WEBIM.server.onReceivedMsg(event => {
            let packet = packetCode.decode(event.data);
            let command = packet.command;
            eventDispatcher.dispatchEvent(command, toJSON(packet))
            eventDispatcher.removeListener(command, toJSON(packet))
            if (command == -10){
               store.state.pushRes = packet;
            }
        });
        WEBIM.server.onSocketClosed(WEBIM.options)
    },
    disconnect: function(e) {
        WEBIM.server.closeWebSocket()
    },
    isConnect: function() {
        return WEBIM.server._isLogin;
    },

  register: (packet, func) => {
    packet.version = 1
    packet.command = 49
    send(packet)
    eventDispatcher.addListener('50', func)
  },
  login: (username, password, code, func) => {
    let requestPacket = {
      username,
      password,
      code: code,
      version: 1,
      command: 1
    }
    send(requestPacket)
    eventDispatcher.addListener('2', func)
  },

  heartTest: (userId, func) => {
    let packet = {
      userId,
      version: 1,
      command: 17
    }
    send(packet)
    eventDispatcher.addListener('18', func)
  },

  send2Group: (toGroupId, userId, message, msgType, func) => {
    let requestPacket = {
      toGroupId,
      userId,
      msgType,
      message,
      version: 1,
      command: 15
    }
    send(requestPacket)
    eventDispatcher.addListener('16', func)
  },
  send2Friend: (toUserId, userId, message, msgType, func) => {
    let requestPacket = {
      userId,
      toUserId,
      msgType,
      message,
      version: 1,
      command: 3
    }
    send(requestPacket)
    eventDispatcher.addListener('4', func)
  },

  logout: (userId, func) => {
    let requestPacket = {
      userId,
      version: 1,
      command: 5
    }
    send(requestPacket)
    eventDispatcher.addListener('6', func)
  },

  createGroup: (userIdList, defaultGroupName, userId, func) => {
    let requestPacket = {
      userId,
      userIdList,
      defaultGroupName,
      version: 1,
      command: 7
    }
    send(requestPacket)
    eventDispatcher.addListener('8', func)
  },

  queryMembers: (groupId, userId, func) => {
    let requestPacket = {
      groupId,
      userId,
      version: 1,
      command: 9
    }
    send(requestPacket)
    eventDispatcher.addListener('10', func)
  },

  getLastMessage: (id, chatId, userId, chatType, func) => {
    let requestPacket = {
      id: id,
      chatId,
      userId,
      chatType,
      version: 1,
      command: 45
    }
    send(requestPacket)
    eventDispatcher.addListener('46', func)
  },

  joinGroup: (groupId, ids, userName, func) => {
    let requestPacket = {
      groupId,
      userIds: ids,
      currentUsername: userName,
      version: 1,
      command: 11
    }
    send(requestPacket)
    eventDispatcher.addListener('12', func)
  },
  delGroupMember: (groupId, ids, func) => {
    let requestPacket = {
      groupId,
      userIds: ids,
      version: 1,
      command: 13
    }
    send(requestPacket)
    eventDispatcher.addListener('14', func)
  },
  transferGroup: (groupId, userId, func) => {
    let requestPacket = {
      groupId,
      userId,
      version: 1,
      command: 53
    }
    send(requestPacket)
    eventDispatcher.addListener('54', func)
  },
  getGroups: (condition, userId, func) => {
    let requestPacket = {
      condition,
      userId,
      version: 1,
      command: 25
    }
    send(requestPacket)
    eventDispatcher.addListener('26', func)
  },

  listGuests: (userId, func) => {
    let packet = {
      userId,
      version: 1,
      command: 47
    }
    send(packet)
    eventDispatcher.addListener('48', func)
  },

  queryFriendMessages: (toUserId, userId, pageNum, func) => {
    let requestPacket = {
      userId,
      pageNum,
      toUserId,
      pageSize: 10,
      version: 1,
      command: 27
    }
    send(requestPacket)
    eventDispatcher.addListener('28', func)
  },
  getFriendMessageByCondition: (toUserId, userId, pageNum, condition, func) => {
    let requestPacket = {
      userId,
      condition,
      pageNum,
      toUserId,
      pageSize: 5,
      version: 1,
      command: 27
    }
    send(requestPacket)
    eventDispatcher.addListener('28', func)
  },
  queryGroupMessages: (toGroupId, userId, pageNum, func) => {
    let requestPacket = {
      toGroupId,
      pageNum,
      pageSize: 10,
      userId,
      version: 1,
      command: 23
    }
    send(requestPacket)
    eventDispatcher.addListener('24', func)
  },
  getGroupMessageByCondition: (toGroupId, userId, pageNum, condition, func) => {
    let requestPacket = {
      toGroupId,
      pageNum,
      condition,
      pageSize: 5,
      userId,
      version: 1,
      command: 23
    }
    send(requestPacket)
    eventDispatcher.addListener('24', func)
  },

  chats: (condition, userId, func) => {
    let requestPacket = {
      condition,
      userId,
      pageNum: -1,
      pageSize: -1,
      version: 1,
      command: 19
    }
    send(requestPacket)
    eventDispatcher.addListener('20', func)
  },
  updateNickName: (userId, nickName, func) => {
    let requestPacket = {
      userId,
      nickName,
      version: 1,
      command: 79
    }
    send(requestPacket)
    eventDispatcher.addListener('80', func)
  },
  getBusinessCard: (userId, func) => {
    let requestPacket = {
      userId,
      version: 1,
      command: 65
    }
    send(requestPacket)
    eventDispatcher.addListener('66', func)
  },
  createChatList: (userId, groupId, message, msgType, func) => {
    let requestPacket = {
      userId,
      groupId,
      msgType,
      message,
      version: 1,
      command: 61
    }
    send(requestPacket)
    eventDispatcher.addListener('62', func)
  },
  randomSmsCode: (phone, func) => {
    let req = {
      userId: '5f6d9d98',
      phone,
      version: 1,
      command: 63
    }
    send(req)
    eventDispatcher.addListener('64', func)
  },
  getCustomerServiceList: (userId, func) => {
    let requestPacket = {
      userId,
      version: 1,
      command: 93
    }
    send(requestPacket)
    eventDispatcher.addListener('94', func)
  },
  deleteEmontion: (userId, motionId, func) => {
    let requestPacket = {
      userId,
      motionId,
      version: 1,
      command: 95
    }
    send(requestPacket)
    eventDispatcher.addListener('96', func)
  },
  stopAudio: (userId, chatId, chatType, func) => {
    let requestPacket = {
      userId,
      chatId,
      chatType,
      method: 21,
      version: 1,
      command: 21
    }
    send(requestPacket)
    eventDispatcher.addListener('22', func)
  },
  queryGroupUser: (userId, groupId, func) => {
    let requestPacket = {
      userId,
      groupId,
      method: 17,
      version: 1,
      command: 67
    }
    send(requestPacket)
    eventDispatcher.addListener('68', func)
  },
  getUserRemark: (userId, friendUserId, func) => {
    let requestPacket = {
      friendUserId,
      userId,
      method: 10,
      version: 1,
      command: 21
    }
    send(requestPacket)
    eventDispatcher.addListener('22', func)
  },
  updateAvatar: (userId, avatar, func) => {
    let requestPacket = {
      userId,
      avatar,
      version: 1,
      command: 97
    }
    send(requestPacket)
    eventDispatcher.addListener('98', func)
  },
  getUserById: (userId, func) => {
    let requestPacket = {
      userId,
      version: 1,
      command: 65
    }
    send(requestPacket)
    eventDispatcher.addListener('66', func)
  },
  deleteGroupMsg: (userId, msgId, groupId, func) => {
    let requestPacket = {
      userId,
      msgId,
      groupId,
      method: 5,
      version: 1,
      command: 81
    }
    send(requestPacket)
    eventDispatcher.addListener('82', func)
  },
  deleteFriendMsg: (userId, chatId, func) => {
    let requestPacket = {
      userId,
      chatId,
      version: 1,
      command: 73
    }
    send(requestPacket)
    eventDispatcher.addListener('74', func)
  },
  updateRemarkName: (userId, friendUserId, remarkName, func) => {
    let requestPacket = {
      userId,
      friendUserId,
      remarkName,
      method: 7,
      version: 1,
      command: 21
    }
    send(requestPacket)
    eventDispatcher.addListener('22', func)
  },
  updatePassword: (userId, username, password, func) => {
    let requestPacket = {
      userId,
      username,
      password,
      version: 1,
      command: 77
    }
    send(requestPacket)
    eventDispatcher.addListener('78', func)
  },
  uploadContact: (name, phone, userId, func) => {
    let requestPacket = {
      name,
      phone,
      userId,
      method: 9,
      version: 1,
      command: 21
    }
    send(requestPacket)
    eventDispatcher.addListener('22', func)
  },
  freshCode: (func) => {
    let requestPacket = {
      method: 4,
      version: 1,
      command: 21
    }
    send(requestPacket)
    eventDispatcher.addListener('22', func)
  },
  deleteChatById: (userId, chatId, func) => {
    let requestPacket = {
      userId,
      chatId,
      version: 1,
      command: 83
    }
    send(requestPacket)
    eventDispatcher.addListener('84', func)
  },
  updateGroupNick: (userId, groupId, nickName, func) => {
    let requestPacket = {
      userId,
      groupId,
      nickName,
      version: 1,
      command: 79
    }
    send(requestPacket)
    eventDispatcher.addListener('80', func)
  },
  attend: (chat, userId, func) => {
    let requestPacket = {
      userId,
      chat,
      version: 1,
      command: 75
    }
    send(requestPacket)
    eventDispatcher.addListener('76', func)
  },
  queryMsgByChatId: (msgId, groupId, userId, func) => {
    let requestPacket = {
      userId,
      msgId,
      groupId,
      version: 1,
      command: 69
    }
    send(requestPacket)
    eventDispatcher.addListener('70', func)
  },
  addEmoticon(userId, avatar, func) {
    let requestPacket = {
      userId,
      avatar,
      version: 1,
      command: 71
    }
    send(requestPacket)
    eventDispatcher.addListener('72', func)
  },
  getEmoticons(userId, func) {
    let requestPacket = {
      userId,
      version: 1,
      command: 85
    }
    send(requestPacket)
    eventDispatcher.addListener('86', func)
  },
  updateGroupName: (userId, groupId, groupName, func) => {
    let requestPacket = {
      userId,
      groupId,
      groupName,
      version: 1,
      command: 91
    }
    send(requestPacket)
    eventDispatcher.addListener('92', func)
  },
  clearGroupMsg: (userId, groupId, func) => {
    let requestPacket = {
      userId,
      groupId,
      version: 1,
      command: 87
    }
    send(requestPacket)
    eventDispatcher.addListener('88', func)
  },
  openChat: (chatId, userId, chatType, func) => {
    let requestPacket = {
      userId,
      chatId,
      chatType,
      version: 1,
      command: 39
    }
    send(requestPacket)
    eventDispatcher.addListener('40', func)
  },
  getMoneys(userId, pageNum, func) {
    let requestPacket = {
      pageNum,
      pageSiz: 5,
      userId,
      version: 1,
      command: 41
    }
    send(requestPacket)
    eventDispatcher.addListener('42', func)
  },
  queryNotice(userId, groupId, func) {
    let requestPacket = {
      userId,
      groupId,
      action: 'query',
      version: 1,
      command: 43
    }
    send(requestPacket)
    eventDispatcher.addListener('44', func)
  },
  updateNotice(userId, groupId, context, func) {
    let requestPacket = {
      userId,
      groupId,
      action: 'update',
      context,
      version: 1,
      command: 43
    }
    send(requestPacket)
    eventDispatcher.addListener('44', func)
  },
  removeGroupUser(userIds, groupId, func) {
    let requestPacket = {
      userIds,
      groupId,
      version: 1,
      command: 51
    }
    send(requestPacket)
    eventDispatcher.addListener('52', func)
  },
  insertFriend(userId, friendId, func) {
    let requestPacket = {
      userId,
      friendId,
      version: 1,
      command: 55
    }
    send(requestPacket)
    eventDispatcher.addListener('56', func)
  },
  // ????????????
	findFriendRequestList: (nickName, func) => {
		let requestPacket = {
			nickName,
			version: 1,
			command: 89
		}
		send(requestPacket)
		eventDispatcher.addListener('90', func)
	},
  // ?????????????????????
  queryFriendRequestList(userId, func) {
    let requestPacket = {
      userId,
      version: 1,
      command: 57
    }
    send(requestPacket)
    eventDispatcher.addListener('58', func)
  },
  // ??????????????????
  AcceptFriendRequest(friendId, userId, func) {
    let requestPacket = {
      friendId,
      userId,
      version: 1,
      command: 59
    }
    send(requestPacket)
    eventDispatcher.addListener('60', func)
  },
  
  queryPostsReq: (userId, pageNum, func) => {
		let requestPacket = {
			pageNum,
			pageSize: 10,
			userId,
			version: 1,
			command: 106
		}
		send(requestPacket)
		eventDispatcher.addListener('107', func)
	},
	
	createPostReq: (userId, postContext, urls, func) => {
		let requestPacket = {
			postContext,
			urls,
			pageSize: 10,
			userId,
			version: 1,
			command: 102
		}
		send(requestPacket)
		eventDispatcher.addListener('103', func)
	},
	
	toFabulousRes: (id, userId, postId, func) => {
		let requestPacket = {
			id,
			postId,
			pageSize: 10,
			userId,
			version: 1,
			command: 108
		}
		send(requestPacket)
		eventDispatcher.addListener('109', func)
	},
	
	toCommentReqPacket: (id, userId, postId, comment, func) => {
		let requestPacket = {
			id,
			postId,
			comment,
			pageSize: 10,
			userId,
			version: 1,
			command: 104
		}
		send(requestPacket)
		eventDispatcher.addListener('105', func)
	},
    groupDisEnable(groupId, status, func){
        let req = {
            groupId,
            status,
            version: 1,
            command: 114
        }
        send(req)
        eventDispatcher.addListener('115', func)
    },
    joinRoom:(groupIds, func) =>{
        let p={
            groupIds,
            version: 1,
            command: -1
        }
        send(p)
        eventDispatcher.addListener('-2', func)
    },
    quitRoom:(groupIds, func) =>{
        let p={
            groupIds,
            version: 1,
            command: -3
        }
        send(p)
        eventDispatcher.addListener('-4', func)
    },
    queryOnlineMessage(userId, func){
        let p={
            userId,
            version: 1,
            command: -7
        }
        send(p)
        eventDispatcher.addListener('-6', func)
    },
}

function toJSON(packet) {
  return JSON.parse(JSON.stringify(packet))
}

EventDispatcher.prototype.addListener = function (eventKey, fun, context) {
  let list = []
  this.listeners[eventKey] = list
  let listener = {
    func: fun,
    context: context
  }
  list.push(listener)
  return listener
}

EventDispatcher.prototype.removeListener = function (eventKey, fun, context) {
  let list = this.listeners[eventKey]
  if (list !== undefined) {
    let size = list.length
    for (let i = 0; i < size; i++) {
      let listener = list[i]
      if (listener.func === fun && listener.context === context) {
        list.splice(i, 1)
        return
      }
    }
  }
}

EventDispatcher.prototype.dispatchEvent = function (eventKey, event) {
  let list = this.listeners[eventKey]
  if (list !== undefined) {
    let size = list.length
    for (let i = 0; i < size; i++) {
      let listener = list[i]
      let fun = listener.func
      let context = listener.context
      if (context != null) {
        fun.call(context, event)
      } else {
        fun(event)
      }
    }
  }
}

let send = (packet) => {
  if (!window.WebSocket) {
    alert('????????????????????????WebSocket')
    return
  }

  if(store.state.userData.token!=undefined){
      packet.token = store.state.userData.token
  }

  WEBIM.server.sendWebSocketMsg({
      data: packet,
      success(res) {},
      fail(err) {}
  });

}

export default WEBIM
