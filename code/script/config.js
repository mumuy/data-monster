//配置文件
//数据参数
_data = [
	{
		'name':'触乐',
		'items':[{
			'name':'新鲜事',
			'port':'http://www.chuapp.com/category/news/page/[page]',
			'item':'.content-main-cont .post',
			'title':'.li-title',
			'url':'a',
			'time':'.li-label span',
			'description':'.li-description',
			'count':10
		},{
			'name':'触视点',
			'port':'http://www.chuapp.com/category/sd/page/[page]',
			'item':'.content-main-cont .post',
			'title':'.li-title',
			'url':'a',
			'time':'.li-label span',
			'description':'.li-description',
			'count':10
		}]
	},{
		'name':'手游网',
		'items':[{
			'name':'资讯',
			'port':'http://news.shouyou.com/news/fnews_[page].shtml',
			'item':'.art-list li',
			'title':'.tit a',
			'url':'.tit a',
			'time':'.date',
			'description':'.txt',
			'count':15
		}]
	},{
		'name':'爱应用',
		'items':[{
			'name':'新闻',
			'port':'http://www.iapps.im/lists/17/page/[page]',
			'item':'#content article',
			'title':'.entry-title a',
			'url':'.entry-title a',
			'time':'.pull-left',
			'description':'.entry-content',
			'count':10
		}]
	}
];
//控制参数
var _global = {
	'page': {},				//页码记录(动态)
	'page_count':20,		//每页显示多少条记录
	'expires':2 			//本地缓存的生存周期
}