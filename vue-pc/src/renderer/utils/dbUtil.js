/** auther: mmm  desc: 缓存最近的消息记录  */
function queryData(gid) {
   let list = localStorage.getItem('msgItem_'+ gid);
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
    localStorage.setItem('msgItem_' + gid, JSON.stringify(list));
}
function upData(obj, gid){
	let list = localStorage.getItem('msgItem_'+ gid);
	if(list==""){
		let tempItem = [];
		tempItem.push(JSON.parse(JSON.stringify(obj)));
        localStorage.setItem('msgItem_' + gid, JSON.stringify(tempItem));
		return;
	}
	list = JSON.parse(list);
	if(list.length>=10){
		list.splice(0,1);
	}
    list.push(JSON.parse(JSON.stringify(obj)));
    localStorage.setItem('msgItem_' + gid, JSON.stringify(list));
}
export {
	initData,
    queryData,
    upData,
}