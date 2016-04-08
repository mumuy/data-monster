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
function getNews(id,callback){
	var posts = [];
	var ids = id.split(',');
	var item = _data[ids[0]]['items'][ids[1]];
	var count = item['count'];
	_global['page'][id] = _global['page'][id]||0;
	var star = Math.floor(_global['page'][id]*count/_global['page_count']);
	var sum = (star+1)*_global['page_count'];
	var str ="";
	if(localStorage[id]){							//如果存在数据则读取
		posts = JSON.parse(localStorage[id]);		//读入数据库中的数据
		posts.length = _global['page'][id]*count;		//通过对页面总数的控制控制数据长度
	}
	do{
		_global['page'][id]++;
		var port = item['port'].replace(/\[page\]/,_global['page'][id]);
		$.get(port,function(data){
			data = data.replace(/<script(.|\n)*?<\/script>/ig, '').replace(/<link.*?\/>/ig, '').replace(/<img.*?>/ig, '');//删除标签防止多余请求
			var $posts = $(data).find(item['item']);
			$posts.each(function(){
				var $this = $(this);
				var post = {};
				post['title'] = $this.find(item['title']).text();
				post['time'] = toTimestamp($this.find(item['time']).text());
				post['url'] = $this.find(item['url']).attr('href');
				post['description'] = $this.find(item['description']).text();
				posts.push(post);
			});
			if(posts.length>=sum){
				posts.sort(function(a,b){
					return b['time'] - a['time'];
				});
				localStorage[id] = JSON.stringify(posts);
				callback(posts);
			}
		});		
	}while(count*_global['page'][id]<sum);
}

//获取所有游戏资讯排序
function getNewsSort(){
	var data = [];
	if(_global['page']['all']){
		_global['page']['all']++;
	}else{
		_global['page']['all']=1;
	}
	for(var i=0;i<_data.length;i++){
		for(var j=0;j<_data[i]['items'].length;j++){
			var id = i+','+j;
			var item = _data[i]['items'][j];
			var arr = JSON.parse(localStorage[id]);
			data = data.concat(arr);	
		}
	}
	data = filter(data); //过滤数据
	data.sort(function(a,b){
		return b['time'] - a['time'];
	});
	data.length = Math.min(data.length,_global['page']['all']*_global['page_count']);
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