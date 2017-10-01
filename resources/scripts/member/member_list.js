var MemberList  = function () {
    var basicUrl = commonUtil.httpUrl;
    var  gridTable = $('#member-table-pagination');

    /**
     * 初始化会员表格数据
     */
    var initTableDatas = function () {
        gridTable.bootstrapTable('showLoading');
        $.ajax({
            //url: basicUrl+ "/list",
            url:commonUtil.gridJsonUrl,
            type:"GET",
            dataType:"json",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success :function (data,textStatus) {
                console.log(data);
                if(data.status == 0){
                    initMemberTable(data.datas.dataGrid);
                    gridTable.bootstrapTable('hideLoading');
                }else{
                    layer.alert(data.msg, {
                        skin: 'layui-layer-lan',
                        closeBtn: 1,
                        shade: 0.01,
                        anim: 4 //动画类型
                    });
                }
            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {
                layer.alert("网络错误!", {
                    skin: 'layui-layer-lan',
                    closeBtn: 1,
                    shade: 0.01,
                    anim: 4 //动画类型
                });
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
            showExport: true,
            exportDataType: 'all',
            responseHandler:  function (res) {   //在ajax请求成功后，发放数据之前可以对返回的数据进行处理，返回什么部分的数据，比如我的就需要进行整改的！
                console.log(res);
                responseHandler(res);
            },
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
                    field: 'memberCode',
                    title: '编号',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                }, {
                    field: 'memberName',
                    title: '姓名',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'memberBalance',
                    title: '积分余额',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                }, {
                    field: 'rake',
                    title: '抽成',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                }, {
                    field: 'bottomPour',
                    title: '下注',
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
            memberName : $("#memberName").val(),// 参数
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
            content: '../../resources/pages/member/member_form.html?params='+params
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
            console.log(params);
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
     * 删除事件
     */
    $('#trashBtn').on('click', function(){
        var ids = getRowIds();
        if(ids != null) {

            /* $.ajax({
                 url: basicUrl+ "/list",
                 type:"DELETE",
                 dataType:"json",
                 xhrFields: {
                     withCredentials: true
                 },
                 crossDomain: true,
                 success :function (data,textStatus) {
                     console.log(data);
                     if(data.status == 0){

                     }else{
                         layer.alert(data.msg, {
                             skin: 'layui-layer-lan',
                             closeBtn: 1,
                             shade: 0.01,
                             anim: 4 //动画类型
                         });
                     }
                 },
                 error:function (XMLHttpRequest, textStatus, errorThrown) {
                     layer.alert("网络错误!", {
                         skin: 'layui-layer-lan',
                         closeBtn: 1,
                         shade: 0.01,
                         anim: 4 //动画类型
                     });
                 }
             });*/

            //从表格中移除选中行
            gridTable.bootstrapTable('remove', {
                field: 'id',
                values: ids
            });

            layer.msg('删除会员信息成功.', {icon: 1});
        }
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