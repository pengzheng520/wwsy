/**
 * Created by zhengpeng on 2017/10/26.
 */
function everyVoice() {
    //图片缩放系数
    this.imgZoomRadio = 5;
    //cover对象,报错一些参数
    this.cover = {
        translateX: 0   //滑动距离
    };
    this.init();

}

everyVoice.prototype = {
    init: function () {
        //page对象
        this.$page = $("body > .page");
        //包裹专辑list对象
        this.$coverList = $("#coverList");
        //专辑jq对象
        this.$oldCoverItem = this.$coverList.find('.cover-item');
        this.$coverItem = this.$oldCoverItem;
        //专辑数量
        this.$coverItemNum = this.$coverItem.length;
        //边距
        this.coverImgMR = parseFloat(this.$coverItem.eq(0).css('marginRight'));

        //绑定事件
        this.bindEvents();
        //fmCanvas
        this.fmCanvas();
    },
    bindEvents: function () {
        var self = this;

        if (self.$coverItemNum == 1 || self.$coverItemNum == 2) {
            //设置active位置,
            self.setActiveCoverPosition();
        } else if (self.$coverItemNum > 2) {

            //计数
            self.$coverItem.each(function (i, v) {
                $(this).attr('data-slide-index', i);
            });

            //增加前
            var cloneLast = self.$coverItem.last().clone().addClass('slide-duplicate');
            this.$coverList.prepend(cloneLast);
            var cloneTwoLast = self.$coverItem.eq(self.$coverItemNum - 2).clone().addClass('slide-duplicate');
            this.$coverList.prepend(cloneTwoLast);

            //增加尾
            var cloneFirst = self.$coverItem.first().clone().addClass('slide-duplicate').removeClass('cover-active');
            this.$coverList.append(cloneFirst);
            var cloneTwoFirst = self.$coverItem.eq(1).clone().addClass('slide-duplicate');
            this.$coverList.append(cloneTwoFirst);

            //设置active位置,
            self.setActiveCoverPosition();

            //更新Item对象
            //专辑jq对象
            self.$coverItem = this.$coverList.find('.cover-item');
            //专辑数量
            self.$coverItemNum = this.$coverItem.length;
        }

        self.bindCoverEvents();

    },

    //设置active位置,
    setActiveCoverPosition: function (options) {
        var self = this;
        var mL = (self.$page.width() - this.$coverList.find('.cover-active').get(0).getBoundingClientRect().width) / 2;

        var defaultOption = {
            duration: 500
        };

        var option = $.extend(defaultOption, options);

        //获得cover-active第几个位置
        var $active = self.$coverList.find(".cover-active");
        var i = $active.index();
        var d = 0;
        if (i > 0) {
            d = ($active.prev().get(0).getBoundingClientRect().width + self.coverImgMR) * i;
        }

        mL = mL - d;

        self.cover.translateX = mL;

        move('#coverList')
            .duration(option.duration)
            .translate(mL, 0)
            .end();

        //重新定义translateX
        self.cover.translateX = mL;
    },

    //判断当前active是否在duplicate上,如果在则重置位置
    judgePosition: function () {
        var $coverActive = $(".cover-active")
        var hasDuplicate = $coverActive.hasClass('slide-duplicate');
        if (hasDuplicate) {
            var index = $coverActive.attr('data-slide-index');
            $coverActive.removeClass('cover-active');
            this.$oldCoverItem.eq(index).addClass('cover-active');
        }
        this.setActiveCoverPosition({
            duration: 0
        })
    },

    bindCoverEvents: function () {
        var self = this;

        //封面绑定
        self.$coverList.on('touchstart.drag.cover mousedown.drag.cover', function (e) {

            //只有一个声音不做任何处理
            if (self.$coverItemNum == 1) {
                return false;
            }

            //判断当前active是否在duplicate上,如果在则重置位置
            self.judgePosition();

            //e 对象
            var ev = e.type == 'touchstart' ? e.originalEvent.touches[0] : e;

            //按下位置
            var coverStartX = ev.pageX;

            //附近位置
            var $nowCoverImg = self.$coverList.find('.cover-active');
            var $nextCoverImg = $nowCoverImg.next();
            var $prevCoverImg = $nowCoverImg.prev();

            //获得当前图片在list第几个位置
            var index = $nowCoverImg.index() + 1;

            //宽度
            var nowCoverWidth = $nowCoverImg.width();
            var nextCoverWidth = $nextCoverImg.width();
            var prevCoverWidth = $prevCoverImg.width();

            //滑动距离
            var distance = '';

            //active属性
            var coverActive = self.$coverList.find('.cover-active').get(0).getBoundingClientRect();

            //能否拖拽
            var canDrag = false;

            //记录当前时间
            var sTime = Date.now();

            $(document).on('touchmove.drag.cover mousemove.drag.cover', function (e) {
                //移动时候重置
                canDrag = true;

                //e 对象
                var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e;

                //滑动距离
                distance = ev.pageX - coverStartX;

                //最左边禁止左滑
                if (index == 1 && distance >= 0) {
                    canDrag = false;
                    return false;
                }
                //最右边禁止右滑
                if (index == self.$coverItemNum && distance <= 0) {
                    canDrag = false;
                    return false;
                }

                var zoomDistance = Math.abs(distance / self.imgZoomRadio);

                var nowWidth = nowCoverWidth - zoomDistance;

                if (distance < 0) {
                    var nextWidth = nextCoverWidth + zoomDistance;

                    nextWidth = nextWidth > nowCoverWidth ? nowCoverWidth : nextWidth;
                    nowWidth = nowWidth > nextCoverWidth ? nowWidth : nextCoverWidth;

                    move($nowCoverImg.get(0)).duration(0).scale(nowWidth / nowCoverWidth).end();
                    move($nextCoverImg.get(0)).duration(0).scale(nextWidth / nextCoverWidth).end();
                } else {
                    var prevWidth = prevCoverWidth + zoomDistance;

                    prevWidth = prevWidth > nowCoverWidth ? nowCoverWidth : prevWidth;
                    nowWidth = nowWidth > prevCoverWidth ? nowWidth : prevCoverWidth;

                    move($nowCoverImg.get(0)).duration(0).scale(nowWidth / nowCoverWidth).end();
                    move($prevCoverImg.get(0)).duration(0).scale(prevWidth / prevCoverWidth).end();
                }

                //滑动
                move('#coverList')
                    .duration(0)
                    .translate(self.cover.translateX + distance, 0)
                    .end();

            });
            $(document).on('touchend.drag.cover mouseup.drag.cover', function (e) {

                if (!canDrag) {
                    $(document).off('.drag.cover');
                    return false;
                }

                var moveD = Math.abs(distance) - coverActive.left;

                var translateX = '';

                //记录translateX
                if (moveD > coverActive.width / 3) {
                    self.leftRightSlide($nowCoverImg, $prevCoverImg, $nextCoverImg, distance);
                } else {
                    //记录滑动时间
                    var slideTime = Date.now() - sTime;

                    if (slideTime < 200) {
                        //滑动时间小于200毫秒,则认为为快速滑动
                        self.leftRightSlide($nowCoverImg, $prevCoverImg, $nextCoverImg, distance);
                    } else {
                        //还原
                        move($nowCoverImg.get(0)).scale(1).end();

                        if (distance < 0) {
                            move($nextCoverImg.get(0)).scale(1).end();
                        } else {
                            move($prevCoverImg.get(0)).scale(1).end();
                        }
                        //设置active位置,
                        self.setActiveCoverPosition();
                    }
                }
                $(document).off('.drag.cover');
            });
            e.preventDefault();
        });
    },
    leftRightSlide: function ($nowCoverImg, $prevCoverImg, $nextCoverImg, distance) {
        var self = this;
        move($nowCoverImg.get(0)).duration(0).scale(1).end();
        if (distance > 0) {
            //右滑动
            move($prevCoverImg.get(0)).duration(0).scale(1).end();

            $nowCoverImg.removeClass('cover-active');
            $prevCoverImg.addClass('cover-active');

            //设置active位置,
            self.setActiveCoverPosition();
        } else if (distance < 0) {
            //左滑动
            move($nextCoverImg.get(0)).duration(0).scale(1).end();

            $nowCoverImg.removeClass('cover-active');
            $nextCoverImg.addClass('cover-active');

            //设置active位置,
            self.setActiveCoverPosition();
        }
    },
    //调屏canvas
    fmCanvas: function () {
        var self = this;

        var fmCanvas = document.createElement('canvas');
        document.getElementById('fm').appendChild(fmCanvas);

        $pageWidth = this.$page.width();
        fmCanvas.width = $pageWidth;
        fmCanvas.height = $pageWidth * 0.16;

        self.canvasRadio = $pageWidth/750;

        if (fmCanvas.getContext) {
            self.ctx = fmCanvas.getContext('2d');
            self.canvasInit();
        } else {
            alert('暂不支持canvas,请切换浏览器尝试！');
        }
    },
    canvasInit: function () {
        var self = this;
        var ctx = self.ctx;

        var point = [
            {w: 2, h: 4, left: 16, top: 108}
        ];
        for(var i= 2; i < 40;i++){
            var prevPoint = point[i - 2];
            if(i%9  == 2){
                point.push({
                    w:4,
                    h:36,
                    left:prevPoint.left + prevPoint.w + 16,
                    top:84
                });
            }else if(i%9  == 5 || i%9  == 8){
                point.push({
                    w:2,
                    h:20,
                    left:prevPoint.left + prevPoint.w + 16,
                    top:100
                });
            }else{
                point.push({
                    w:2,
                    h:4,
                    left:prevPoint.left + prevPoint.w + 16,
                    top:108
                });
            }
        }

        $.each(point,function (i,v) {
            self.drawRect(v);
        });

    },
    drawRect: function (options) {
        var self = this;
        var ctx = self.ctx;

        ctx.save();
        ctx.scale(self.canvasRadio, self.canvasRadio);
        ctx.fillStyle = '#fff';
        ctx.fillRect(options.left, options.top, options.w, options.h);
        ctx.restore();
    }
};

$(function () {
    new everyVoice();
});