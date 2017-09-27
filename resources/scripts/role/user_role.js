var RoleUser  = function () {
    var basicUrl = commonUtil.httpUrl;
    var userId = commonUtil.getUrlParams("userId");
    var token = commonUtil.getToken();
    token = token != null ? token : "";
    var sessionId = commonUtil.getSessionId();
    var roleTableData = function () {
        console.log("userId: "+userId);
        console.log("sessionId: " + sessionId);
        console.log("token: " + token);

        $.ajax({
            url: basicUrl+ "/userRolers/n",
            type:"GET",
            data:{
                "userId":userId
            },
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
                    initRoleTable(data.data.rows);
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

    //初始化未分配角色表格
    var initRoleTable = function(data){
        //先销毁表格
        $('#role-table-pagination').bootstrapTable('destroy');
        //初始化表格,动态从服务器加载数据
        $("#role-table-pagination").bootstrapTable({
          //  method: "get",  //使用get请求到服务器获取数据
          //  url:basicUrl+"/roles" , //获取数据的Servlet地址
            data:data,
            striped: true,  //表格显示条纹
            pagination: true, //启动分页
            pageSize: 20,  //每页显示的记录数
            pageNumber:1, //当前第几页
            pageList: [5, 10, 15, 20, 25],  //记录数可选列表
            search: false,  //是否启用查询
            showColumns: false,  //显示下拉框勾选要显示的列
            showRefresh: false,  //显示刷新按钮
            sidePagination: "server", //表示服务端请求
            //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder
            //设置为limit可以获取limit, offset, search, sort, order
            queryParamsType : "undefined",
            queryParams: function queryParams(params) {   //设置查询参数
                var param = {
                    pageNumber: params.pageNumber,
                    pageSize: params.pageSize,
                    orderNum : $("#orderNum").val()
                };
                return param;
            },
            onLoadSuccess: function(){  //加载成功时执行
                alert("加载成功");
            },
            onLoadError: function(){  //加载失败时执行
                alert("加载数据失败");
            }
        });
    }


    var userRoleTableData = function () {
        $.ajax({
            url: basicUrl+ "/userRolers/y",
            data:{
                    "userId":userId
                  },
            type:"GET",
            dataType:"json",
            success :function (data,textStatus) {
                console.log(data);
                if(data.status == 0){
                    initUserRoleTable(data.data.rows);
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

    //初始化已分配角色表格
    var initUserRoleTable = function(data){
        //先销毁表格
        $('#user-role-table-pagination').bootstrapTable('destroy');
        //初始化表格,动态从服务器加载数据
        $("#user-role-table-pagination").bootstrapTable({
           // method: "get",  //使用get请求到服务器获取数据
          //  url:basicUrl+"/roles" , //获取数据的Servlet地址
            data:data,
            striped: true,  //表格显示条纹
            pagination: true, //启动分页
            pageSize: 20,  //每页显示的记录数
            pageNumber:1, //当前第几页
            pageList: [5, 10, 15, 20, 25],  //记录数可选列表
            search: false,  //是否启用查询
            showColumns: false,  //显示下拉框勾选要显示的列
            showRefresh: false,  //显示刷新按钮
            sidePagination: "server", //表示服务端请求
            //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder
            //设置为limit可以获取limit, offset, search, sort, order
            queryParamsType : "undefined",
            queryParams: function queryParams(params) {   //设置查询参数
                var param = {
                    pageNumber: params.pageNumber,
                    pageSize: params.pageSize,
                    orderNum : $("#orderNum").val()
                };
                return param;
            },
            onLoadSuccess: function(){  //加载成功时执行
                alert("加载成功");
            },
            onLoadError: function(){  //加载失败时执行
                alert("加载数据失败");
            }
        });
    }

    /**
     * 获取选中行数据
     */
    function selecteions(tableId){
        var roleIdsArray = new Array();
        var row= $('#'+tableId).bootstrapTable('getSelections');
        console.log(row);
        $(row).each(function(i,v){
            roleIdsArray.push(v.id);
        });
        return roleIdsArray;
    }

    /**
     * 移除分配的角色
     */
    $('#delRoleBtn').on('click', function(){
        roleHandle("user-role-table-pagination","DELETE");
    });

    /**
     * 给用户分配角色
     */
    $('#addRoleBtn').on('click', function(){
        roleHandle("role-table-pagination","POST");
    });

    /**
     * 角色分配处理
     * @param tableId
     * @param methodType
     */
    function roleHandle(tableId,methodType){
        var roleIdsArray = selecteions(tableId);
        if(roleIdsArray.length > 0){
            $.ajax({
                url: basicUrl+ "/userRolers?userId="+userId+"&roleIds="+roleIdsArray.join(","),
              /*  data:{
                    "userId":userId,
                    "roleIds":roleIdsArray.join(",")
                },*/
                type:methodType,
             //   contentType: 'application/json',
                dataType:"json",
                success :function (data,textStatus) {
                    console.log(data);

                    if(data.status == 0){
                        onRefreshTalbe();
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
    }

    /**
     * 刷新表格数据
     */
    function onRefreshTalbe(){
        roleTableData();
        userRoleTableData();
      /*  $('#user-role-table-pagination').bootstrapTable('load', {
            "userId":userId
        });
        $('#role-table-pagination').bootstrapTable('load', {
            "userId":userId
        });*/
    }

    return {
        //main function to initiate the module
        init: function () {

            roleTableData();
            userRoleTableData();

        }
    };
}();

jQuery(document).ready(function() {
    RoleUser.init();
});