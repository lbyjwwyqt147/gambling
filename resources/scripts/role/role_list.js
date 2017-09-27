var Role  = function () {
    var basicUrl = commonUtil.httpUrl;
    var roleId = "";
    var token = commonUtil.getToken();
    token = token != null ? token : "";
    var sessionId = commonUtil.getSessionId();

    var roleTableData = function () {

        console.log("sessionId: " + sessionId);
        console.log("token: " + token);

        console.log("cookie sessionId : "+ $.cookie('SESSION'));
        console.log("cookie token: "+ $.cookie('token'));

        $.ajax({
            url: basicUrl+ "/roles",
            type:"GET",
            dataType:"json",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
          /*  headers: {
                "Cookie": "SESSION=222222222222222222",
                "x-auth-token":"233333"
            },*/
           /* headers: {
                "x-auth-userId" : "",
                "x-auth-token":"122211",
                "x-auth-session":""
            },*/
           /* beforeSend: function(reqObj, settings) {
                reqObj.setRequestHeader('x-auth-token', 'VVV');
            },*/
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
            error:function (jqXHR , textStatus, errorThrown) {
                layer.alert('网络错误!', {
                    skin: 'layui-layer-lan',
                    closeBtn: 1,
                    anim: 4 //动画类型
                });
            }
        });
    }

    var initRoleTable = function(data){
        //先销毁表格
        $('#role-table-pagination').bootstrapTable('destroy');
        //初始化表格,动态从服务器加载数据
        $("#role-table-pagination").bootstrapTable({
            data:data,
          //  method: "get",  //使用get请求到服务器获取数据
            dataType:"json",
          //  url:basicUrl+"/roles" , //获取数据的Servlet地址
            striped: true,  //表格显示条纹
            pagination: true, //启动分页
            pageSize: 20,  //每页显示的记录数
            pageNumber:1, //当前第几页
            pageList: [5, 10, 15, 20, 25],  //记录数可选列表
            search: false,  //是否启用查询
            showColumns: true,  //显示下拉框勾选要显示的列
            showRefresh: true,  //显示刷新按钮
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
    function selecteions(){
        var row= $('#role-table-pagination').bootstrapTable('getSelections');
        console.log(row);
        if(row.length == 0){
            layer.alert('请选择角色', {
                skin: 'layui-layer-lan',
                closeBtn: 1,
                anim: 4 //动画类型
            });
        }else{
            roleId = row[0].id;
        }

    }

    /**
     * 新增角色
     */
    $('#openAddRoleForm').on('click', function(){
            layer.open({
                type: 2,
                title: '添加角色',
                maxmin: true,
                shadeClose: true, //点击遮罩关闭层
                area : ['65%' , '65%'],
                content: '../../../pages/authority/role/role_add.html'
            });

    });

    /**
     * 权限分配
     */
    $('#role-menus').on('click', function(){
        selecteions();
        if(roleId != '') {
            layer.open({
                type: 2,
                title: '角色资源分配',
                maxmin: true,
                shadeClose: true, //点击遮罩关闭层
                area: ['80%', '90%'],
                content: '../../../pages/authority/menus/role_menus.html?roleId=' + roleId
            });
        }
    });


    return {
        //main function to initiate the module
        init: function () {

            roleTableData();
            //initRoleTable();
        }
    };
}();

jQuery(document).ready(function() {
    Role.init();
});