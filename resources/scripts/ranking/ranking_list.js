var RankingList  = function () {
    var basicUrl = commonUtil.httpUrl;
    var  gridTable = $('#ranking-table');
    var  memberId = commonUtil.getUrlParams("p");

    /**
     * 初始化排行榜表格数据
     */
    var initTableDatas = function (sign) {
        gridTable.bootstrapTable('showLoading');
        $.ajax({
            url: basicUrl+ "/userController/getUserByMoney",
            data:{
                identity:memberId
            },
            type:"GET",
            dataType:"text",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success :function (data,textStatus) {
                var jsonObj = commonUtil.stringToJson(data);
                if(jsonObj.status == 0){
                    initRankingTable(jsonObj.datas);
                    gridTable.bootstrapTable('hideLoading');
                    //parentIframeAuto();
                    setTimeout(function () {
                        generateImage();
                    }, 500);
                }else if(jsonObj.status == -1){
                    commonUtil.anewLoginLayer();
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
                    sortable: false
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
                    sortable: false

                }]
        });
    }

    /**
     * 生成图片
     */
    function generateImage() {
        console.log("..开始执行生成图片.............");
        var w = $("#infoContent").width();
        var h = $("#infoContent").height();

        //要将 canvas 的宽高设置成容器宽高的 2 倍
        var canvas = document.createElement("canvas");
        canvas.width = w * 2;
        canvas.height = h * 2-49;
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        var context = canvas.getContext("2d");
        //然后将画布缩放，将图像放大两倍画到画布上
        context.scale(2,2);

        html2canvas(document.querySelector("#infoContent"), {
            canvas: canvas,
            onrendered: function(canvas) {
                $("#infoContent").children('.green-sharp').remove();
                document.getElementById("infoContent").appendChild(canvas);
               // parentIframeAuto();
            }
        });
    }

    /**
     * 窗口自适应
     */
    function parentIframeAuto() {
        var  layerIframeIndex = commonUtil.layerIframeIndex();
        parent.layer.iframeAuto(layerIframeIndex);
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