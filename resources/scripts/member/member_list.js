var MemberList  = function () {
    var basicUrl = commonUtil.httpUrl;


    /**
     * 初始化会员表格数据
     */
    var initTableDatas = function () {
        $('#member-table-pagination').bootstrapTable('showLoading');

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
                    initMemberTable(data.data);
                    $('#member-table-pagination').bootstrapTable('hideLoading');
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


        $("#member-table-pagination tbody tr td").click(function() {
            $(this).parent().toggleClass("clickTr");
        });
    }




    /**
     * 初始化Table
     * @param listData
     */
    var initMemberTable = function(listData){
        //先销毁表格
        $('#member-table-pagination').bootstrapTable('destroy');
        //初始化表格,动态从服务器加载数据
        $("#member-table-pagination").bootstrapTable({
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
                {
                    field: '',
                    title: 'Sort No.',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                },
                {
                    field: 'id',
                    title: 'User ID',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                }, {
                    field: 'institutionCode',
                    title: 'Institution Code',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                }, {
                    field: 'institutionName',
                    title: 'Institution Name',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'loginId',
                    title: 'Login Name',
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
                    title: 'Real Name',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'createTime',
                    title: 'Create Time',
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



    $('#openRoleForm').on('click', function(){
        selecteions();
        if(memberId != ''){
            layer.open({
                type: 2,
                title: '分配角色',
                maxmin: true,
                shadeClose: true, //点击遮罩关闭层
                area : ['80%' , '80%'],
                content: '../../../pages/authority/role/member_role.html?memberId='+memberId
            });
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