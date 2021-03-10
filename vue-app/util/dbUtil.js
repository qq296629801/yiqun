/** auther: mmm  desc: 缓存最近的消息记录  */
function queryData(gid) {
   let list = uni.getStorageSync('msgItem_'+ gid);
   list = JSON.parse(list);
   return new Promise((resolve,reject) =>{
		resolve(list);
   })
}

function initData(list, gid){
	uni.setStorageSync('msgItem_' + gid, JSON.stringify(list));
}

function upData(obj, gid){
	let list = uni.getStorageSync('msgItem_'+ gid);
	list = JSON.parse(list);
    list.splice(9,1);
    list.push(JSON.parse(JSON.stringify(obj)));
	uni.setStorageSync('msgItem_' + gid, JSON.stringify(list));
}

export {
	initData,
    queryData,
    upData,
}