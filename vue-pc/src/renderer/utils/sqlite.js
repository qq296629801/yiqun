/**
 * talk 库 s_group_msg 消息表
 *
 * @author yemao
 * @date 2019-11-07
 */
const sqlite = {
  open: () => {
    if (window.plus.sqlite.isOpenDatabase({
      name: 'talk',
      path: '_doc/talk.db'
    })) {
    } else {
      window.plus.sqlite.openDatabase({
        name: 'talk',
        path: '_doc/talk.db',
        success: () => {
        },
        fail: (e) => {
          console.log('打开数据库 failed: ' + JSON.stringify(e))
        }
      })
    }
  },
  create: (chatType) => {
    window.plus.sqlite.executeSql({
      name: 'talk',
      sql: chatType === 1 ? 'create table if not exists s_group_msg("id" INT(11) PRIMARY KEY NOT NULL,"groupId" CHAR(255),"msgType" INT(11),"sendUid" CHAR(255),"msgContext" TEXT,"status" INT(11),"operTime" INT,"lastOperTime" INT,"operUser" CHAR(255),"lastOperUser" CHAR(255),"avatar" CHAR(255),"userName" CHAR(255),"groupNickName" CHAR(255))'
        : 'create table if not exists s_friend_msg("id" INT(11) PRIMARY KEY NOT NULL,"receiveUid" CHAR(255),"msgType" INT(11),"sendUid" CHAR(255),"msgContext" TEXT,"status" INT(11),"operTime" INT,"lastOperTime" INT,"operUser" CHAR(255),"lastOperUser" CHAR(255),"avatar" CHAR(255),"userName" CHAR(255),"remarkName" CHAR(255))',
      success: () => {
        console.log('创建数据库 success!')
      },
      fail: (e) => {
        console.log('创建数据库 failed: ' + JSON.stringify(e))
      }
    })
  },
  stopRecord: (chatType, id) => {
    window.plus.sqlite.executeSql({
      name: 'talk',
      sql: chatType === 1 ? 'UPDATE s_group_msg SET status = 3 WHERE id =' + id
        : 'UPDATE s_friend_msg SET status = 3 WHERE id =' + id,
      success: () => {
        console.log('插入数据库 success!')
      },
      fail: (e) => {
        console.log('插入数据库 failed: ' + JSON.stringify(e))
      }
    })
  },
  insert: (m, chatType) => {
    if (window.plus.sqlite.isOpenDatabase({
      name: 'talk',
      path: '_doc/talk.db'
    })) {
    } else {
      window.plus.sqlite.openDatabase({
        name: 'talk',
        path: '_doc/talk.db',
        success: () => {
        },
        fail: (e) => {
          console.log('打开数据库 failed: ' + JSON.stringify(e))
        }
      })
    }
    window.plus.sqlite.executeSql({
      name: 'talk',
      sql: chatType === 1 ? "INSERT INTO s_group_msg (`id`, `groupId`, `msgType`, `sendUid`, `msgContext`, `status`, `operTime`, `operUser`, `lastOperTime`, `lastOperUser`, `avatar`, `userName`, `groupNickName`) VALUES ('" + m.id + "', '" + m.groupId + "', '" + m.msgType + "', '" + m.sendUid + "', '" + m.msgContext + "', '" + m.status + "', '" + (m.operTime / 1000) + "', '" + m.userName + "', '" + (m.operTime / 1000) + "', '" + m.userName + "', '" + m.avatar + "', '" + m.userName + "', '" + m.groupNickName + "')"
        : "INSERT INTO s_friend_msg (`id`, `receiveUid`, `msgType`, `sendUid`, `msgContext`, `status`, `operTime`, `operUser`, `lastOperTime`, `lastOperUser`, `avatar`, `userName`, `remarkName`) VALUES ('" + m.id + "', '" + m.receiveUid + "', '" + m.msgType + "', '" + m.sendUid + "', '" + m.msgContext + "', '" + m.status + "', '" + (m.operTime / 1000) + "', '" + m.userName + "', '" + (m.operTime / 1000) + "', '" + m.userName + "', '" + m.avatar + "', '" + m.userName + "', '" + m.remarkName + "')",
      success: () => {
        console.log('插入数据库 success!')
      },
      fail: (e) => {
        console.log('插入数据库 failed: ' + JSON.stringify(e))
      }
    })
  },
  sync: (msgList, chatType) => {
    window.plus.sqlite.executeSql({
      name: 'talk',
      sql: getSplicing(chatType, msgList),
      success: () => {
        console.log('插入数据库 success!')
      },
      fail: (e) => {
        console.log('插入数据库 failed: ' + JSON.stringify(e))
      }
    })
  },
  delete: (id, chatType) => {
    window.plus.sqlite.executeSql({
      name: 'talk',
      sql: chatType === 1 ? (id === -1 ? 'DELETE FROM s_group_msg' : 'DELETE FROM s_group_msg WHERE id = ' + id)
        : (id === -1 ? 'DELETE FROM s_friend_msg' : 'DELETE FROM s_friend_msg WHERE id = ' + id),
      success: () => {
        console.log('删除消息 success!')
      },
      fail: (e) => {
        console.log('删除消息 fail: ' + JSON.stringify(e))
      }
    })
  },
  deleteGroupByChatId: (chatId) => {
    window.plus.sqlite.executeSql({
      name: 'talk',
      sql: "DELETE FROM s_group_msg WHERE groupId = '" + chatId + "'",
      success: () => {
        console.log('清空 success!')
      },
      fail: (e) => {
        console.log('清空 fail: ' + JSON.stringify(e))
      }
    })
  },
  update: (context, id, chatType) => {
    window.plus.sqlite.executeSql({
      name: 'talk',
      sql: chatType === 1 ? "UPDATE s_group_msg SET msgContext ='" + context + "' WHERE id =" + id
        : "UPDATE s_friend_msg SET msgContext ='" + context + "' WHERE id =" + id,
      success: () => {
        console.log('更新 success!')
      },
      fail: (e) => {
        console.log('更新 fail: ' + JSON.stringify(e))
      }
    })
  },
  close: () => {
    if (window.plus.sqlite.isOpenDatabase({
      name: 'talk',
      path: '_doc/talk.db'
    })) {
      window.plus.sqlite.closeDatabase({
        name: 'talk',
        success: () => {
        },
        fail: (e) => {
          console.log('关闭 fail: ' + JSON.stringify(e))
        }
      })
    }
  }
}
function getSplicing (chatType, msgList) {
  let groupSql = 'INSERT INTO s_group_msg (`id`, `groupId`, `msgType`, `sendUid`, `msgContext`, `status`, `operTime`, `operUser`, `lastOperTime`, `lastOperUser`, `avatar`, `userName`, `groupNickName`) VALUES '
  let friendSql = 'INSERT INTO s_friend_msg (`id`, `receiveUid`, `msgType`, `sendUid`, `msgContext`, `status`, `operTime`, `operUser`, `lastOperTime`, `lastOperUser`, `avatar`, `userName`, `remarkName`) VALUES '
  for (var i in msgList) {
    let m = msgList[i]
    let sqlTo = "('" + m.id + "', '" + m.groupId + "', '" + m.msgType + "', '" + m.sendUid + "', '" + m.msgContext + "', '" + m.status + "', '" + (m.operTime / 1000) + "', NULL, '" + (m.operTime / 1000) + "', NULL, '" + m.avatar + "', '" + m.userName + "', '" + m.groupNickName + "')"
    let sqlOne = "('" + m.id + "', '" + m.receiveUid + "', '" + m.msgType + "', '" + m.sendUid + "', '" + m.msgContext + "', '" + m.status + "', '" + (m.operTime / 1000) + "', NULL, '" + (m.operTime / 1000) + "', NULL, '" + m.avatar + "', '" + m.userName + "', '" + m.remarkName + "')"
    if (chatType === 1) {
      if (i === 0) {
        groupSql += sqlTo
      } else {
        groupSql += ',' + sqlTo
      }
    } else {
      if (i === 0) {
        friendSql += sqlOne
      } else {
        friendSql += ',' + sqlOne
      }
    }
  }
  return chatType === 1 ? groupSql : friendSql
}
export default sqlite
