var Index = function () {
    var basicUrl = commonUtil.httpUrl;
    /**
     * 初始化首页事件
     */
    var  initHome = function () {

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
            console.log(sign);
            var menuName = $(this).children(".title").html();
            console.log(menuName);
            switch(sign){
                case "1":
                    break;
                case "2":
                    $("#homeModuleTile").html(menuName);
                    Index.openPageHtml("../pages/member/member_list.html");
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
        console.log("iframe高:" +$("#mainIframe").height());
    }


    /**
     * 退出系统
     */
    function logout() {
        console.log("sessionId: " + sessionId);
        console.log("token: " + token);
        $.ajax( {
            url: basicUrl+ "/logout",
            data:{

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
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function(data) {
                console.log(data);
                console.log(commonUtil.getIp());
                window.location.href = "http://"+commonUtil.getIp();


            },
            error : function() {
                layer.open({
                    title: '提示',
                    content: '网络错误.'
                });
            }
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
                $("#mainIframe").attr("src",url);
            }
        }
    };

}();

jQuery(document).ready(function() {
     Index.init();
});