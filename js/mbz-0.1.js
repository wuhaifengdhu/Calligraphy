/**
 * Created by twsj on 2016/1/28.
 */
+function($){
    'use strict';
    var MBZ = function (canvasName) {
        this.canvasWidth = Math.min(480, window.innerWidth - 20);
        this.canvasHeight = this.canvasWidth;

        this.isMouseDown = false;
        this.isEraser = false;
        this.lastPoint = {x: 0, y: 0};

        this.penWidth = 15;
        this.canvasName = canvasName;
    };



    //初始化
    MBZ.prototype.init = function () {
        var that = this;
        this.canvas = $("#" + this.canvasName).get(0);
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;

        this.cxt = this.canvas.getContext('2d');
        this.drawGrid();

        this.canvas.onmousedown = function(e){
            e.preventDefault();
            this.isMouseDown = true;
            var point = that.getCanvasPoint(e.clientX, e.clientY);
            that.lastPoint.x = point.x;
            that.lastPoint.y = point.y;

        }
        this.canvas.onmousemove = function(e){
            e.preventDefault();
            if(this.isMouseDown){
                that.draw(e.clientX, e.clientY);
            }
        }
        this.canvas.onmouseup = function(e){
            e.preventDefault();
            this.isMouseDown = false;
            this.penWidth = 15;
        }
        this.canvas.onmouseout = function(e){
            e.preventDefault();
            this.isMouseDown = false;
        }

        //手机事件
        document.addEventListener('touchstart', function(e){
            e.preventDefault();
            this.isMouseDown = true;
            var point = that.getCanvasPoint(e.clientX, e.clientY);
            that.lastPoint.x = point.x;
            that.lastPoint.y = point.y;
        });
        document.addEventListener('touchmove', function(e){
            e.preventDefault();
            if(this.isMouseDown){
                that.draw(e.touches[0].clientX, e.touches[0].clientY);
            }
        });
        document.addEventListener('touchend', function(e){
            e.preventDefault();
            this.isMouseDown = false;
        });

        //功能模块
        //橡皮擦
        var click = 'ontouchstart' in window ? 'touchstart' : 'click';

        // $('#eraser')[0].addEventListener(click, function(){
        //     that.isEraser = that.isEraser ? false : true;
        // });

        //清除画布
        $('#clear')[0].addEventListener(click, function () {
            that.clear();
        });

        // $('#mb')[0].addEventListener(click, function () {
        //     that.penWidth = 15;
        // });
        
    }

    //画米字格
    MBZ.prototype.drawGrid = function () {
        this.cxt.strokeStyle = 'red';
        this.cxt.lineWidth = 6;
        //外边框
        this.cxt.beginPath();
        this.cxt.moveTo(3, 3);
        this.cxt.lineTo(this.canvasWidth - 3, 3);
        this.cxt.lineTo(this.canvasWidth - 3, this.canvasHeight - 3);
        this.cxt.lineTo(3, this.canvasHeight - 3);
        this.cxt.closePath();
        this.cxt.stroke();

        //对角线
        this.cxt.lineWidth = 1;
        this.cxt.beginPath();
        this.cxt.moveTo(3, 3);
        this.cxt.lineTo(this.canvasWidth - 3, this.canvasHeight - 3);
        this.cxt.lineTo(3, this.canvasHeight - 3);
        this.cxt.lineTo(this.canvasWidth - 3, 3);
        this.cxt.stroke();

        //十字线
        this.cxt.beginPath();
        this.cxt.lineTo(3, this.canvasHeight / 2);
        this.cxt.lineTo(this.canvasWidth - 3, this.canvasHeight / 2);
        this.cxt.stroke();

        this.cxt.beginPath();
        this.cxt.lineTo(this.canvasWidth / 2, 3);
        this.cxt.lineTo(this.canvasWidth / 2, this.canvasHeight - 3);
        this.cxt.stroke();
    }

    //写字
    MBZ.prototype.draw = function (x, y) {
        this.cxt.strokeStyle = '#000';
        if(this.isEraser){
            this.cxt.strokeStyle = '#fff';
        }
        this.cxt.lineWidth = this.penWidth;
        this.cxt.lineJoin = 'round';
        this.cxt.lineCap = 'round';
        this.cxt.beginPath();
        this.cxt.moveTo(this.lastPoint.x, this.lastPoint.y);
        var point = this.getCanvasPoint(x, y);
        this.cxt.lineTo(point.x, point.y);
        this.cxt.stroke();

        this.drawGrid();
        if(this.lastPoint.x == point.x && this.lastPoint.y == point.y){
            if(this.penWidth < 25){
                this.penWidth += 0.7;
            }
        } else if(this.penWidth > 15){
            this.penWidth -= 0.2;
        }
        this.lastPoint.x = point.x;
        this.lastPoint.y = point.y;
    }

    //清除
    MBZ.prototype.clear = function () {
        this.cxt.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawGrid();
    }

    //根据鼠标位置获取canvas中的坐标点
    MBZ.prototype.getCanvasPoint = function (x, y) {
        var rect = this.canvas.getBoundingClientRect();
        return {x: x - rect.left, y: y - rect.top}
    }

    var mbz1 = new MBZ('mbz1');
    // var mbz2 = new MBZ('mbz2');
    mbz1.init();
    // mbz2.init();
}(jQuery);