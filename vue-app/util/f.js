function openFSqlite(){
	//创建数据库或者打开
	return new Promise((resolve,reject) =>{
		 plus.sqlite.openDatabase({
			name:'f',  //数据库名称
			path:'_doc/f.db',   
			//数据库地址，uniapp推荐以下划线为开头，这到底存在哪里去了，我也不清楚，哈哈
			success(e){
				resolve(e); //成功回调
			},
			fail(e){
				reject(e); //失败回调
			}
		})
	})	
}

//在该数据库里创建表格，   这一步也必须要！
function createFSQL(userId){
	return new Promise((resolve,reject) =>{
	//创建表格在executeSql方法里写
		plus.sqlite.executeSql({
			name:'f',
			//表格创建或者打开，后面为表格结构
			sql:'create table if not exists s_friend_'+userId+' ("id" INT(11) PRIMARY KEY NOT NULL,"nickName" CHAR(255),"name" CHAR(255),"avatar" CHAR(255))', 
			success(e){
				resolve(e);
			},
			fail(e){
				reject(e);
			}
		})
	})
}

//向表格里添加数据
function addFSQL(obj,userId){
	//判断有没有传参
	if(obj !== undefined){
		//判断传的参是否有值
		var b = (JSON.stringify(obj) == "{}");
		if(!b){
			//obj传来的参数对象
			var id = obj.id || null; //id
			var nickName = obj.nickName || null; //昵称
			var name = obj.name || null; //字母
			var avatar = obj.avatar || null; //头像
			return new Promise((resolve,reject) =>{
				plus.sqlite.executeSql({
					name:'f',
					sql:"INSERT INTO s_friend_" + userId + " (`id`, `nickName`, `name`, `avatar`) VALUES ('" + id + "', '" + nickName + "', '" + name + "', '" + avatar + "')",
					success(e){
						resolve(e);
					},
					fail(e){
						reject(e);
					}
				})
			})
		}else{
			return new Promise((resolve,reject) =>{reject("错误添加")})
		}
	}else{
		return new Promise((resolve,reject) =>{reject("错误添加")})
	}
}

//查询获取数据库里的数据
function selectFSQL(userId){
	if(userId !== undefined){
		//第一个是表单名称，后两个参数是列表名，用来检索
		var sql = 'select * from s_friend_'+userId;
		return new Promise((resolve,reject)=>{
			plus.sqlite.selectSql({
				name:'f',
				sql:sql,
				success(e){
					resolve(e);
				},
				fail(e){
					reject(e);
				}
			})
		})
	}else{
		return new Promise((resolve,reject) =>{reject("错误查询")});
	}
}

//删除数据库里的数据
function deleteFSQL(name,sol,qq,ww,ee){
	if(name !== undefined && sol !== undefined){
		//listId为表名,后面两个是列表名，检索用的
		if(ww !== undefined){
			//两个检索条件
			var sql = 'delete from '+name+' where '+sol+'="'+qq+'" and '+ww+'='+ee+'';
		}else{
			//一个检索条件
			var sql = 'delete from '+name+' where '+sol+'="'+qq+'"';
		}
		return new Promise((resolve,reject) =>{
			plus.sqlite.executeSql({
				name:'f',
				sql:sql,
				success(e){
					resolve(e);
				},
				fail(e){
					reject(e);
				}
			})
		})
	}else{
		return new Promise((resolve,reject) =>{reject("错误删除")});
	}
}

//修改数据表里的数据
function modifyFSQL(listName,name,cont,use,sel){
	//表格名，要修改地方的列名，修改后的内容，修改条件查询，列名，内容
	var sql;
	if(use == undefined){
		sql ='update '+listName+' set '+name+'="'+cont+'"';
	}else{
		sql ='update '+listName+' set '+name+'="'+cont+'" where '+use+'="'+sel+'"';
	}
	//where前面的是要修改的，后面的是条件，选择哪个
	return new Promise((resolve,reject) =>{
		plus.sqlite.executeSql({
			name:'f',
			sql:sql,
			success(e){
				resolve(e);
			},
			fail(e){
				reject(e);
			}
		})
	})
}

//关闭数据库
function closeSQL(name){
	return new Promise((resolve,reject) =>{
		plus.sqlite.closeDatabase({
			name:'f',
			success(e){
				resolve(e);
			},
			fail(e){
				reject(e);
			}
		})
	})
}

//监听数据库是否开启
function isOpen(name,path){
	var ss = name || 'f';
	var qq = path || '_doc/f.db';
	//数据库打开了就返回true,否则返回false
	var open = plus.sqlite.isOpenDatabase({
					name:ss,
					path:qq
				})
	return open;
}

//一次获取指定数据条数
function pullSQL(id,num){
	//id为表名，num为跳过多少条数据
	//根据list来倒序拿数据，跳过num条拿取15条
	return new Promise((resolve,reject) =>{
		plus.sqlite.selectSql({
			name:'f',
			sql:'select * from '+id+' order by list desc limit 15 offset '+num+'',
			success(e){
				resolve(e);
			},
			fail(e){
				reject(e);
			}
		})
	})
}
//把这些方法导出去
export{
	openFSqlite,
	createFSQL,
	addFSQL,
	selectFSQL
}