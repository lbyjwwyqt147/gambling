var MemberList  = function () {
    var basicUrl = commonUtil.httpUrl;
    var table1 = $('#member-search-table1-pagination');
    var table2 = $('#member-search-table2-pagination');
    /**
     * 初始化表格1数据
     */
    var initTableDatas = function () {
        table1.bootstrapTable('showLoading');
        $.ajax({
            url: basicUrl+ "/list",
            type:"GET",
            dataType:"json",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success :function (data,textStatus) {
                console.log(data);
                if(data.status == 0){
                    initMemberTable1(data.data);
                    initMemberTable2(data.data);
                    table1.bootstrapTable('hideLoading');
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




    /**
     * 初始化Table1
     * @param listData
     */
    var initMemberTable1 = function(listData){
        //先销毁表格
        table1.bootstrapTable('destroy');
        //初始化表格,动态从服务器加载数据
        table1.bootstrapTable({
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
            showExport: true,
            exportDataType: 'all',
            responseHandler: responseHandler,
            columns: [
                {
                    field:'state',
                    checkbox:true
                },
                /*   {
                       field: '',
                       title: '序号',
                       formatter: function (value, row, index) {
                           return index + 1;
                       },
                       class:''
                   },*/
                {
                    field: 'id',
                    title: 'Member ID',
                    align: 'center',
                    valign: 'middle',
                    sortable: false,
                    visible:false
                }, {
                    field: 'institutionCode',
                    title: '编号',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                }, {
                    field: 'institutionName',
                    title: '姓名',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'loginId',
                    title: '余分',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    editable: {
                        type: 'text',
                        validate: function (value) {
                            if ($.trim(value) == '') {
                                return '单元编号不能为空!';
                            }
                        }
                    }
                }, {
                    field: 'realName',
                    title: '抽成',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'createTime',
                    title: '下注',
                    align: 'center',
                    valign: 'left'/*,
                    formatter: function (value, row, index) {
                        return new Date(value).format('yyyy-MM-dd hh:mm:ss');
                    }*/
                }, {
                    field: 'homeAddress',
                    title: 'Address',
                    align: 'center',
                    valign: 'middle'
                }]
        });
    }


    /**
     * 初始化Table2
     * @param listData
     */
    var initMemberTable2 = function(listData){
        //先销毁表格
        table2.bootstrapTable('destroy');
        //初始化表格,动态从服务器加载数据
        table2.bootstrapTable({
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
            showExport: true,
            exportDataType: 'all',
            responseHandler: responseHandler,
            columns: [
                {
                    field:'state',
                    checkbox:true
                },
                /*   {
                       field: '',
                       title: '序号',
                       formatter: function (value, row, index) {
                           return index + 1;
                       },
                       class:''
                   },*/
                {
                    field: 'id',
                    title: 'Member ID',
                    align: 'center',
                    valign: 'middle',
                    sortable: false,
                    visible:false
                }, {
                    field: 'institutionCode',
                    title: '编号',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                }, {
                    field: 'institutionName',
                    title: '姓名',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'loginId',
                    title: '余分',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    editable: {
                        type: 'text',
                        validate: function (value) {
                            if ($.trim(value) == '') {
                                return '单元编号不能为空!';
                            }
                        }
                    }
                }, {
                    field: 'realName',
                    title: '抽成',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'createTime',
                    title: '下注',
                    align: 'center',
                    valign: 'left'/*,
                    formatter: function (value, row, index) {
                        return new Date(value).format('yyyy-MM-dd hh:mm:ss');
                    }*/
                }, {
                    field: 'homeAddress',
                    title: 'Address',
                    align: 'center',
                    valign: 'middle'
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
            /*   orgCode : $("#orgCode").val(),
               userName : $("#userName").val(),
               startDate : $("#startDate").val(),
               endDate : $("#endDate").val(),*/
            limit : this.limit, // 页面大小
            offset : this.offset, // 页码
            pageindex : this.pageNumber,
            pageSize : this.pageSize
        }
        return param;
    }

    // 用于server 分页，表格数据量太大的话 不想一次查询所有数据，可以使用server分页查询，数据量小的话可以直接把sidePagination: "server"  改为 sidePagination: "client" ，同时去掉responseHandler: responseHandler就可以了，
    function responseHandler(res) {
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
     * 获取选中行数据
     */
    function selecteions(){
        var row= $('#member-table-pagination').bootstrapTable('getSelections');
        console.log(row);
        if(row.length == 0){
            layer.alert('请选择会员', {
                skin: 'layui-layer-lan',
                closeBtn: 1,
                anim: 4 //动画类型
            });
        }else{
            memberId = row[0].memberId;
        }

    }

    /**
     * 弹出form 表单页
     */
    function openFormPage(sign) {
        var  title = "";
        if(sign == 1){
            title = "新增会员信息";
        }else {
            title = "修改会员信息";
        }
        var that = this;
        //多窗口模式，层叠置顶
        parent.layer.open({
            type: 2 ,
            title: title,
            area: ['325px' , '392px'],
            shade: 0.01,
            shadeClose: false,
            maxmin: false, //开启最大化最小化按钮
            offset: '100px',  //间距上边100px
            content: '../../resources/pages/member/member_form.html'
        });

    }



    $('#addBtn').on('click', function(){
        //selecteions();
        openFormPage(1);


        /* if(memberId != ''){
             layer.open({
                 type: 2,
                 title: '分配角色',
                 maxmin: true,
                 shadeClose: true, //点击遮罩关闭层
                 area : ['80%' , '80%'],
                 content: '../../../pages/authority/role/member_role.html?memberId='+memberId
             });
         }*/

    });



    return {
        init: function () {
            initTableDatas();
        }
    };
}();

jQuery(document).ready(function() {
    MemberList.init();
});