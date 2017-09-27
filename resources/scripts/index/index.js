var Index = function () {
    var basicUrl = commonUtil.httpUrl;
    var userId = "";
    var token = $.cookie('token');
    token = token != null ? token : "";
    var sessionId = $.cookie('SESSION');
    var roleId = 1;
    /**
     * 菜单数据源
     */
    var menusData = function() {
        console.log("sessionId: " + sessionId);
        console.log("token: " + token);

        $.ajax( {
            url: basicUrl+ "/resourceMenus/user/"+userId+"/token/"+token,

            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            type:'GET',
            dataType:'JSON',
            success:function(data) {
                console.log(data);
                if(data.status == 0){
                    initMenus(data.data);
                }else{
                    layer.alert(data.msg, {
                        skin: 'layui-layer-lan',
                        closeBtn: 1,
                        anim: 4 //动画类型
                    });
                }


            },
            error : function() {
               layer.open({
                   title: '提示',
                   content: '获取资源菜单树异常.'
               });
            }
         });

        //退出
        jQuery('#logout-btn').click(function () {
            logout();
        });

        //退出
        jQuery('#logout1-btn').click(function () {
            logout();
        });

    }

    /**
     * 初始化首页事件
     */
    var  initHome = function () {
        //退出
        $('.nav-link').click(function () {
            menuClickStyle(this);
        });
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
     * 初始化菜单
     * @param data
     */
    function initMenus(data) {
        var menusHtml = "";
        $.each(data,function(i,v){
            console.log(v);
            if(i == 0){
                menusHtml+='<li class="nav-item start active open">';
            }else {
                menusHtml+='<li class="nav-item ">';
            }
            menusHtml+='<a href="javascript:Index.openPageHtml(\''+v.a_attr.url+'\');" onclick="Index.openPageHtml(\''+v.a_attr.url+'\');" class="nav-link nav-toggle">';
            menusHtml+='<i class="'+v.icon+'"></i>';
            menusHtml+='<span class="title">'+v.text+'</span>';
            if(i == 0){
                menusHtml+='<span class="selected"></span>';
            }else {

            }
            menusHtml+='<span class="arrow open"></span>';
            menusHtml+='</a>';
            menusHtml+=findChildren(v);
        });

       // console.log(menusHtml)
       $("#page-sidebar-menu").html(menusHtml);
    }

    /**
     * 叶子节点
     * @param html
     * @param arrays
     */
    function findChildren(v2) {
        var html = '<ul class="sub-menu">';
        var  children = v2.children;
        console.log(children);
        $.each(children,function (i,v) {
                html+='<li class="nav-item ">';
                html+='<a href="javascript:Index.openPageHtml(\''+v.a_attr.url+'\');" class="nav-link">';
                html+='<i class="'+v.icon+'"></i>';
                html+='<span class="title">'+v.text+'</span>';
                html+='</a>';
                html+='</li>';
                findChildren(html,v);
        })
        html+='</ul>';
        html+='</li>';
       return html;
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

          //  menusData();

            initHome();

        },
        /**
         * 打开页面
         * @param url
         */
        openPageHtml: function(url) {
            if(url != "" || url != null){
                $("#mainIframe").attr("src",url);
            }

        }
    };

}();

jQuery(document).ready(function() {
     Index.init();
});