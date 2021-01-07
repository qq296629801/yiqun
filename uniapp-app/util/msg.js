function openMsgSqlite(){
	//创建数据库或者打开
	return new Promise((resolve,reject) =>{
		 plus.sqlite.openDatabase({
			name:'msg',  //数据库名称
			path:'_doc/msg.db',   
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
function createMsgSQL(groupId){
	return new Promise((resolve,reject) =>{
	//创建表格在executeSql方法里写
		plus.sqlite.executeSql({
			name:'msg',
			//表格创建或者打开，后面为表格结构
			sql:'create table if not exists s_group_msg_'+groupId+' ("id" INT(11) PRIMARY KEY NOT NULL,"groupId" CHAR(255),"msgType" INT(11),"sendUid" CHAR(255),"msgContext" TEXT,"status" INT(11),"operTime" INT,"lastOperTime" INT,"operUser" CHAR(255),"lastOperUser" CHAR(255),"avatar" CHAR(255),"userName" CHAR(255),"groupNickName" CHAR(255))', 
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
function addMsgSQL(obj){
	//判断有没有传参
	if(obj !== undefined){
		//判断传的参是否有值
		var b = (JSON.stringify(obj) == "{}");
		if(!b){
			//obj传来的参数对象
			var id = obj.id || null; //id
			var groupId = obj.groupId || null; //名称
			var msgType = obj.msgType || 0; //性别
			var sendUid = obj.sendUid || null; //发送
			var msgContext = obj.msgContext || null; //内容
			var operTime = obj.operTime || null; //操作时间
			var userName = obj.userName || null; //用户昵称
			var avatar = obj.avatar || null; //头像
			var groupNickName = obj.groupNickName || null; //群昵称
			var status = obj.status || 0; //状态
			return new Promise((resolve,reject) =>{
				plus.sqlite.executeSql({
					name:'msg',
					sql:"INSERT INTO s_group_msg_" + groupId + " (`id`, `groupId`, `msgType`, `sendUid`, `msgContext`, `status`, `operTime`, `operUser`, `lastOperTime`, `lastOperUser`, `avatar`, `userName`, `groupNickName`) VALUES ('" + id + "', '" + groupId + "', '" + msgType + "', '" + sendUid + "', '" + msgContext + "', '" + status + "', '" + (operTime / 1000) + "', '" + userName + "', '" + (operTime / 1000) + "', '" + userName + "', '" + avatar + "', '" + userName + "', '" + groupNickName + "')",
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
function selectMsgSQL(groupId){
	if(groupId !== undefined){
		//第一个是表单名称，后两个参数是列表名，用来检索
		var sql = 'select * from s_group_msg_'+groupId;
		return new Promise((resolve,reject)=>{
			plus.sqlite.selectSql({
				name:'msg',
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
function deleteMsgSQL(name,sol,qq,ww,ee){
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
				name:'msg',
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
function modifyMsgSQL(listName,name,cont,use,sel){
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
			name:'msg',
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
			name:'msg',
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
	var ss = name || 'msg';
	var qq = path || '_doc/msg.db';
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
			name:'msg',
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
	openMsgSqlite,
	createMsgSQL,
	addMsgSQL,
	selectMsgSQL
}