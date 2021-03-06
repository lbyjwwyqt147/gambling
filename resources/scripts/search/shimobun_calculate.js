var MemberShimobunCalculateList  = function () {
    var basicUrl = commonUtil.httpUrl;
    var gridTable = $('#member-shimobun-calculate-table-pagination');
    var jsonParams = commonUtil.getUrlParams("params");
    var luckNumber = commonUtil.getUrlParams("luckNumber");

    /**
     * 获取幸运数字
     */
    var getLuckyData = function () {
        $.ajax({
            url: basicUrl+ "/collectPointController/lastSomeNumber",
            type:"GET",
            dataType:"json",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success :function (data,textStatus) {
                var  jsonObj = commonUtil.stringToJson(data);
                if(jsonObj.status == 0){
                    var goodFortuneHtml = $("#goodFortune");
                    var datas = jsonObj.datas;
                    if(datas.length > 0){
                        var goodFortuneContent = "";
                       $.each(datas,function (i,v) {
                           goodFortuneContent += '<div class=\"col-md-2 mt-step-col first done\">\n' +
                                                      '<div class=\"mt-step-number bg-white\">\n' +
                                                      datas[i] +
                                                      '</div>\n' +
                                                        '\n' +
                                                    '</div>'
                       })
                        goodFortuneHtml.html(goodFortuneContent);
                    };



                }else{
                   /* layer.alert(data.msg, {
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
     * 初始化表格数据
     */
    var initTableDatas = function () {
        gridTable.bootstrapTable('showLoading');
        $.ajax({
            url: basicUrl+ "/collectPointController/openResult",
            data:{
                params:jsonParams,
                luckNumber:luckNumber
            },
            type:"GET",
            dataType:"json",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success :function (data,textStatus) {
                console.log(data);
                var  jsonObj = commonUtil.stringToJson(data);
                if(jsonObj.status == 0){
                    var datas = jsonObj.datas;
                    //庄家输赢
                    $("#bankerWin").html(datas.bankerBunko);
                    //庄家提成额


                  //  initMemberShimobunCalculateTable(jsonObj.datas.)
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
     * 初始化坐标表格
     * @param listData
     */
    var initMemberShimobunCalculateTable = function(listData){
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
            //height: $(window).height(),
            width: $(window).width(),
            showColumns: false,                        //是否显示列
            pagination: false,
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
                /*   {
                       field: '',
                       title: '序号',
                       formatter: function (value, row, index) {
                           return index + 1;
                       },
                       class:''
                   },*/
                {
                    field: 'userId',
                    title: '编号',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                }, {
                    field: 'memberName',
                    title: '玩家昵称',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                },
                {
                    field: 'bottomPour',
                    title: '下注',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                },
                {
                    field: 'mantissa',
                    title: '尾数',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                },
                {
                    field: 'dotPerInch',
                    title: '点数',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                },
                {
                    field: 'bunko',
                    title: '本局输赢',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                },
                {
                    field: 'lastSource',
                    title: '上局积分',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                },
                {
                    field: 'source',
                    title: '剩余积分',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                }]
        });

        /**
         * 数据加载完成
         */
        gridTable.on('load-success.bs.table',function(data){
            console.log("load success");
            generateImage();
        });



        setTimeout(function () {
            generateImage();
        }, 5000);


    }


    /**
     * 生成图片
     */
    function generateImage() {
        console.log("..开始执行生成图片.............");
        html2canvas(document.body).then(function(canvas) {
            $(".page-container").remove();
            document.body.appendChild(canvas);
            //document.body.innerHTML=canvas;
           // $(body).innerHTML(canvas);
        });
    }

    return {
        /**
         * 初始化
         */
        init: function () {
            initTableDatas();
            getLuckyData();
        },

    };
}();

jQuery(document).ready(function() {
    MemberShimobunCalculateList.init();
});