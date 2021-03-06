import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

let lifeData = {};

try {
	// 尝试获取本地是否存在lifeData变量，第一次启动APP时是不存在的
	lifeData = uni.getStorageSync('lifeData');
} catch (e) {

}

// 需要永久存储，且下次APP启动需要取出的，在state中的变量名
let saveStateKeys = ['_user_info','chatlist','firendList','userData'];

// 保存变量到本地存储中
const saveLifeData = function(key, value) {
	// 判断变量名是否在需要存储的数组中
	if (saveStateKeys.indexOf(key) != -1) {
		// 获取本地存储的lifeData对象，将变量添加到对象中
		let tmp = uni.getStorageSync('lifeData');
		// 第一次打开APP，不存在lifeData变量，故放一个{}空对象
		tmp = tmp ? tmp : {};
		tmp[key] = value;
		// 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
		uni.setStorageSync('lifeData', tmp);
	}
}
const store = new Vuex.Store({
	state: {
		links:[],
		// 如果上面从本地获取的lifeData对象下有对应的属性，就赋值给state中对应的变量
		userData:lifeData.userData?lifeData.userData:{},
		_textMsg:'',
		//@功能数据存储
		_call_selected:{},
		_call_s:lifeData._call_s ? lifeData._call_s : [],
		//群成员 有索引A~Z
		_members:lifeData.members ? lifeData.members : [],
		//群成员 没有索引
		_membersNoneIndex:[],
		chatList:lifeData.chatList ? lifeData.chatList :[],
		_redenvelope:lifeData._redenvelope ? lifeData._redenvelope : {},
		chatObj:{
		  chatId:'',
		  chatType:0,
		  chatName:'测试'
		},
		// 如果vuex_version无需保存到本地永久存储，无需lifeData.vuex_version方式
		vuex_version: '1.0.1',
		//朋友圈展示信息
		circleData: [
		],
		//我的朋友
		firendList: lifeData.firendList?lifeData.firendList:[],
		//内置朋友圈相册banner图
		circleBgList:[
			{ src:require('@/static/image/circleBanner/1.jpg'),isCheck:false },
			{ src:require('@/static/image/circleBanner/2.jpg'),isCheck:false },
			{ src:require('@/static/image/circleBanner/3.jpg'),isCheck:false },
			{ src:require('@/static/image/circleBanner/4.jpg'),isCheck:false },
		],
	},
	mutations: {
		$uStore(state, payload) {
			// 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
			let nameArr = payload.name.split('.');
			let saveKey = '';
			let len = nameArr.length;
			if (nameArr.length >= 2) {
				let obj = state[nameArr[0]];
				for (let i = 1; i < len - 1; i++) {
					obj = obj[nameArr[i]];
				}
				obj[nameArr[len - 1]] = payload.value;
				saveKey = nameArr[0];
			} else {
				// 单层级变量，在state就是一个普通变量的情况
				state[payload.name] = payload.value;
				saveKey = payload.name;
			}
			// 保存变量到本地，见顶部函数定义
			saveLifeData(saveKey, state[saveKey])
		},
	},
	
})

export default store
