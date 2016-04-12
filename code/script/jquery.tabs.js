(function($) {
    $.fn.tabs = function(parameter) {
        parameter = parameter || {};
        var defaults = {
            contentCls: "content",
            navCls: "nav",
            selectedCls: "active",
            triggerType: 'mouse',
            triggerCondition: "*",
            activeIndex: 0,
            beforeEvent: function() {
            },
            afterEvent: function() {
            }
        };
        var options = $.extend({}, defaults, parameter);
        return this.each(function() {
            var $this = $(this);
            var $content_list = $this.find("." + options.contentCls).children();
            var $nav_list = $this.find("." + options.navCls + ">" + options.triggerCondition);
            $nav_list.removeClass(options.selectedCls).eq(options.activeIndex).addClass(options.selectedCls);
            $content_list.hide().eq(options.activeIndex).show();
            options.triggerType += options.triggerType === "mouse" ? "enter" : "";  //使用mouseenter防止事件冒泡
            $nav_list.bind(options.triggerType, function(e) {
                var i = $nav_list.index($(this));
                var status = {
                    target:$this,
                    tabs:$nav_list,
                    panels:$content_list,
                    index:i
                }
                if(options.beforeEvent(e,status)!=false){
                    $nav_list.removeClass(options.selectedCls).eq(i).addClass(options.selectedCls);
                    $content_list.hide().eq(i).show();
                    options.afterEvent(e,status);
                }
            });
        });
    };
})(jQuery);