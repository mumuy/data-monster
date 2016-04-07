(function(){
	var filter = {
		'script':/<script(.|\n)*?<\/script>/ig,
		'link':/<link.*?\/>/ig,
		'img':/<img.*?>/ig
	};	
})();


//判断是否为数组中的值
function in_array(val,arr){
	for(i=0;i<arr.length&&arr[i]!=val;i++);
		return!(i==arr.length);
};

//数组去重
function unique(arr) {
	var o = {}, newArr = [], i, j;
	for (i = 0; i < arr.length; i++) {
		if (typeof (o[arr[i]]) == "undefined") {
			o[arr[i]] = "";
		}
	}
	for (j in o) {
		newArr.push(j)
	}
	return newArr;
}

//添加cookie
function addCookie(objName,objValue,objHours,objDomain,objPath){
    var str = objName + "=" + escape(objValue);
    if(objHours > 0){ //为时不设定过期时间，浏览器关闭时cookie自动消失
        var date = new Date();
        var ms = objHours*3600*1000;
        date.setTime(date.getTime() + ms);
        str += "; expires=" + date.toGMTString();
        if(objDomain){
            str += ";domain="+objDomain;
        }
        if(objPath){
            str += ";path="+objPath;
        }
    }
    document.cookie = str;
}

//获取指定名称的cookie的值  
function getCookie(objName){
	var arrStr = document.cookie.split("; ");
	for(var i = 0;i < arrStr.length;i ++){
		var temp = arrStr[i].split("=");
		if(temp[0] == objName)
			return unescape(temp[1]);
	}
}

//日期格式化
function dateFormat(fmt,timestamp){
	var date = new Date(timestamp);
	var o = {   
		"M+" : date.getMonth()+1,                 //月份   
		"d+" : date.getDate(),                    //日   
		"h+" : date.getHours(),                   //小时   
		"m+" : date.getMinutes(),                 //分   
		"s+" : date.getSeconds(),                 //秒   
		"q+" : Math.floor((date.getMonth()+3)/3), //季度   
		"S"  : date.getMilliseconds()             //毫秒   
	};   
	if(/(y+)/.test(fmt))   
		fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
	for(var k in o)   
		if(new RegExp("("+ k +")").test(fmt))   
		fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}

//日期表述转换成时间戳
function toTimestamp(str){
	var time = +new Date();
	if(str.indexOf('刚刚')>-1){
	}else if(str.indexOf('分钟前')>-1){
		time -= parseInt(str)*60*1000;
	}else if(str.indexOf('天前')>-1){
		time -= parseInt(str)*60*60*1000*24;
	}else if(str.indexOf('小时前')>-1){
		if(str.indexOf('天')>-1){
			time -= parseInt(str)*60*60*1000*24;
			str = str.substr(str.indexOf('天')+1);
		}
		time -= parseInt(str)*60*60*1000;
	}else if(str.indexOf('月')>-1||str.indexOf('日')>-1){
		var date = new Date();
		str = date.getFullYear()+'-'+str;
		str = str.replace("月","-").replace("日","");
		time = Date.parse(str);
	}else{
		time = Date.parse(str);
	}
	return time;
}

//日期个性现实
function showTime(timestamp){
	var str = "";
	var length = +new Date()-timestamp;	//时间差
	if(length<6e4){
		str = '刚刚';
	}else if(length<3.6e6){
		str = ~~(length/6e4)+'分钟前';
	}else if(length<8.64e7){
		str = ~~(length/3.6e6)+'小时前';
	}else{
		str = dateFormat("yyyy-MM-dd",timestamp);
	}
	return str;
}

//获取“触乐”新鲜列表
function getChuappNews(callback){
	var posts = [];
	var port = 'getChuappNews';
	var num = _global['num'][port];
	var star = Math.floor(_global['page'][port]*num/_global['page_num']);
	var sum = (star+1)*_global['page_num'];
	var str ="";
	if(localStorage[port]){							//如果存在数据则读取
		posts = JSON.parse(localStorage[port]);		//读入数据库中的数据
		posts.length = _global['page'][port]*num;	//通过对页面总数的控制控制数据长度
	}
	do{
		_global['page'][port]++;
		$.get("http://www.chuapp.com/category/news/page/"+_global['page'][port],function(data){
			data = data.replace(/<script(.|\n)*?<\/script>/ig, '').replace(/<link.*?\/>/ig, '').replace(/<img.*?>/ig, '');//删除标签防止多余请求
			var $posts = $(data).find('.content-main-cont .post');
			$posts.each(function(){
				var $this = $(this);
				var post = {};
				post['title'] = $this.find('.li-title').text();
				post['time'] = toTimestamp($.trim($this.find('.li-label span').text().split('·')[1]));
				post['url'] = $this.find('a').attr('href');
				post['description'] = $this.find('.li-description').text();
				posts.push(post);
			});
			if(posts.length>=sum){
				posts.sort(function(a,b){
					return b['time'] - a['time'];
				});
				localStorage[port] = JSON.stringify(posts);
				callback(posts);				
			}
		});		
	}while(num*_global['page'][port]<sum);
}

//获取“触乐”触视点列表
function getChuappSd(callback){
	var posts = [];
	var port = 'getChuappSd';
	var num = _global['num'][port];
	var star = Math.floor(_global['page'][port]*num/_global['page_num']);
	var sum = (star+1)*_global['page_num'];
	var str ="";
	if(localStorage[port]){							//如果存在数据则读取
		posts = JSON.parse(localStorage[port]);		//读入数据库中的数据
		posts.length = _global['page'][port]*num;	//通过对页面总数的控制控制数据长度
	}
	do{
		_global['page'][port]++;
		$.get("http://www.chuapp.com/category/sd/page/"+_global['page'][port],function(data){
			data = data.replace(/<script(.|\n)*?<\/script>/ig, '').replace(/<link.*?\/>/ig, '').replace(/<img.*?>/ig, '');//删除标签防止多余请求
			var $posts = $(data).find('.content-main-cont .post');
			$posts.each(function(){
				var $this = $(this);
				var post = {};
				post['title'] = $this.find('.li-title').text();
				post['time'] = toTimestamp($.trim($this.find('.li-label span').text().split('·')[1]));
				post['url'] = $this.find('a').attr('href');
				post['description'] = $this.find('.li-description').text();
				posts.push(post);
			});
			if(posts.length>=sum){
				posts.sort(function(a,b){
					return b['time'] - a['time'];
				});
				localStorage[port] = JSON.stringify(posts);
				callback(posts);				
			}
		});		
	}while(num*_global['page'][port]<sum);
}

//获取“手游网”资讯列表
function getShouyouNews(callback){
	var posts = [];
	var port = 'getShouyouNews';
	var num = _global['num'][port];
	var star = Math.floor(_global['page'][port]*num/_global['page_num']);
	var sum = (star+1)*_global['page_num'];
	var str ="";
	if(localStorage[port]){							//如果存在数据则读取
		posts = JSON.parse(localStorage[port]);		//读入数据库中的数据
		posts.length = _global['page'][port]*num;	//通过对页面总数的控制控制数据长度
	}
	do{
		str = _global['page'][port]==0?"":"_"+_global['page'][port];
		_global['page'][port]++;
		$.get("http://news.shouyou.com/news/fnews"+str+".shtml",function(data){
			data = data.replace(/<script(.|\n)*?<\/script>/ig, '').replace(/<link.*?\/>/ig, '').replace(/<img.*?>/ig, '');//删除标签防止多余请求
			var $posts = $(data).find('.art-list li');
			$posts.each(function(){
				var $this = $(this);
				var post = {};
				var $link =  $this.find('.tit a');
				post['title'] = $link.text();
				post['time'] = toTimestamp($this.find('.date').text());
				post['url'] = $link.attr('href');
				post['description'] = $this.find('.txt').text();
				posts.push(post);
			});
			if(posts.length>=sum){
				posts.sort(function(a,b){
					return b['time'] - a['time'];
				});
				localStorage[port] = JSON.stringify(posts);
				callback(posts);				
			}
		});		
	}while(num*_global['page'][port]<sum);
}

//获取“老虎游戏”资讯列表
function getLaohuNews(callback){
	var posts = [];
	var port = 'getLaohuNews';
	var num = _global['num'][port];
	var star = Math.floor(_global['page'][port]*num/_global['page_num']);
	var sum = (star+1)*_global['page_num'];
	var str ="";
	if(localStorage[port]){							//如果存在数据则读取
		posts = JSON.parse(localStorage[port]);		//读入数据库中的数据
		posts.length = _global['page'][port]*num;	//通过对页面总数的控制控制数据长度
	}
	do{
		_global['page'][port]++;
		str = _global['page'][port]==1?"":"_"+_global['page'][port];
		$.get("http://www.laohu.com/xinwen/index"+str+".html",function(data){
			data = data.replace(/<script(.|\n)*?<\/script>/ig, '').replace(/<link.*?\/>/ig, '').replace(/<img.*?>/ig, '');//删除标签防止多余请求
			var $posts = $(data).find('.guideCon ul');
			$posts.each(function(){
				var $this = $(this);
				var post = {};
				var $link =  $this.find('h5 a');
				post['title'] = $link.attr('title');
				post['time'] = toTimestamp($this.find('h5 span').text());
				post['url'] = $link.attr('href');
				post['description'] = $this.find('.content').text();
				posts.push(post);
			});
			if(posts.length>=sum){
				posts.sort(function(a,b){
					return b['time'] - a['time'];
				});
				localStorage[port] = JSON.stringify(posts);
				callback(posts);				
			}
		});		
	}while(num*_global['page'][port]<sum);
}

//获取“任玩堂”新游列表
function getAppgameNews(callback){
	var posts = [];
	var port = 'getAppgameNews';
	var num = _global['num'][port];
	var star = Math.floor(_global['page'][port]*num/_global['page_num']);
	var sum = (star+1)*_global['page_num'];
	var str ="";
	if(localStorage[port]){							//如果存在数据则读取
		posts = JSON.parse(localStorage[port]);		//读入数据库中的数据
		posts.length = _global['page'][port]*num;	//通过对页面总数的控制控制数据长度
	}
	do{
		_global['page'][port]++;
		$.get("http://www.appgame.com/archives/category/apple-news/upcoming-games/page/"+_global['page'][port],function(data){
			data = data.replace(/<script(.|\n)*?<\/script>/ig, '').replace(/<link.*?\/>/ig, '').replace(/<img.*?>/ig, '');//删除标签防止多余请求
			var $posts = $(data).find('.agpostlist .post-item');
			$posts.each(function(){
				var $this = $(this);
				var post = {};
				var $link =  $this.find('h6 a');
				post['title'] = $link.text();
				post['time'] = toTimestamp($this.find('.date').text());
				post['url'] = $link.attr('href');
				post['description'] = $this.find('.p-des').text();
				posts.push(post);
			});
			if(posts.length>=sum){
				posts.sort(function(a,b){
					return b['time'] - a['time'];
				});
				localStorage[port] = JSON.stringify(posts);
				callback(posts);				
			}
		});		
	}while(num*_global['page'][port]<sum);
}

//获取“任玩堂”网络游戏列表
function getAppgameWeb(callback){
	var posts = [];
	var port = 'getAppgameWeb';
	var num = _global['num'][port];
	var star = Math.floor(_global['page'][port]*num/_global['page_num']);
	var sum = (star+1)*_global['page_num'];
	var str ="";
	if(localStorage[port]){							//如果存在数据则读取
		posts = JSON.parse(localStorage[port]);		//读入数据库中的数据
		posts.length = _global['page'][port]*num;	//通过对页面总数的控制控制数据长度
	}
	do{
		_global['page'][port]++;
		$.get("http://www.appgame.com/archives/category/game-type/mmorpg/page/"+_global['page'][port],function(data){
			data = data.replace(/<script(.|\n)*?<\/script>/ig, '').replace(/<link.*?\/>/ig, '').replace(/<img.*?>/ig, '');//删除标签防止多余请求
			var $posts = $(data).find('.agpostlist .post-item');
			$posts.each(function(){
				var $this = $(this);
				var post = {};
				var $link =  $this.find('h6 a');
				post['title'] = $link.text();
				post['time'] = toTimestamp($this.find('.date').text());
				post['url'] = $link.attr('href');
				post['description'] = $this.find('.p-des').text();
				posts.push(post);
			});
			if(posts.length>=sum){
				posts.sort(function(a,b){
					return b['time'] - a['time'];
				});
				localStorage[port] = JSON.stringify(posts);
				callback(posts);				
			}
		});		
	}while(num*_global['page'][port]<sum);
}

//获取“当乐”资讯列表
function getDNews(callback){
	var posts = [];
	var port = 'getDNews';
	var num = _global['num'][port];
	var star = Math.floor(_global['page'][port]*num/_global['page_num']);
	var sum = (star+1)*_global['page_num'];
	var str ="";
	if(localStorage[port]){							//如果存在数据则读取
		posts = JSON.parse(localStorage[port]);		//读入数据库中的数据
		posts.length = _global['page'][port]*num;	//通过对页面总数的控制控制数据长度
	}
	do{
		_global['page'][port]++;
		$.get("http://news.d.cn/news/0-0-0-"+_global['page'][port]+"-new.html",function(data){
			data = data.replace(/<script(.|\n)*?<\/script>/ig, '').replace(/<link.*?\/>/ig, '').replace(/<img.*?>/ig, '');//删除标签防止多余请求
			var $posts = $(data).find('.news-content li');
			$posts.each(function(){
				var $this = $(this);
				var post = {};
				var $link =  $this.find('.unit-tit');
				post['title'] = $link.text();
				post['time'] = toTimestamp($this.find('.unit-publish').text());
				post['url'] = "http://news.d.cn"+$link.attr('href');
				post['description'] = '';
				posts.push(post);
			});
			if(posts.length>=sum){
				posts.sort(function(a,b){
					return b['time'] - a['time'];
				});
				localStorage[port] = JSON.stringify(posts);
				callback(posts);				
			}
		});		
	}while(num*_global['page'][port]<sum);
}

//获取“爱应用”资讯列表
function getIappsNews(callback){
	var posts = [];
	var port = 'getIappsNews';
	var num = _global['num'][port];
	var star = Math.floor(_global['page'][port]*num/_global['page_num']);
	var sum = (star+1)*_global['page_num'];
	var str ="";
	if(localStorage[port]){							//如果存在数据则读取
		posts = JSON.parse(localStorage[port]);		//读入数据库中的数据
		posts.length = _global['page'][port]*num;	//通过对页面总数的控制控制数据长度
	}
	do{
		_global['page'][port]++;
		$.get("http://www.iapps.im/lists/17/page/"+_global['page'][port],function(data){
			data = data.replace(/<script(.|\n)*?<\/script>/ig, '').replace(/<link.*?\/>/ig, '').replace(/<img.*?>/ig, '');//删除标签防止多余请求
			var $posts = $(data).find('#content article');
			$posts.each(function(){
				var $this = $(this);
				var post = {};
				var $link =  $this.find('.entry-title a');
				post['title'] = $.trim($link.text());
				post['time'] = toTimestamp($this.find('.pull-left').text().match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/)[0]);
				post['url'] = $link.attr('href');
				post['description'] = $this.find('.entry-content').text();
				posts.push(post);
			});
			if(posts.length>=sum){
				posts.sort(function(a,b){
					return b['time'] - a['time'];
				});
				localStorage[port] = JSON.stringify(posts);
				callback(posts);				
			}
		});		
	}while(num*_global['page'][port]<sum);
}

//获取“游戏葡萄”资讯列表
function getYouxiputaoNews(callback){
	var posts = [];
	var port = 'getYouxiputaoNews';
	var num = _global['num'][port];
	var star = Math.floor(_global['page'][port]*num/_global['page_num']);
	var sum = (star+1)*_global['page_num'];
	var str ="";
	if(localStorage[port]){							//如果存在数据则读取
		posts = JSON.parse(localStorage[port]);		//读入数据库中的数据
		posts.length = _global['page'][port]*num;	//通过对页面总数的控制控制数据长度
	}
	do{
		_global['page'][port]++;
		$.get("http://youxiputao.com/article/index/page/"+_global['page'][port],function(data){
			data = data.replace(/<script(.|\n)*?<\/script>/ig, '').replace(/<link.*?\/>/ig, '').replace(/<img.*?>/ig, '');//删除标签防止多余请求
			var $posts = $(data).find('.render-news-list li');
			$posts.each(function(){
				var $this = $(this);
				var post = {};
				var $link =  $this.find('.thumb a');
				post['title'] = $link.attr('title');
				post['time'] = toTimestamp($this.find('.index-info span:eq(1)').text());
				post['url'] = "http://youxiputao.com"+$link.attr('href');
				post['description'] = $this.find('p').text();
				posts.push(post);
			});
			if(posts.length>=sum){
				posts.sort(function(a,b){
					return b['time'] - a['time'];
				});
				localStorage[port] = JSON.stringify(posts);
				callback(posts);				
			}
		});		
	}while(num*_global['page'][port]<sum);
}

//获取所有游戏资讯排序
function getNewsSort(){
	var data = [];
	if(_global['page']['all']){
		_global['page']['all']++;
	}else{
		_global['page']['all']=1;
	}
	for(var i in _config){
		for(var j in _config[i]){
			var item = _config[i][j];
			var arr = JSON.parse(localStorage[item['port']]);
			data = data.concat(arr);	
		}
	}
	data = filter(data); //过滤数据
	data.sort(function(a,b){
		return b['time'] - a['time'];
	});
	data.length = Math.min(data.length,_global['page']['all']*_global['page_num']);
	return data;
}

function filter(data){
	var blacklist = [];
	var whitelist = [];
	var list1 = [];
	var list2 = [];
	if(localStorage['blacklist']){//获取黑名单数据
		blacklist = localStorage['blacklist'].split(",");
	}
	if(localStorage['whitelist']){//获取白名单数据
		whitelist = localStorage['whitelist'].split(",");
	}
	var len = data.length;
	var b_len = blacklist.length;
	var w_len = whitelist.length;
	for(var i = 0;i<len;i++){
		var isFilter = false;
		var text = data[i]['title'];
		for(var j=0;j<b_len;j++){  //如果在黑名单中，则过滤掉
			if(text.indexOf(blacklist[j])>0){
				isFilter = true;
				break;
			}
		}
		if(isFilter){
			for(var j=0;j<w_len;j++){ //如果在黑名单，同时又在白名单中，则不过滤
				if(text.indexOf(whitelist[j])>0){
					isFilter = false;
					break;
				}
			}
		}
		if(isFilter){	//最终过滤出需要的数据
			list2.push(data[i]);
		}else{
			list1.push(data[i]);
		}
	}
	console.log("过滤条目：",list2); //将过滤的数据在控制台打出，而有用的进行返回
	return list1;
}