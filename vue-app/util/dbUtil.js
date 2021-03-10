/** auther: mmm  desc: 缓存最近的消息记录  */
function queryData(gid) {
   let list = localStorage.getItem("msgItem_"+ gid);
   list = JSON.parse(list);
   return new Promise((resolve,reject) =>{
		resolve(list);
   })
}

function initData(list, gid){
	localStorage.setItem("msgItem_"+ gid,JSON.stringify(list));
}

function upData(obj, gid){
	let list = localStorage.getItem("msgItem_" + gid);
	list = JSON.parse(list);
    list.splice(9,1);
    list.push(JSON.parse(JSON.stringify(obj)));
	localStorage.setItem("msgItem_" + gid,JSON.stringify(list));
}

export {
	initData,
    queryData,
    upData,
}