//配置文件
_data = [
	{
		'name':'触乐',
		'items':[{
			'name':'新鲜事',
			'url':'http://www.chuapp.com/category/news/page/[page]',
			'item':'.content-main-cont .post',
			'title':'.li-title',
			'url':'a',
			'time':'.li-label span',
			'description':'.li-description',
			'count':10
		},{
			'name':'触视点',
			'url':'http://www.chuapp.com/category/sd/page/[page]',
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
			'url':'http://news.shouyou.com/news/fnews_[page].shtml',
			'item':'.art-list li',
			'title':'.tit a',
			'url':'.tit a',
			'time':'.date',
			'description':'.txt',
			'count':15
		}]
	},{
		'name':'老虎游戏',
		'items':[{
			'name':'新鲜事',
			'url':'http://www.laohu.com/xinwen/index_[page].html',
			'item':'.agpostlist .post-item',
			'title':'h6 a',
			'url':'h6 a',
			'time':'.date',
			'description':'.p-des',
			'count':12
		}]
	},{
		'name':'爱应用',
		'items':[{
			'name':'新闻',
			'url':'http://www.iapps.im/lists/17/page/[page]',
			'item':'#content article',
			'title':'.entry-title a',
			'url':'.entry-title a',
			'time':'.pull-left',
			'description':'.entry-content',
			'count':10
		}]
	}
];

var _config = {
	'www.chuapp.com':[{
		'p':1,
		'c':0,
		'port':'getChuappNews'
	},{
		'p':1,
		'c':1,
		'port':'getChuappSd'
	}],
	'news.shouyou.com':[{
		'p':2,
		'c':0,
		'port':'getShouyouNews'
	}],
	'www.laohu.com':[{
		'p':3,
		'c':0,
		'port':'getLaohuNews'
	}],
	'www.appgame.com':[{
		'p':4,
		'c':0,
		'port':'getAppgameNews'
	},{
		'p':4,
		'c':1,
		'port':'getAppgameWeb'
	}],
	'news.d.cn':[{
		'p':5,
		'c':0,
		'port':'getDNews'
	}],
	'www.iapps.im':[{
		'p':6,
		'c':0,
		'port':'getIappsNews'
	}],
	'youxiputao.com':[{
		'p':7,
		'c':0,
		'port':'getYouxiputaoNews'
	}]
}
var _global = {
	'port_num' : 9,
	'page': {
		'all':0,
		'getChuappNews':0,
		'getChuappSd':0,
		'getShouyouNews':0,
		'getLaohuNews':0,
		'getAppgameNews':0,
		'getAppgameWeb':0,
		'getDNews':0,
		'getIappsNews':0,
		'getYouxiputaoNews':0
	},
	'num': {
		'all':0,
		'getChuappNews':10,
		'getChuappSd':10,
		'getShouyouNews':15,
		'getLaohuNews':12,
		'getAppgameNews':18,
		'getAppgameWeb':18,
		'getDNews':12,
		'getIappsNews':10,
		'getYouxiputaoNews':10
	},
	'page_num':20,
	'expires':2
}