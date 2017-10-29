/**
 * Created by zhengpeng on 2017/8/24.
 */
/**
 * 命名空间
 * @param  {[type]} str  'xm.componet'
 * @return {[type]}     [description]
 */


// 所有页面的基类
(function(window, $) {
    window.BasePage = {
        init: function () {
            var self = this;

            self.isInApp = /iting/i.test(navigator.userAgent.toLowerCase());
            self.isInWeixin = /micromessenger/i.test(navigator.userAgent);

            self.doInit();

        },
        addExtraParam: function(url, p) {
            var index = url.indexOf('?'),
                setSearchStr = function(str, p) {
                    var refes = str.split("&"),
                        item = null;
                    sp = {};

                    for (var i = 0; i < refes.length; i++) {
                        item = refes[i];
                        var iArr = item.split("=");
                        if (iArr[0]) {
                            sp[iArr[0]] = iArr[1];
                        }
                    };
                    return $.param($.extend(sp, p));
                };

            if (index === -1) {
                var arr = url.split('#');
                return arr[0] + '?' + $.param(p) + ((arr[1] && arr[1].length > 0) ? '#' + arr[1] : '');
            } else {
                var arr = url.split('?'),
                    tem = arr[1];

                if (tem && tem !== '') {
                    var arr3 = tem.split('#'),
                        search = '';
                    if (arr3.length > 1) {
                        return arr[0] + '?' + setSearchStr(arr3[0], p) + '#' + arr3[1];
                    } else {
                        return arr[0] + '?' + setSearchStr(arr3[0], p);
                    }
                }
                return arr[0];
            }
            return url;
        }
    }


})(window, jQuery);