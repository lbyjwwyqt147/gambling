var Index = function () {
    var basicUrl = commonUtil.httpUrl;
    var memberId = commonUtil.getUrlParams("p");

    /**
     * 退出事件
     */
    $("#logout1-btn").click(function () {
        logout();
    });

    /**
     * 初始化首页事件
     */
    var  initHome = function () {
         if(memberId == null){
             layer.alert('你未登录,请登录系统.', {
                 skin: 'layui-layer-lan',
                 closeBtn: 1,
                 shade: 0.01,
                 icon: 7,
                 anim: 4,
                 time:5000,
                 end:function(){
                     window.location.href = "../../index.html";
                 }
             });
             return ;
         }
        $(".homeTile").hide();
        // 菜单项点击事件
        $('.nav-link').click(function () {
            menuClickStyle(this);
            //标记
            var sign = $(this).attr("sign");
            if(sign == "1"){
                $(".homeTile").hide();
            }else {
                $(".homeTile").show();
            }
            var menuName = $(this).children(".title").html();
            switch(sign){
                case "1":
                    Index.openPageHtml("../pages/shimobun/shimobun_list.html");
                    break;
                case "2":
                    $("#homeModuleTile").html(menuName);
                    Index.openPageHtml("../pages/member/member_list.html");
                    break;
                case "3":
                    openRanking();
                    //$("#homeModuleTile").html(menuName);
                   // Index.openPageHtml("../pages/ranking/ranking_list.html");
                    break;
                case "4":
                    $("#homeModuleTile").html(menuName);
                    Index.openPageHtml("../pages/logs/logs_list.html");
                    break;
                case "5":
                    $("#homeModuleTile").html(menuName);
                    Index.openPageHtml("../pages/systemsettings/system_settings_form.html");
                    break;
            }
        });

        /**
         * iframe 自适应高度
         */
        $("#mainIframe").load(function () {
            changeFrameHeight();
        });

        /**
         * 窗口变化事件
         */
        window.onresize=function(){
            changeFrameHeight();
        }

        //默认第一个菜单点击
        $('#defaultHome').trigger("click");

    }


    /**
     * 点击菜单样式切换
     */
    function menuClickStyle(obj) {
        //移除以前选中菜单的  active 样式
        $(".nav-item").removeClass("active");
        $(".nav-link > .arrow").removeClass("open");
        $(".nav-link > .selected").remove();
        //给父级元素添加 active 样式
        $(obj).parent().addClass("active");
        //给下级元素 添加 <span class="selected"></span>   <span class="arrow open"></span>
        $(obj).append('<span class="selected"></span> ');
        $(obj).children(".arrow").addClass("open");
    }


    /**
     * iframe 高度
     */
    function changeFrameHeight(){
        var homeTitleHeight = $(".page-bar").height();
        var pageContentHeight = $(".page-content").height();
        var iframeHeight = pageContentHeight-homeTitleHeight-10;
        $("#mainIframe").attr("height", iframeHeight);
    }


    /**
     * 退出系统
     */
    function logout() {
        $.ajax( {
             url: basicUrl+ "/systemController/loginOut",
             data:{
                 identity:memberId
             },
             xhrFields: {
                 withCredentials: true
             },
             crossDomain: true,
             type:'GET',
             dataType:'JSON',
             xhrFields: {
                 withCredentials: true
             },
             crossDomain: true,
             success:function(data) {
                 commonUtil.memberId = "";
                 window.location.href = "../../index.html";
             },
             error : function() {
                 layer.msg("网络错误!", {icon: 5});
             }
         });
    }

    /**
     * 排行榜
     */
    function openRanking() {
        var that = this;
        //多窗口模式，层叠置顶
       parent.layer.open({
            type: 2 ,
            title: false,
            area: ['300px' , '90%'],
            shade: 0.01,
            shadeClose: true,
            maxmin: false, //开启最大化最小化按钮
            offset: '30px',  //间距上边30px
            content: '../pages/ranking/ranking_list.html?p='+memberId
        });
    }






    return {
        //main function to initiate the module
        init: function () {
            initHome();

        },
        /**
         * 打开页面
         * @param url
         */
        openPageHtml: function(url) {
            if(url != "" || url != null){
                //计算window 高度
                changeFrameHeight();
                $("#mainIframe").attr("src",url+"?p="+memberId);
            }
        }
    };

}();

jQuery(document).ready(function() {
     Index.init();
});