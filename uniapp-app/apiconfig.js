/**
 * version 1.1.7
 */
import request from 'request.js'
class apiconfig {
  constructor(config = {}) {
        this.baseurl= 'http://120.27.95.106:9999/';
		this.pathconfig={
			checkUpdate: this.baseurl +'/checkVersion'
		}
  }
  getCheckVersion(config){
  	   return request.get(this.pathconfig.checkUpdate,config);
  }
}

if (!global.$apiconfig) {
  global.$apiconfig = new apiconfig();
}

export default global.$apiconfig;