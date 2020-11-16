// 格式化时间
export function formatDateTime(date) {
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  let d = date.getDate();
  d = d < 10 ? '0' + d : d;
  let h = date.getHours();
  h = h < 10 ? '0' + h : h;
  let minute = date.getMinutes();
  minute = minute < 10 ? '0' + minute : minute;
  let second = date.getSeconds();
  second = second < 10 ? '0' + second : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}

/**
 * 毫秒转换友好的显示格式
 * 输出格式：21小时前
 * @param  {[type]} date 日期
 */
export function dateStr(date) {
  // 获取js 时间戳
  let time = new Date().getTime();
  // 去掉 js 时间戳后三位
  time = parseInt((time - date * 1000) / 1000);

  // 存储转换值
  let s;
  if (time < 60 * 10) {
    // 十分钟内
    return '刚刚';
  } else if (time < 60 * 60 && time >= 60 * 10) {
    // 超过十分钟少于1小时
    s = Math.floor(time / 60);
    return s + '分钟前';
  } else if (time < 60 * 60 * 24 && time >= 60 * 60) {
    // 超过1小时少于24小时
    s = Math.floor(time / 60 / 60);
    return s + '小时前';
  } else if (time < 60 * 60 * 24 * 3 && time >= 60 * 60 * 24) {
    // 超过1天少于3天内
    s = Math.floor(time / 60 / 60 / 24);
    return s + '天前';
  } else {
    // 超过3天
    let date = new Date(parseInt(date) * 1000);
    return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
  }
}

/**
 * 聊天会话
 */
export class Chat {
  constructor(id, name, avatar, unReadCount, lastMessage, mobile, email, type) {
    this.id = id;
    this.name = name;
    this.avatar = avatar;
    this.unReadCount = unReadCount;
    this.lastMessage = lastMessage;
    this.mobile = mobile;
    this.email = email;
    this.type = type;
  }
}

/**
 * 图片加载完成处理函数
 * @param arr 图片的src集合
 * @returns {Promise}
 */
function preloadImages(arr) {
  let loadedImage = 0;
  let images = [];
  return new Promise(function (resolve, reject) {
    for (let i = 0; i < arr.length; i++) {
      images[i] = new Image();
      images[i].src = arr[i];
      images[i].onload = function () {
        loadedImage++;
        if (loadedImage === arr.length) {
          resolve();
        }
      };
      images[i].onerror = function () {
        reject();
      };
    }
  });
}

/**
 * 图片加载完成，聊天对话框scroll拉到最下
 * @param id 容器id
 */
export function imageLoad(id) {
  scrollBottom(id);
  let messageBox = document.getElementById(id);
  if (messageBox) {
    let images = messageBox.getElementsByTagName('img');
    if (images) {
      let arr = [];
      for (let i = 0; i < images.length; i++) {
        arr[i] = images[i].src;
      }
      preloadImages(arr)
        .then(() => {
          scrollBottom(id);
        })
        .catch(function () {
          scrollBottom(id);
        });
    }
  }
}

/**
 * 滚动条到最下方
 * @param id 容器id
 */
function scrollBottom(id) {
  let div = document.getElementById(id);
  if (div) {
    div.scrollTop = div.scrollHeight;
  }
}

const list = [
  "微笑", "撇嘴", "色", "发呆", "得意", "流泪", "害羞", "闭嘴", "睡", "大哭", "尴尬", "发怒", "调皮", "呲牙", "惊讶", "难过", "囧", "抓狂", "吐", "偷笑", "愉快", "白眼", "傲慢", "困", "惊恐", "流汗", "憨笑", "悠闲", "奋斗", "咒骂", "疑问", "嘘", "晕", "衰", "骷髅", "敲打", "再见", "擦汗", "抠鼻", "鼓掌", "坏笑", "左哼哼", "右哼哼", "哈欠", "鄙视", "委屈", "快哭了", "阴险", "亲亲", "可怜", "菜刀", "西瓜", "啤酒", "咖啡", "猪头", "玫瑰", "凋谢", "嘴唇", "爱心", "心碎", "蛋糕", "炸弹", "便便", "月亮", "太阳", "拥抱", "强", "弱", "握手", "胜利", "抱拳", "勾引", "拳头", "OK", "跳跳", "发抖", "怄火", "转圈", "高兴", "口罩", "笑哭", "吐舌头", "傻呆", "恐惧", "悲伤", "不屑", "嘿哈", "捂脸", "奸笑", "机智", "皱眉", "耶", "鬼脸", "合十", "加油", "庆祝", "礼物", "红包", "鸡"
]

export let faceUtils = {
  alt: list.map(item => `[${item}]`),
  faces: () => {
    let obj = {}
    for (let i = 0; i < list.length; i++) {
      const key = `[${list[i]}]`
      obj[key] = `./static/face/${i}.png`
    }
    return obj;
  }
};

export function transform(content) {
  // 支持的html标签
  let html = function (end) {
    return new RegExp('\\n*\\[' + (end || '') + '(code|pre|div|span|p|table|thead|th|tbody|tr|td|ul|li|ol|li|dl|dt|dd|h2|h3|h4|h5)([\\s\\S]*?)]\\n*', 'g');
  };
  let fa = faceUtils.faces();
  if (content) {
    content = content
      .replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/'/g, '&#39;')
      .replace(/"/g, '&quot;') // XSS
      .replace(/@(\S+)(\s+?|$)/g, '@<a href="javascript:;">$1</a>$2')

      .replace(/\[([^\s\[\]]+?)]/g, function (face) {
        // 转义表情
        let alt = face.replace(/^/g, '');
        return '<img width="30" alt="' + fa[alt] + '" title="' + fa[alt] + '" src="' + fa[alt] + '">';
      })
      .replace(/img\[([^\s]+?)]/g, function (img) {
        // 转义图片
        let href = img.replace(/(^img\[)|(]$)/g, '');
        return '<img class="message-img" src="' + href + '" alt="消息图片不能加载">';
      })
      .replace(/file\([\s\S]+?\)\[[\s\S]*?]/g, function (str) {
        // 转义文件
        let href = (str.match(/file\(([\s\S]+?)\)\[/) || [])[1];
        let text = (str.match(/\)\[([\s\S]*?)]/) || [])[1];
        if (!href) return str;
        return '<a class="message-file" href="' + href + '"><i class="ivu-icon ivu-icon-md-arrow-down"></i>' + (text || href) + '</a>';
      })
      .replace(/audio\[([^\s]+?)]/g, function (audio) {
        // 转义音频
        return '<div class="message-audio" data-src="' + audio.replace(/(^audio\[)|(]$)/g, '') + '"><i class="layui-icon">&#xe652;</i><p>音频消息</p></div>';
      })
      .replace(/video\[([^\s]+?)]/g, function (video) {
        // 转义音频
        return '<div class="message-video"  data-src="' + video.replace(/(^video\[)|(]$)/g, '') + '"><i class="layui-icon">&#xe652;</i></div>';
      })
      .replace(/a\([\s\S]+?\)\[[\s\S]*?]/g, function (str) {
        // 转义链接
        let href = (str.match(/a\(([\s\S]+?)\)\[/) || [])[1];
        let text = (str.match(/\)\[([\s\S]*?)]/) || [])[1];
        if (!href) return str;
        return '<a href="' + href + '" target="_blank">' + (text || href) + '</a>';
      })
      .replace(html(), '<$1 $2>')
      .replace(html('/'), '</$1>') // 转移HTML代码
      .replace(/\n/g, '<br>'); // 转义换行
  }
  return content;
}

export const ChatListUtils = {
  listKey: '_chatList',
  setChatList: function (userId, chatList) {
    localStorage.setItem(userId + this.listKey, JSON.stringify(chatList));
  },
  //从缓存中获取已经保存的会话
  getChatList: function (userId) {
    let str = localStorage.getItem(userId + this.listKey);
    if (!str) {
      return [];
    }
    return JSON.parse(str);
  },
  //删除聊天会话框
  delChat: function (userId, chat) {
    let tempChatList = [];
    for (let item of this.getChatList(userId)) {
      if (String(item.id) !== String(chat.id)) {
        tempChatList.push(item);
      }
    }
    // 放入缓存
    this.setChatList(userId, tempChatList);
    return tempChatList;
  },
  /**
   * 刷新会话列表
   * @param self 当前对象
   * @param user 用户
   * @param host 主机名
   * @param type 0 单聊 1 群聊
   * @returns {Chat} 当前会话
   */
  resetChatList: function (self, user, host, type) {
    let chatList = this.getChatList(self.$store.state.user.id);
    // 删除当前用户已经有的会话
    let newChatList = chatList.filter(function (element) {
      return String(element.id) !== String(user.id);
    });

    let avatar = user.avatar;
    if (user.avatar.indexOf(host) === 0) {
      avatar = user.avatar;
    } else {
      avatar = host + user.avatar;
    }
    // 重新添加会话，放到第一个
    let chat = new Chat(user.id, user.name, avatar, 0, '', user.mobile, user.email, type);
    newChatList.unshift(chat);
    // 存储到localStorage 的 chatList
    this.setChatList(self.$store.state.user.id, chatList);
    self.$store.commit('setChatList', newChatList);
    return chat;
  }
};
//信息的类型 MSG_PING 心跳 、MSG_READY 链接就绪  MSG_MESSAGE 消息
export const MessageInfoType = {
  MSG_PING: '0',
  MSG_READY: '1',
  MSG_MESSAGE: '2'
};
//信息的目标类型 FRIEND 私聊 、CHAT_GROUP 群聊
export const MessageTargetType = {
  FRIEND: '0',
  CHAT_GROUP: '1'
};


export const ErrorType = {
  TIMEOUT_ERROR: 9, //超时
  TOKEN_ERROR: 401, //token 失效错误
  PARAM_ERROR: 400, //参数错误
  FLUSH_TOKEN_ERROR: 7, //刷新token错误
  SERVER_ERROR: 500, //服务器错误
  NET_ERROR: 'TypeError: Failed to fetch' //网络链接不通
};
