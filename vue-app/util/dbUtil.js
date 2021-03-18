/** auther: mmm  desc: 缓存最近的消息记录  */
function queryData(gid) {
   let list = uni.getStorageSync('msgItem_'+ gid);
   return new Promise((resolve,reject) =>{
	   try{
		    if(list==""){
				resolve([]);
				return;
			}
	   	    list = JSON.parse(list);
			list.sort((a, b) => { return a.id - b.id });
	   }catch(e){
	   	   reject(e)
	   }
	   resolve(list);
   })
}
function initData(list, gid){
	uni.setStorageSync('msgItem_' + gid, JSON.stringify(list));
}

function upCanceData(id,gid,obj){
	let list = uni.getStorageSync('msgItem_'+ gid);
	if(list==""){
		let tempItem = [];
		tempItem.push(JSON.parse(JSON.stringify(obj)));
		uni.setStorageSync('msgItem_' + gid, JSON.stringify(tempItem));
		return;
	}
	list = JSON.parse(list);
	for(var i in list){
		if(list[i].id===id){
			list.splice(i,1);
		}
	}
	uni.setStorageSync('msgItem_' + gid, JSON.stringify(list));
}

function upRedData(id,gid,msgContext){
	let list = uni.getStorageSync('msgItem_'+ gid);
	if(list==""){
		let tempItem = [];
		tempItem.push(JSON.parse(JSON.stringify(obj)));
		uni.setStorageSync('msgItem_' + gid, JSON.stringify(tempItem));
		return;
	}
	list = JSON.parse(list);
	for(var i in list){
		if(list[i].id===id){
			list[i].msgContext = msgContext;
		}
	}
	uni.setStorageSync('msgItem_' + gid, JSON.stringify(list));
}

function upData(obj, gid){
	let list = uni.getStorageSync('msgItem_'+ gid);
	if(list==""){
		let tempItem = [];
		tempItem.push(JSON.parse(JSON.stringify(obj)));
		uni.setStorageSync('msgItem_' + gid, JSON.stringify(tempItem));
		return;
	}
	list = JSON.parse(list);
	if(list.length>=10){
		list.splice(0,1);
	}
    list.push(JSON.parse(JSON.stringify(obj)));
	uni.setStorageSync('msgItem_' + gid, JSON.stringify(list));
}
export {
	initData,
    queryData,
    upData,
	upRedData,
	upCanceData
}