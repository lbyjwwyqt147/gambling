var MemberShimobunList  = function () {
    var basicUrl = commonUtil.httpUrl;
    //左边表格
    var table1 = $('#member-shimobun-table1-pagination');
    //右边表格
    var table2 = $('#member-shimobun-table2-pagination');
    /**
     * 初始化左边表格数据
     */
    var initTableDatas = function () {
        table1.bootstrapTable('showLoading');
        $.ajax({
           // url: basicUrl+ "/list",
            url: commonUtil.gridJsonUrl,
            type:"GET",
            dataType:"json",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success :function (data,textStatus) {
                if(data.status == 0){
                    initMemberShimobunTable1(data.datas.dataGrid);
                    table1.bootstrapTable('hideLoading');
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
     * 初始化坐标表格
     * @param listData
     */
    var initMemberShimobunTable1 = function(listData){
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
              /*  {
                    field:'state',
                    checkbox:true
                },*/
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
                    valign: 'middle',
                    sortable: true
                },
                {
                    field: 'bottomPour',
                    title: '下注',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    editable: {
                        type: 'number',
                        //mode: "inline",
                        validate: function (value) {
                            if ($.trim(value) == '') {
                                return '请填写下注值!';
                            }
                        }
                    }
                }, {
                    field: 'memberBalance',
                    title: '积分余额',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                },
                {
                    field: 'mantissa',
                    title: '尾数',
                    align: 'center',
                    valign: 'middle',
                    sortable: false,
                    visible:false
                },
                {
                    field: 'banker',
                    title: '庄家',
                    align: 'center',
                    valign: 'middle',
                    sortable: false,
                    formatter: function (value, row, index) {
                        var rowId = row.id;
                        var e = '<a href="javascript:MemberShimobunList.insertTable2Row('+rowId+',1);" class="btn btn-circle btn-sm default"> 庄</a> ';
                        return e;
                    }
                }],
            onEditableSave: function (field, row, oldValue, $el) {
                //将下注后的用户移植到右边表格中显示
                table2.bootstrapTable('insertRow', {
                    index: 1,
                    row:row
                   /* row: {
                         id: randomId,
                        name: 'Item ' + randomId,
                        price: '$' + randomId
                    }*/
                });
                //移除当前行
                removeTable1Row(row.id);


              /*  $.ajax({
                    type: "post",
                    url: "",
                    data: row,
                    dataType: 'JSON',
                    success: function (data, status) {
                        if (status == "success") {
                            alert('提交数据成功');
                        }
                    },
                    error: function () {
                        alert('编辑失败');
                    },
                    complete: function () {

                    }

                });*/
            }
        });
    }


    /**
     * 初始化右边表格
     * @param listData
     */
    var initMemberShimobunTable2 = function(listData){
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
                /*{
                    field:'state',
                    checkbox:true
                },*/
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
                    valign: 'middle',
                    sortable: true,
                }, {
                    field: 'mantissa',
                    title: '尾数',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    editable: {
                        type: 'number',
                        //mode: "inline",

                        validate: function (value) {
                            if ($.trim(value) == '') {
                                return '请输入尾数值!';
                            }
                        }
                    }
                }, {
                    field: 'bottomPour',
                    title: '下注',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                }, {
                    field: 'banker',
                    title: '庄家',
                    align: 'center',
                    valign: 'middle',
                    sortable: false,
                    formatter: function (value, row, index) {
                        var color = "default";
                        if (value == 1){
                            color = "green";
                        }
                        var e = '<a href="javascript:;" class="btn btn-circle btn-sm '+color+'"> 庄</a> ';
                        return e;
                    }
                },
                {
                    title: '操作',
                    field: 'operate',
                    align: 'center',
                    valign: 'middle',
                    sortable: false,
                    formatter:function(value,row,index){
                        var rowId = row.id;
                        var d = '<a href="javascript:;" onclick="MemberShimobunList.removeTable2Row('+rowId+')" class="btn btn-circle btn-sm red delete"><i class="fa fa-trash-o"></i> 删除 </a> ';
                        return d;
                    }
                }],
            onEditableSave: function (field, row, oldValue, $el) {

                console.log(row);


                /*  $.ajax({
                      type: "post",
                      url: "",
                      data: row,
                      dataType: 'JSON',
                      success: function (data, status) {
                          if (status == "success") {
                              alert('提交数据成功');
                          }
                      },
                      error: function () {
                          alert('编辑失败');
                      },
                      complete: function () {

                      }

                  });*/
            }
        });
    }

    /**
     * 移除左表行
     * @param rowId
     */
    function removeTable1Row(rowId) {
        var ids = new Array();
        ids.push(rowId);
        table1.bootstrapTable('remove', {
            field: 'id',
            values: ids
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
     * 计算事件
     */
    $('#calculatorbtn').on('click', function(){
        var bestMantissa = $("#bestMantissa").val();
        if (bestMantissa != ""){
           openCalculatePage();
        }else {
            layer.alert("请输入最佳尾数.", {
                skin: 'layui-layer-lan',
                closeBtn: 1,
                offset:['10px' , '71%'],
                shade: 0.01,
                anim: 4 //动画类型
            });
        }


    });
    /**
     * 弹出计算结果页
     */
    function openCalculatePage() {
        var that = this;
        //多窗口模式，层叠置顶
        parent.layer.open({
            id: 'calculate-page',
            type: 2 ,
            title: "",
            area: ['50%' , '90%'],
            shade: 0.01,
            shadeClose: false,
            maxmin: false, //开启最大化最小化按钮
            offset: '20px',  //间距上边100px
            content: '../../resources/pages/shimobun/shimobun_calculate.html',
            btn: ['生成图片', '关闭'],
            yes: function(index,layero){
                layer.getChildFrame('body', index);
                // 调用子窗口中的方法
               // layero.find('iframe')[0].contentWindow.generateImage();
                return flag;

            },
            btn2: function(index, layero){
                layer.closeAll();
            }

        });

    }


    return {
        /**
         * 初始化
         */
        init: function () {
            initTableDatas();
            initMemberShimobunTable2();
        },
        /**
         * 右边表格删除事件
         */
        removeTable2Row :function(rowId){
            var ids = new Array();
            ids.push(rowId);
            console.log(ids);
            table2.bootstrapTable('remove', {
                field: 'id',
                values: ids
            });
        },
        /**
         * 向右边表格插入行
         * @param rowId
         */
        insertTable2Row :function(rowId,v){
            var row = table1.bootstrapTable('getRowByUniqueId', rowId);
            row.banker = v;
            table2.bootstrapTable('insertRow', {
                index: 1,
                row:row
            });
            removeTable1Row(rowId);
        }
    };
}();

jQuery(document).ready(function() {
    MemberShimobunList.init();
});