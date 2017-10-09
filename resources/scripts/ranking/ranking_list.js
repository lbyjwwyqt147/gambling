var MemberList  = function () {
    var basicUrl = commonUtil.httpUrl;
    var  gridTable = $('#member-table-pagination');

    /**
     * 初始化会员表格数据
     */
    var initTableDatas = function (sign) {
        gridTable.bootstrapTable('showLoading');
        $.ajax({
            url: basicUrl+ "/userController/getUserByMoney",

            type:"POST",
            dataType:"json",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success :function (data,textStatus) {
                var jsonObj = commonUtil.stringToJson(data);
                if(jsonObj.status == 0){
                    if(sign == 1){
                        gridTable.bootstrapTable('load', jsonObj.datas.dataGrid);
                    }else{
                        initMemberTable(jsonObj.datas.dataGrid);
                    }
                    gridTable.bootstrapTable('hideLoading');
                }else{
                    /* layer.alert(data.message, {
                         skin: 'layui-layer-lan',
                         closeBtn: 1,
                         shade: 0.01,
                         anim: 4 //动画类型
                     });*/
                    layer.msg(jsonObj.message, {icon: 5});
                }
            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {
                /* layer.alert("网络错误!", {
                     skin: 'layui-layer-lan',
                     closeBtn: 1,
                     shade: 0.01,
                     anim: 4 //动画类型
                 });*/
                layer.msg("网络错误!", {icon: 5});
            }
        });
    }




    /**
     * 初始化Table
     * @param listData
     */
    var initMemberTable = function(listData){
        //先销毁表格
        gridTable.bootstrapTable('destroy');
        //初始化表格,动态从服务器加载数据
        gridTable.bootstrapTable({
            method: 'GET',
            //toolbar: '#toolbar',                        //工具按钮用哪个容器
            dataType: 'json',
            contentType: "application/x-www-form-urlencoded",
            data:listData,
            cache: false,
            clickToSelect:true,                         //是否启动点击选中行
            striped: true,                              //是否显示行间隔色
            sidePagination: "client",                  //分页方式：client客户端分页，server服务端分页（*）
            height: $(window).height() - 120,
            width: $(window).width(),
            showColumns: false,                        //是否显示列
            pagination: true,
            queryParams: queryParams,
            minimumCountColumns: 2,
            pageNumber: 1,                       //初始化加载第一页，默认第一页
            pageSize: 20,                       //每页的记录行数（*）
            pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
            responseHandler:  function (res) {   //在ajax请求成功后，发放数据之前可以对返回的数据进行处理，返回什么部分的数据，比如我的就需要进行整改的！
                responseHandler(res);
            },
            showExport: false,  //是否显示导出按钮
            buttonsAlign:"right",  //按钮位置
            exportTypes:['excel'],  //导出文件类型
            Icons:'glyphicon-export',
            exportOptions:{
                ignoreColumn: [0,1],  //忽略某一列的索引
                fileName: '会员信息',  //文件名称设置
                worksheetName: 'sheet1',  //表格工作区名称
                tableName: '会员信息',
                excelstyles: ['background-color', 'color', 'font-size', 'font-weight']
            },
            columns: [

                {
                    field: 'id',
                    title: 'Member ID',
                    align: 'center',
                    valign: 'middle',
                    sortable: false,
                    visible:false
                }, {
                    field: 'userId',
                    title: '编号',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                }, {
                    field: 'name',
                    title: '姓名',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'source',
                    title: '剩余积分',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                }]
        });
    }



    /**
     * 查询参数
     * @param params
     * @returns {{limit: *, offset: *, pageindex, pageSize: *}}
     */
    var  queryParams = function (params) {
        var param = {
            searchCondition : $("#memberName").val(),// 参数
            limit : this.limit, // 页面显示纪录条数
            offset : this.offset, // 当前页码
            pageNumber : this.pageNumber,  // 当前页码
            pageSize : this.pageSize       // 页面显示纪录条数
        }
        return param;
    }

    // 用于server 分页，表格数据量太大的话 不想一次查询所有数据，可以使用server分页查询，数据量小的话可以直接把sidePagination: "server"  改为 sidePagination: "client" ，同时去掉responseHandler: responseHandler就可以了，
    function responseHandler(res) {
        console.log(res);
        if (res) {
            return {
                "rows": res.result,
                "total": res.totalCount
            };
        } else {
            return {
                "rows": [],
                "total": 0
            };
        }
    }

    /**
     * 获取选中的行
     */
    function  getSelectRows() {
        var row = gridTable.bootstrapTable('getSelections');
        if(row.length == 0){
            layer.alert('请选择会员', {
                skin: 'layui-layer-lan',
                closeBtn: 1,
                shade: 0.01,
                icon: 7,
                anim: 4 //动画类型
            });
        }else if (row.length > 1){
            layer.alert('每次只能选择一位会员进行修改', {
                skin: 'layui-layer-lan',
                closeBtn: 1,
                shade: 0.01,
                icon: 7,
                anim: 4 //动画类型
            });
        }else {
            return row[0];
        }
    }

    /**
     * 获取选中行的主键ID
     */
    function getRowIds(sign) {
        var ids = $.map(gridTable.bootstrapTable('getSelections'), function (row) {
            return row.id;
        });
        if(ids.length == 0){
            layer.alert('请选择会员', {
                skin: 'layui-layer-lan',
                closeBtn: 1,
                shade: 0.01,
                icon: 7,
                anim: 4 //动画类型
            });
        }else {
            if (sign === 1){
                return ids[0];
            }else {
                return ids;
            }
        }

    }

    /**
     * 弹出form 表单页
     */
    function openFormPage(sign,params) {
        var  title = "";
        var formHeight = "255px";
        if(sign == 1){
            title = "新增会员信息";
        }else {
            title = "修改会员信息";
            formHeight = "305px";
        }
        var that = this;
        //多窗口模式，层叠置顶
        layer.open({
            type: 2 ,
            title: title,
            area: ['325px' , formHeight],
            shade: 0.01,
            shadeClose: false,
            maxmin: false, //开启最大化最小化按钮
            offset: '30px',  //间距上边30px
            content: '../../../resources/pages/member/member_form.html?params='+params
        });

    }



    /**
     * 添加事件
     */
    $('#addBtn').on('click', function(){
        openFormPage(1,"");
    });

    /**
     * 编辑事件
     */
    $('#pencilBtn').on('click', function(){
        var row = getSelectRows();
        if(row != null){
            var params = JSON.stringify(row);
            params = params.replace(/\"/g,"'");
            openFormPage(2,params);
        }
    });

    /**
     * 财务事件
     */
    $('#moneyBtn').on('click', function(){
        var ids = getRowIds();
        if(ids != null){
            layer.prompt({title: '输入需要加减的数量，并确认', formType: 1}, function(pass, index){
                layer.close(index);   //关闭事件
                layer.close(index);                      //保存事件
            });
        }

    });

    /**
     * 抽水统计事件
     */
    $('#bar-chart').on('click', function(){
        $.ajax({
            url: basicUrl+ "/userController/countCut",
            type:"POST",
            dataType:"json",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success :function (data,textStatus) {
                var jsonObj = commonUtil.stringToJson(data);
                if(jsonObj.status == 0){
                    layer.alert('系统总抽水分数:'+jsonObj.datas, {icon: 6, shade: 0.01});
                }else{
                    layer.msg(jsonObj.message, {icon: 5});
                }
            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {
                layer.msg("网络错误!", {icon: 5});
            }
        });

    });


    /**
     * 一件清除事件
     */
    $('#paint-brush').on('click', function(){
        layer.confirm('确定要一件清除吗？', {
            title:"提示信息",
            // skin: 'layui-layer-lan',
            shade: 0.01,
            icon: 3,
            anim: 4 ,
            btn: ['确定', '取消'],
            yes: function(index,layero){
                $.ajax({
                    url: basicUrl+ "/userController/clearAll",
                    type:"POST",
                    dataType:"json",
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success :function (data,textStatus) {
                        var jsonObj = commonUtil.stringToJson(data);
                        if(jsonObj.status == 0){
                            layer.msg('一件清除成功.', {icon: 1,
                                end:function () {
                                    layer.closeAll();
                                }});
                            initTableDatas(1);
                        }else{
                            layer.msg(jsonObj.message, {icon: 5});
                        }
                    },
                    error:function (XMLHttpRequest, textStatus, errorThrown) {
                        layer.msg("网络错误!", {icon: 5});
                    }
                });
            },
            btn2: function(index, layero){
                layer.closeAll();
            }
        });




    });

    /**
     * 导出事件
     */
    $('#data-download').on('click', function(){
        gridTable.tableExport({type: 'excel', escape: 'false',fileName:'会员信息',worksheetName:'会员信息'
        });
    });

    /**
     * 删除事件
     */
    $('#trashBtn').on('click', function(){
        var ids = getRowIds();
        if(ids != null) {

            $.ajax({
                url: basicUrl+ "/userController/deleteUserList",
                type:"POST",
                dataType:"json",
                data:{
                    userIdString:ids.join()
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success :function (data,textStatus) {
                    var jsonObj = commonUtil.stringToJson(data);
                    if(jsonObj.status == 0){
                        //从表格中移除选中行
                        gridTable.bootstrapTable('remove', {
                            field: 'id',
                            values: ids
                        });

                        layer.msg('删除会员信息成功.', {icon: 1});
                    }else{
                        layer.msg(jsonObj.message, {icon: 5});
                        /*layer.alert(data.message, {
                            skin: 'layui-layer-lan',
                            closeBtn: 1,
                            shade: 0.01,
                            anim: 4 //动画类型
                        });*/
                    }
                },
                error:function (XMLHttpRequest, textStatus, errorThrown) {
                    /*layer.alert("网络错误!", {
                        skin: 'layui-layer-lan',
                        closeBtn: 1,
                        shade: 0.01,
                        anim: 4 //动画类型
                    });*/
                    layer.msg("网络错误!", {icon: 5});
                }
            });


        }
    });



    return {
        init: function () {
            initTableDatas(0);
        }
    };
}();

jQuery(document).ready(function() {
    MemberList.init();
});