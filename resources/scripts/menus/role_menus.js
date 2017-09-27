var RoleMenus  = function () {
    var basicUrl = commonUtil.httpUrl;
    var roleId = commonUtil.getUrlParams("roleId");
    var menusIdsArray = new Array();

    var token = commonUtil.getToken();
    token = token != null ? token : "";
    var sessionId = commonUtil.getSessionId();

    /**
     * 已分配资源树 数据源
     * @param roleId
     */
    var getTreeYesData = function () {

        console.log("sessionId: " + sessionId);
        console.log("token: " + token);

        $('#role-menus-tree').data('jstree',false);
        $.ajax({
            url: basicUrl+ "/resourceMenus/y",
            data:{
                "roleId":roleId
            },
            type:"GET",
            dataType:"json",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success :function (data,textStatus) {
                console.log(data);
                if(data.status == 0){
                    initRoleMenusTree(data.data);
                }else{
                    layer.alert(data.msg, {
                        skin: 'layui-layer-lan',
                        closeBtn: 1,
                        anim: 4 //动画类型
                    });
                }

            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });
    }


    /**
     * 未分配资源树 数据源
     * @param roleId
     */
    var getTreeNoData = function () {
        $('#tree_menus').data('jstree',false);
        $.ajax({
            url: basicUrl+ "/resourceMenus/n",
            data:{
                "roleId":roleId
            },
            type:"GET",
            dataType:"json",
            success :function (data,textStatus) {
                console.log(data);
                if(data.status == 0){
                    initMenusTree(data.data);
                }else{
                    layer.alert(data.msg, {
                        skin: 'layui-layer-lan',
                        closeBtn: 1,
                        anim: 4 //动画类型
                    });
                }


            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {
                layer.alert('网络出现错误!', {
                    skin: 'layui-layer-lan',
                    closeBtn: 1,
                    anim: 4 //动画类型
                });
            }
        });
    }



    //初始化未分配菜单树
    var initMenusTree = function (data) {
        $('#tree_menus').jstree({
            'plugins': ["wholerow", "checkbox", "types"],
            'core': {
                "themes" : {
                    "responsive": false
                },
                'data': data
            },
            "types" : {
                "default" : {
                    "icon" : "fa fa-folder icon-state-warning icon-lg"
                },
                "file" : {
                    "icon" : "fa fa-file icon-state-warning icon-lg"
                }
            }
        });
    };

    //初始化已分配菜单树
    var initRoleMenusTree = function (data) {
        $('#role-menus-tree').jstree({
            'plugins': ["wholerow", "checkbox", "types"],
            'core': {
                "themes" : {
                    "responsive": false
                },
                'data':data
            },
            "types" : {
                "default" : {
                    "icon" : "fa fa-folder icon-state-warning icon-lg"
                },
                "file" : {
                    "icon" : "fa fa-file icon-state-warning icon-lg"
                }
            }
        });
    };


    /**
     * 获取选中行数据
     */
    function selecteions(treeId){

    /*    $('#'+treeId).on('select_node.jstree', function(e,data) {
            var i, j = [];
            for(i = 0, j = data.selected.length; i < j; i++) {
                console.log("节点ID：" + data.instance.get_node(data.selected[i]).id);
                console.log("parentId : " + data.instance.get_node(data.selected[i]).a_attr.parentId);
                var id = data.instance.get_node(data.selected[i]).id;
                var parentId = data.instance.get_node(data.selected[i]).a_attr.parentId;
                if(id != 1 ){
                    menusIdsArray.push(id);
                }
                if( parentId != 1 && typeof(parentId) == undefined ){
                    menusIdsArray.push(parentId);
                }
            }
        });
*/

        menusIdsArray = new  Array();

       // var nodes = $("#"+treeId).jstree("get_checked"); //使用get_checked方法 获取选中节点ID值
        var nodes = $("#"+treeId).jstree("get_checked"); //使用get_checked方法 获取选中节点元素
        $.each(nodes, function(i, v) {
            var node = $('#'+treeId).jstree("get_node", v);
            console.log(node);
            var parentId = node.a_attr.parentId;

            console.log("节点ID：" + v);
            console.log("parentId : " + parentId);

            if(v != 1){
                menusIdsArray.push(v);
            }
            if(typeof(parentId) != "undefined" ){
                menusIdsArray.push(parentId);
                var parentNode = $('#'+treeId).jstree("get_node", parentId);
                var parentNodeId = parentNode.a_attr.parentId;
                console.log("parentNodeId : " + parentNodeId);
            }
            if(typeof(parentNodeId) != "undefined" ){
                menusIdsArray.push(parentNodeId);
            }

        });

        menusIdsArray.sort();
        $.unique(menusIdsArray);
    }

    /**
     * 移除分配的资源菜单
     */
    $('#delMenusBtn').on('click', function(){
        menusHandle("role-menus-tree","DELETE");
    });

    /**
     * 给角色分配资源菜单
     */
    $('#addMenusBtn').on('click', function(){
        menusHandle("tree_menus","POST");
    });

    /**
     * 资源菜单分配处理
     * @param treeId
     * @param methodType
     */
    function menusHandle(treeId,methodType){
        selecteions(treeId);
        console.log(menusIdsArray.join(","));
        if(menusIdsArray.length > 0){
            $.ajax({
                url: basicUrl+ "/roleMenus?roleId="+roleId+"&menusId="+menusIdsArray.join(","),
                type:methodType,
                dataType:"json",
                success :function (data,textStatus) {
                    console.log(data);
                    if(data.status == 0){
                        onRefreshData();
                    }

                },
                error:function (XMLHttpRequest, textStatus, errorThrown) {
                    layer.alert('网络出现错误!', {
                        skin: 'layui-layer-lan',
                        closeBtn: 1,
                        anim: 4 //动画类型
                    });
                }
            });

        }
    }

    /**
     * 刷新表格数据
     */
    function onRefreshData(){
        getTreeYesData();
        getTreeNoData();
    }


    return {
        //main function to initiate the module
        init: function () {
            getTreeYesData();
            getTreeNoData();
        }
    };
}();

jQuery(document).ready(function() {
    RoleMenus.init();
});