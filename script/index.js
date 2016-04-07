//页面加载
(function(){
	var $nav = $('.container .nav');
	var $panels =  $('.container .panels');
	$nav.append('<li class="all">全部</li>');
	$panels.append('<li>\
		<div class="box c-tabs" data-id="">\
			<div class="hd">\
				<div class="loader">\
					<input data-id="" type="button" value="重新获取"/>\
					<img src="../image/loader.gif"/>\
				</div>\
				<h2>全部</h2>\
				<ul class="c-nav"><li>最新</li></ul>\
			</div>\
			<div class="bd">\
				<ul class="c-panels"><li></li></ul>\
			</div>\
		</div>\
	</li>');
	for(var i=0;i<_data.length;i++){
		$nav.append('<li>'+_data[i]['name']+'</li>');
		var names = '';
		for(var j=0;j<_data[i]['items'].length;j++){
			names += '<li>'+_data[i]['items'][j]['name']+'</li>';
		}
		$panels.append('<li>\
			<div class="box c-tabs" data-id="">\
				<div class="hd">\
					<div class="loader">\
						<input data-id="" type="button" value="重新获取"/>\
						<img src="../image/loader.gif"/>\
					</div>\
					<h2>全部</h2>\
					<ul class="c-nav">'+names+'</ul>\
				</div>\
				<div class="bd">\
					<ul class="c-panels">'+names+'</ul>\
				</div>\
			</div>\
		</li>');
	}
	$nav.append('<li class="setting">设置</li>');
	$panels.append('<li>\
		<div class="box c-tabs">\
			<div class="hd">\
				<h2>设置</h2>\
			</div>\
			<div class="bd">\
				<p></p>\
				<p><label>黑名单:</label><textarea id="blacklist" placeholder="关键词之间使用英文\',\'分割"></textarea></p>\
				<p><label>白名单:</label><textarea id="whitelist" placeholder="关键词之间使用英文\',\'分割"></textarea></p>\
			</div>\
		</div>\
	</li>');
})();

//页面tabs效果
var $tabs = $(".tabs");
var $panels = $tabs.find(".panels>li");
var $c_tabs = $(".c-tabs");
var $c_panels = $c_tabs.find(".c-panels>li");
$tabs.tabs({
	contentCls:"panels",
	triggerType:"click"
});
$c_tabs.tabs({
	navCls:"c-nav",
	contentCls:"c-panels",
	triggerType:"click"
});

//设置
(function(){
	var $blacklist = $("#blacklist");
	var $whitelist = $("#whitelist");
	if(localStorage['blacklist']){
		$blacklist.val(localStorage['blacklist']);
	}
	if(localStorage['whitelist']){
		$whitelist.val(localStorage['whitelist']);
	}
	$blacklist.change(function(){
		localStorage['blacklist']=$blacklist.val();
	});
	$whitelist.change(function(){
		localStorage['whitelist']=$whitelist.val();
	});
})();

//默认数据加载
(function(){
	var data = {};
	var num = 0;
	if(localStorage['updateTime']&&+new Date()-localStorage['updateTime']<3.6e6*_global['expires']){	//如果再有效期内则不更新（cookie的方式失效了）
		for(var i in _config){
			 for(var j in _config[i]){
				(function(item){
					if(localStorage[item['port']]){						//缓存存在
						data = JSON.parse(localStorage[item['port']]);	//获取缓存中的数据
						data.length = _global['page_num'];				//截取缓存中第一页的数据
						_global['page'][item['port']] = Math.ceil(_global['page_num']/_global['num'][item['port']]);
						load_list(item['p'],item['c'],data);
						num++;
						if(num==_global['port_num']){
							load_list(0,0,getNewsSort());
						}
					}else{												//缓存不存在
						window[item['port']](function(data){			//请求数据借口，获取数据
							load_list(item['p'],item['c'],data);		
							num++;
							if(num==_global['port_num']){
								load_list(0,0,getNewsSort());
							}
						});
					}				
				})(_config[i][j]);
			}
		}			
	}else{																//如果缓存过期，获取全部新数据
		getNews();
	}
})();

//手动数据加载
$(".loader input").click(function(){
	var $this = $(this);
	var resource = $this.data('resource');
	var $img = $this.next().show();
	if(resource=="all"){	//如果加载的数据源是全部，则更新所有数据
		getNews(function(){
			$img.hide();
		});
	}else{
		var items = _config[resource];
		var num = 0;
		var $cpanel = $panels.eq(items[0]['p']).find(".c-panels>li").html("<span class='loading'>数据加载中...</span>");
		for(var i = 0;i <items.length;i++){
			(function(item,i){
				_global['page'][item['port']]=0;				//只加载第一页
				window[item['port']](function(data){
					$cpanel.eq(i).empty();
					load_list(item['p'],item['c'],data);		//改变当前页数据
					num++
					if(num==items.length){
						_global['page']['all'] = 0;
						load_list(0,0,getNewsSort());			//改变汇总页数据
						$img.hide();
					}				
				});		
			})(items[i],i);
		}	
	}
});

//加载更多
$(".box").on("click",".more a",function(){
	var $this = $(this);
	var $cpanel = $this.parents('.c-panels li');
	var index = $cpanel.index();
	var resource = $cpanel.parents('.box').data('resource');
	$this.replaceWith("<span>加载中...</span>");
	if(resource=="all"){							//如果加载的数据源是全部，则更新所有数据
		load_list(0,0,getNewsSort());
	}else{
		var items = _config[resource];
		item = items[index];
		window[item['port']](function(data){
			load_list(item['p'],item['c'],data);	//改变当前页数据
			_global['page']['all'] = 0;
			load_list(0,0,getNewsSort());			//改变汇总页数据		
		});
	}
	return false;
});

//加载节点
function load_list(p,c,data){
	var len = data.length;
	var sum = Math.floor(len/_global['page_num'])*_global['page_num'];	//只输入page_num的倍数
	var $panel = $panels.eq(p);
	var $c_panel = $panel.find(".c-panels li:eq("+c+")");
	if(len==_global['page_num']){	//数据只有page_num说明为非追加数据
		$c_panel.empty();
	}else{
		$c_panel.find('.more').remove();
	}
	for(var i=sum-_global['page_num']; i<sum; i++){
		var item = data[i];
		$c_panel.append("<p><span class='time'>"+showTime(item['time'])+"</span><a href='"+item['url']+"' target='_blank'>"+item['title']+"</a></p>");
	}
	$c_panel.append("<div class='more'><a href='#'>加载更多</a></div>");
}

//获取所有游戏
function getNews(callback){
	callback = callback || function(){};
	var data = [];
	var num = 0;
	localStorage['updateTime'] = +new Date(); //最后更新时间
	for(var i in _config){
		for(var j in _config[i]){
			(function(item){
				_global['page'][item['port']]=0;		//只加载第一页
				window[item['port']](function(data){
					load_list(item['p'],item['c'],data);
					num++;
					if(num==_global['port_num']){
						_global['page']['all']=0;
						load_list(0,0,getNewsSort());
						callback();
					}
				});	
			})(_config[i][j]);
		}
	}
	return data;
}