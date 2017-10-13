var MemberShimobunList  = function () {
    var basicUrl = commonUtil.httpUrl;
    //左边表格
    var table1 = $('#member-shimobun-table1-pagination');
    //右边表格
    var table2 = $('#member-shimobun-table2-pagination');
    var luckyNumber = "";
    //保存按钮点击次数
    var tempSaveCount = 0;
    var memberId = commonUtil.getUrlParams("p");


    /**
     * 初始化左边表格数据
     */
    var initTableDatas = function (sgin) {
        var searchConditionValue = $("#memberName").val();
        table1.bootstrapTable('showLoading');
        $.ajax({
            url: basicUrl+ "/userController/userList",
            data:{
                searchCondition : searchConditionValue,
                identity:memberId
            },
            type:"POST",
            dataType:"text",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success :function (data,textStatus) {
                var jsonObj = commonUtil.stringToJson(data);
                if(jsonObj.status == 0){
                    if(sgin == 2){
                        table1.bootstrapTable('load', jsonObj.datas.dataGrid);
                    }else {
                        initMemberShimobunTable1(jsonObj.datas.dataGrid);
                    }
                    table1.bootstrapTable('hideLoading');
                }else if(jsonObj.status == -1){
                    commonUtil.anewLoginLayer();
                }else{
                   /* layer.alert(jsonObj.message, {
                        skin: 'layui-layer-lan',
                        closeBtn: 1,
                        shade: 0.01,
                        anim: 4 //动画类型
                    });*/
                    layer.msg(jsonObj.message, {icon: 5});
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




    /**
     * 初始化左边表格
     * @param listData
     */
    var initMemberShimobunTable1 = function(listData){
        //先销毁表格
        table1.bootstrapTable('destroy');
        //初始化表格,动态从服务器加载数据
        table1.bootstrapTable({
            method: 'GET',
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
            minimumCountColumns: 2,
            pageNumber: 1,                       //初始化加载第一页，默认第一页
            pageSize: 20,                       //每页的记录行数（*）
            pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
            showExport: true,
            exportDataType: 'all',
            columns: [
              /*  {
                    field:'state',
                    checkbox:true
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
                    width:"150px",
                    sortable: false,
                    /*editable: {
                        type: 'text',
                        //mode: "inline",
                        validate: function (value) {
                            if ($.trim(value) == '') {
                                return '请填写下注值!';
                            }else{
                                var patrn = /^\+?[1-9][0-9]*$/;
                                var str = $.trim(value);
                                if (!patrn.exec(str)){
                                    return "下注值必须大于0.";
                                }
                            }
                        }
                    },*/
                    formatter:function(value,row,index){
                        // onchange="MemberShimobunList.insertTable2RowData('+row.id+',this)"
                        if(row.tmp){
                            return '<input class="form-control bottomPour" type="number" value="'+value+'" autocomplete="off" min="0" placeholder="下注值" name="bottomPour" onmousedown="if(event.button == 2)MemberShimobunList.insertTable2RowData('+row.id+',this,'+index+');" onchange="MemberShimobunList.setTable1RowJson('+row.id+',this,'+index+')"/>'
                        }else{
                            return '<input class="form-control bottomPour" type="number"  autocomplete="off" min="0" placeholder="下注值" name="bottomPour" onmousedown="if(event.button == 2)MemberShimobunList.insertTable2RowData('+row.id+',this,'+index+');" onchange="MemberShimobunList.setTable1RowJson('+row.id+',this,'+index+')"/>'
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
                /*row.mantissa=99999999;
                row.banker=2;
                row.bankerTest=2;
                //将下注后的用户移植到右边表格中显示
                table2.bootstrapTable('insertRow', {
                    index: 1,
                    row:row
                });
                //移除当前行
                removeTable1Row(row.id);*/

            }
        });

        $('.bottomPour').bind("contextmenu",
            function(){
                return false;
            }
        );
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
            minimumCountColumns: 2,
            pageNumber: 1,                       //初始化加载第一页，默认第一页
            pageSize: 20,                       //每页的记录行数（*）
            pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
            showExport: true,
            exportDataType: 'all',
            columns: [
             /*   {
                    field:'state',
                    checkbox:true
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
                    width:"150px",
                    sortable: false,
                  /*  editable: {
                        type: 'text',
                        validate: function (value) {
                            if ($.trim(value) == '') {
                                return '请填写尾数值!';
                            }else {
                                var patrn = /^[0-9]$/;
                                var str = $.trim(value);
                                if (!patrn.exec(str)){
                                    return "尾数值只能填写0~9之间的整数.";
                                }
                            }

                        }
                    },*/
                    formatter:function(value,row,index){
                        if(value==99999999){
                            return '<input class="form-control" type="number" autocomplete="off" placeholder="尾数值" min="0" max="9" name="mantissa" onchange="MemberShimobunList.validTable2Mantissa('+row.id+',this,'+index+')"/>'
                        }else {
                            return '<input class="form-control" type="number" autocomplete="off" placeholder="尾数值" min="0" value="'+value+'" max="9" name="mantissa" onchange="MemberShimobunList.validTable2Mantissa('+row.id+',this,'+index+')"/>';
                        }
                    }
                }, {
                    field: 'bottomPour',
                    title: '下注',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                }, {
                    field: 'bankerText',
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
                    field: 'banker',
                    title: '庄家',
                    align: 'center',
                    valign: 'middle',
                    sortable: false,
                    visible:false
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
                // 单元格保存事件
            }
        });

    }

    /**
     * 回车
     */
    $('#memberName').keypress(function (e) {
        if (e.which == 13) {
            initTableDatas(2);
            return false;
        }
    });


    /**
     * 移除左表行
     * @param rowId
     */
    function removeTable1Row(rowId) {
        var ids = new Array();
        ids.push(rowId.toString());
        table1.bootstrapTable('remove', {
            field: 'id',
            values: ids
        });
    }


    /**
     * 查询事件
     */
    $("#query-btn").click(function(){
        initTableDatas(2);
    });

    /**
     * 计算事件
     */
    $('#calculatorbtn').on('click', function(){
        var bestMantissa = $("#bestMantissa").val();
        var flag = true;
        var makersTypes = new  Array();
        var xianTypes = new  Array();
        var params = new Array();
        //获取 右边grid中的全部数据
        var table2Datas = table2.bootstrapTable('getData');
        $.each(table2Datas,function(i,v){
            if(v.mantissa == 99999999){
                layer.alert(v.memberName+"的尾数值未填写或者填写有错误.", {
                    skin: 'layui-layer-lan',
                    closeBtn: 1,
                    icon: 7,
                    offset:['10px' , '71%'],
                    shade: 0.01,
                    anim: 4 //动画类型
                });
                flag = false;
                return false;
            }
            var bankerType = $.trim(v.banker);
            var obj = {
                inNumber:$.trim(v.mantissa),
                inSource:$.trim(v.bottomPour),
                userId:$.trim(v.id),
                type:$.trim(v.banker)
            }
            if(bankerType == 1){
                makersTypes.push(bankerType);
            }else{
                xianTypes.push(bankerType)
            }
            params.push(obj);
        });
        if(flag && makersTypes.length != 1){
            layer.alert("请选择一位庄家.", {
                skin: 'layui-layer-lan',
                closeBtn: 1,
                icon: 7,
                offset:['10px' , '71%'],
                shade: 0.01,
                anim: 4 //动画类型
            });
            flag = false;
        }
        if(flag && xianTypes.length == 0){
            layer.alert("请至少选择一位闲家.", {
                skin: 'layui-layer-lan',
                closeBtn: 1,
                icon: 7,
                offset:['10px' , '71%'],
                shade: 0.01,
                anim: 4 //动画类型
            });
            flag = false;
        }
        var lastParams = JSON.stringify(params).replace(/\"/g,"'");
        if(flag){
            if ($.trim(bestMantissa) != ""){
                var patrn = /^[0-9]$/;
                var str = $.trim(bestMantissa);
                if (!patrn.exec(str)){
                    layer.alert("幸运数值只能填写0~9之间的整数.", {
                        skin: 'layui-layer-lan',
                        closeBtn: 1,
                        icon: 7,
                        offset:['10px' , '71%'],
                        shade: 0.01,
                        anim: 4 //动画类型
                    });
                }else {
                    luckyNumber = $.trim(bestMantissa);
                    openCalculatePage(lastParams);
                }

            }else {
                layer.alert("请填写最佳幸运数值.", {
                    skin: 'layui-layer-lan',
                    closeBtn: 1,
                    icon: 7,
                    offset:['10px' , '71%'],
                    shade: 0.01,
                    anim: 4 //动画类型
                });
            }
        }



    });
    /**
     * 弹出计算结果页
     */
    function openCalculatePage(params) {
        var that = this;
        //多窗口模式，层叠置顶
        parent.layer.open({
            id: 'calculate-page',
            type: 2 ,
            title: "",
            area: ['588px' , '90%'],
            shade: 0.01,
            shadeClose: false,
            maxmin: false, //开启最大化最小化按钮
            offset: '20px',  //间距上边100px
            content: '../../resources/pages/shimobun/shimobun_calculate.html?params='+params+'&luckNumber='+luckyNumber+'&p='+memberId,
            //btn: ['复制','保存', '关闭'],
            btn: ['保存', '关闭'],
            resize:false,
            move: false,
          /*  btn1: function(index,layero){
                console.log(layero.find('iframe')[0]);
                layero.find('iframe')[0].contentWindow.copyImage();
            },*/
            yes: function(index,layero){
                //layer.getChildFrame('body', index);
                // 调用子窗口中的方法
               // layero.find('iframe')[0].contentWindow.generateImage();
                parent.$(".layui-layer-btn0").css({
                    "color":"gray",
                    "background-color":"lightgray",
                    "cursor":"no-drop"
                });
                if(tempSaveCount == 0){
                    saveCalculateResult();
                }
               // saveCalculateResult();
            },
            btn2: function(index, layero){
                tempSaveCount = 0;
                layer.closeAll();
            },
            end:function () {
                tempSaveCount = 0;
            }

        });

    }

    /**
     * 保存计算结果
     */
    function saveCalculateResult() {
        $.ajax({
            url: basicUrl+ "/collectPointController/dealOrderData",
            data:{
                identity:memberId
            },
            type:"POST",
            dataType:"text",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success :function (data,textStatus) {
                var jsonObj = commonUtil.stringToJson(data);
                if(jsonObj.status == 0){
                    tempSaveCount = 1;
                    $("#memberName").val("");
                    parent.layer.msg("保存数据成功.", {icon: 1});
                    initTableDatas(2);
                    initMemberShimobunTable2();
                }else if(jsonObj.status == -1){
                    commonUtil.anewLoginLayer();
                }else{
                    parent.$(".layui-layer-btn0").css({
                        "color":"",
                        "background-color":"",
                        "cursor":""
                    });
                    parent.layer.msg(jsonObj.message, {icon: 5});
                }
            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {
                parent.$(".layui-layer-btn0").css({
                    "color":"",
                    "background-color":"",
                    "cursor":""
                });
                parent.layer.msg("网络错误!", {icon: 5});
            }
        });
    }

    /**
     * 检测是否已经存在庄家
     */
    function checkIsExistmakers() {
        var flag = true;
        //获取 右边grid中的全部数据
        var table2Datas = table2.bootstrapTable('getData');
        $.each(table2Datas,function(i,v){
            if(v.banker == 1){
                layer.alert("已经有庄家了,每局只能选择一位庄家.", {
                    skin: 'layui-layer-lan',
                    closeBtn: 1,
                    icon: 7,
                    offset:['10px' , '45%'],
                    shade: 0.01,
                    anim: 4 //动画类型
                });
                flag = false;
                return false;
            }
        });
        return flag;
    }


    return {
        /**
         * 初始化
         */
        init: function () {
            initTableDatas(1);
            initMemberShimobunTable2();
        },
        /**
         * 右边表格删除事件
         */
        removeTable2Row :function(rowId){
            var row = table2.bootstrapTable('getRowByUniqueId', rowId.toString());
            var ids = new Array();
            ids.push(rowId.toString());
            table2.bootstrapTable('remove', {
                field: 'id',
                values: ids
            });
            table1.bootstrapTable('insertRow', {
                index: 1,
                row:row
            });
        },

        /**
         * 设置table1的下注值
         * @param rowId
         * @param v
         * @param index
         */
        setTable1RowJson:function(rowId,v,index){
            var row = table1.bootstrapTable('getRowByUniqueId', rowId);
            if(row != null){
                var inputValue = $.trim($(v).val());
                row.bottomPour = inputValue;
                row.tmp = 1;
                //更新当前行数据
                table1.bootstrapTable('updateRow', {index: index, row: row});
            }
        },

        /**
         * 点击“庄”向右边表格插入行
         * @param rowId
         */
        insertTable2Row :function(rowId,v){
            if(checkIsExistmakers()){
                var row = table1.bootstrapTable('getRowByUniqueId', rowId);
                row.mantissa=99999999;
                row.banker = v;
                row.bankerText = v;
                row.bottomPour = 0;
                table2.bootstrapTable('insertRow', {
                    index: 1,
                    row:row
                });
                removeTable1Row(rowId);
            }

        },
        /**
         * 输入“下注值”向右边表格中插入行数据
         * @param rowId
         */
        insertTable2RowData:function(rowId,obj) {
            var flag = true;
            var row = table1.bootstrapTable('getRowByUniqueId', rowId.toString());
            var shimobun = $(obj).val();
            var inputValue = $.trim(shimobun);
            if (inputValue == '') {
                flag = false;
                //parent.layer.msg("请填写下注值!", {icon: 5,offset:['30%' , '30%']});
            }else{
                var patrn = /^\+?[1-9][0-9]*$/;
                var str = $.trim(inputValue);
                if (!patrn.exec(str)){
                    flag = false;
                    parent.layer.msg(row.memberName+"的下注值必须大于0.", {icon: 5,offset:['35%' , '39%']});
                }
            }
            if(flag){
                row.bottomPour = inputValue;
                row.mantissa=99999999;
                row.banker=2;
                row.bankerTest=2;
                //将下注后的用户移植到右边表格中显示
                table2.bootstrapTable('insertRow', {
                    index: 1,
                    row:row
                });
                //移除当前行
                removeTable1Row(row.id);

                $('.bottomPour').bind("contextmenu",
                    function(){
                        return false;
                    }
                );
            }
        },
        /**
         * 验证右边表格的尾数值
         * @param rowId
         */
        validTable2Mantissa:function(rowId,obj,index) {
            var flag = true;
            var row = table2.bootstrapTable('getRowByUniqueId', rowId.toString());
            var mantissa = $(obj).val();
            var inputValue = $.trim(mantissa);
            if (inputValue == '') {
                flag = false;
            }else{
                var patrn = /^[0-9]$/;
                var str = $.trim(inputValue);
                if (!patrn.exec(str)){
                    flag = false;
                    parent.layer.msg(row.memberName+"的尾数值只能填写0~9之间的整数..", {icon: 5,offset:['35%' , '75%']});
                }
            }
            if(flag){
                row.mantissa = inputValue;
                //更新当前行数据
                table2.bootstrapTable('updateRow', {index: index, row: row});
            }
        }
    };
}();

jQuery(document).ready(function() {
    MemberShimobunList.init();
});