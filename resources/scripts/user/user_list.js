var UserList  = function () {
    var basicUrl = commonUtil.httpUrl;
    var userId = "";
    var token = commonUtil.getToken();
    token = token != null ? token : "";
    var sessionId = commonUtil.getSessionId();
    var userTableData = function () {
        console.log("sessionId: " + sessionId);
        console.log("token: " + token);

        $.ajax({
            url: basicUrl+ "/users",
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
                    initUserTable(data.data.rows);
                }else{
                    layer.alert(data.msg, {
                        skin: 'layui-layer-lan',
                        closeBtn: 1,
                        anim: 4 //动画类型
                    });
                }
            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {
                layer.alert("网络错误!", {
                    skin: 'layui-layer-lan',
                    closeBtn: 1,
                    anim: 4 //动画类型
                });
            }
        });
    }

    var initUserTable = function(data){
        //先销毁表格
        $('#user-table-pagination').bootstrapTable('destroy');
        //初始化表格,动态从服务器加载数据
        $("#user-table-pagination").bootstrapTable({
          //  method: "get",  //使用get请求到服务器获取数据
           // url:basicUrl+"/users" , //获取数据的Servlet地址
            data:data,
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
                    userId : $("#userId").val()
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
       var row= $('#user-table-pagination').bootstrapTable('getSelections');
       console.log(row);
       if(row.length == 0){
           layer.alert('请选择用户', {
               skin: 'layui-layer-lan',
               closeBtn: 1,
               anim: 4 //动画类型
           });
       }else{
           userId = row[0].userId;
       }

   }

    /*   $('#openAddRoleForm').on('click', function(){
     layer.open({
     type: 1,
     area: ['600px', '360px'],
     shadeClose: true, //点击遮罩关闭
     content: initaddForm()
     });
     });*/

    $('#openRoleForm').on('click', function(){
        selecteions();
        if(userId != ''){
            layer.open({
                type: 2,
                title: '分配角色',
                maxmin: true,
                shadeClose: true, //点击遮罩关闭层
                area : ['80%' , '80%'],
                content: '../../../pages/authority/role/user_role.html?userId='+userId
            });
        }

    });



    return {
        //main function to initiate the module
        init: function () {

            userTableData();

        }
    };
}();

jQuery(document).ready(function() {
    UserList.init();
});