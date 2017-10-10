var RankingList  = function () {
    var basicUrl = commonUtil.httpUrl;
    var  gridTable = $('#ranking-table');

    /**
     * 初始化排行榜表格数据
     */
    var initTableDatas = function (sign) {
        gridTable.bootstrapTable('showLoading');
        $.ajax({
            url: basicUrl+ "/userController/getUserByMoney",
            type:"GET",
            dataType:"json",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success :function (data,textStatus) {
                var jsonObj = commonUtil.stringToJson(data);
                if(jsonObj.status == 0){
                    initRankingTable(jsonObj.datas.dataGrid);
                    gridTable.bootstrapTable('hideLoading');
                }else{
                    layer.msg(jsonObj.message, {icon: 5});
                }
            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {
                layer.msg("网络错误!", {icon: 5});
            }
        });
    }




    /**
     * 初始化Table
     * @param listData
     */
    var initRankingTable = function(listData){
        //先销毁表格
        gridTable.bootstrapTable('destroy');
        //初始化表格,动态从服务器加载数据
        gridTable.bootstrapTable({
            method: 'GET',
            dataType: 'json',
            contentType: "application/x-www-form-urlencoded",
            data:listData,
            cache: false,
            clickToSelect:true,                         //是否启动点击选中行
            striped: true,                              //是否显示行间隔色
            sidePagination: "client",                  //分页方式：client客户端分页，server服务端分页（*）
            width: $(window).width(),
            showColumns: false,                        //是否显示列
            pagination: false,                         //是否显示分页
            minimumCountColumns: 2,
            pageNumber: 1,                       //初始化加载第一页，默认第一页
            pageSize: 100000,                       //每页的记录行数（*）
            pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
            columns: [
                {
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
     * 生成图片
     */
    function generateImage() {
        console.log("..开始执行生成图片.............");
        html2canvas(document.getElementById("infoContent"),{
            allowTaint: true,
            taintTest: false,
            onrendered: function(canvas){
                $("#infoContent").children('.green-sharp').remove();

                document.getElementById("infoContent").appendChild(canvas);
            },
            width: $("#infoContent").width()+14,
            height: $("#infoContent").height()-22
        });
    }

    return {
        init: function () {
            initTableDatas(0);
        }
    };
}();

jQuery(document).ready(function() {
    RankingList.init();
});