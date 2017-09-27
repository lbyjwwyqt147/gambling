/**
 * 系统公共js对象
 * @type
 */
var commonUtil = {
    /**
     * 获取当前登录人的用户编号
     */
    memberId : "",
    token:"",
    sessionId:"",
    httpUrl:"http://10.1.121.89:80/security/api/v1",
    //ihttpUrl:"http://127.0.0.1:18080/security/api/v1",
    webUrl:"http://localhost:63342/",
    //webUrl:"http://localhost:80/",

    setSeesionId : function (sessionId) {
        this.sessionId = sessionId;
    },
    getSessionId:function () {
        this.sessionId =  $.cookie('SESSION');
        return this.sessionId;
    },

    setToken : function (token) {
        this.token = token;
    },
    getToken:function () {
        this.token = $.cookie('token');
        return this.token;
    },


    /**
     * 当前用户信息
     *
     */
    memberInfo : function(id){
        var memberArray = "";
        if(id != ""){
            $.ajax({
                url : '',
                type : "post",
                dataType : "json",
                async : true,
                success : function(data){
                    memberArray = [data.id,data.userCode,data.userNickname,data.userPortrait];
                    commonUtil.memberId = data.userCode;
                    $("#user-headPhoto").attr("src",data.userPortrait);
                    $("#userNikeName").text(data.userNickname);
                }
            });
        }else{
            memberArray = "";
        }
        return memberArray;
    },

    /**
     * 推出系统
     *
     */
    logiOut : function(memberId){

    },

    getIp:function(){
        //获取主机域名：
        var i =   window.location.hostname;
        //获取端口号
        var p = window.location.port;
        return i;
    },
    getUrlParams:function(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  decodeURIComponent(r[2]); return null;
    },

    /**
     * 清空文本框前后空格
     */
    inputTrim : function(){
        $("input").each(function(){
            $(this).val($.trim($(this).val()))
        });
        $("textarea").each(function(){
            $(this).val($.trim($(this).val()))
        });
    },

    /**
     * 日期时间处理工具
     */
    dateUtil : {
        /**
         * 获取当天日期 格式：2016-09-22
         */
        getTodayDate : function(){
            return dateUtil.DateFormat("yyyy-MM-dd");
        },

        /**
         * 获取当天事件  格式：2016-09-22 11:50:30
         */
        getTodayDateTime : function(){
            return dateUtil.DateFormat("yyyy-MM-dd HH:mm:ss");
        },

        /**
         * 获取当前年份
         */
        getCurrentYear : function(){
            var myDate = new Date();
            return myDate.getFullYear();
        },

        /**
         * 获取当前月份
         */
        getCurrentMonth : function(){
            var myDate = new Date();
            var month = myDate.getMonth()+1;
            var mothString = month > 9 ? month : "0"+month;
            return mothString;
        },

        /**
         * 获取当天几号
         */
        getCurrentDay : function(){
            var myDate = new Date();
            var day = myDate.getDate();
            var dayString = day > 9 ? day : "0"+day;
            return dayString;
        },

        /**
         * 对Date的扩展，将 Date 转化为指定格式的String
         * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
         *  年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
         *  例子：
         *  (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
         */
        DateFormat : function (fmt) {
            var myDate = new Date();
            var o = {
                "M+": myDate.getMonth() + 1, //月份
                "d+": myDate.getDate(), //日
                "h+": myDate.getHours(), //小时
                "m+": myDate.getMinutes(), //分
                "s+": myDate.getSeconds(), //秒
                "q+": Math.floor((myDate.getMonth() + 3) / 3), //季度
                "S": myDate.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (myDate.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },
        DatePattern : function (date,fmt) {
            var myDate = new Date(date);
            var o = {
                "M+" : myDate.getMonth()+1, //月份
                "d+" : myDate.getDate(), //日
                "h+" : myDate.getHours()%12 == 0 ? 12 : myDate.getHours()%12, //小时
                "H+" : myDate.getHours(), //小时
                "m+" : myDate.getMinutes(), //分
                "s+" : myDate.getSeconds(), //秒
                "q+" : Math.floor((myDate.getMonth()+3)/3), //季度
                "S" : myDate.getMilliseconds() //毫秒
            };
            var week = {
                "0" : "/u65e5",
                "1" : "/u4e00",
                "2" : "/u4e8c",
                "3" : "/u4e09",
                "4" : "/u56db",
                "5" : "/u4e94",
                "6" : "/u516d"
            };
            if(/(y+)/.test(fmt)){
                fmt=fmt.replace(RegExp.$1, (myDate.getFullYear()+"").substr(4 - RegExp.$1.length));
            }
            if(/(E+)/.test(fmt)){
                fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[myDate.getDay()+""]);
            }
            for(var k in o){
                if(new RegExp("("+ k +")").test(fmt)){
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                }
            }
            return fmt;
        }


    },


    /**
     * 消息工具
     * @type
     */
    pageMsgUitl : {
        /**
         * 设置页面底部版本信息
         * @param {} copyright  class名称
         */
        setPageBottomMsg : function(copyright){
            //计算年份
            var currentYear = commonUtil.dateUtil.getCurrentYear();
            if(currentYear == 2017){
                $("."+copyright).html(" © 2017 qiufeng.com , All Rights Reserved. ");
            }else{
                $("."+copyright).html(" © 2017 - "+currentYear +" qiufeng.com , All Rights Reserved. ");

            }
        }
    }


};

$(function(){
   commonUtil.pageMsgUitl.setPageBottomMsg("copyright");
});