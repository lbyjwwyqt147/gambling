var MemberShimobunCalculateList  = function () {
    var basicUrl = commonUtil.httpUrl;
    var gridTable = $('#member-shimobun-calculate-table-pagination');
    var jsonParams = commonUtil.getUrlParams("params");
    var luckNumber = commonUtil.getUrlParams("luckNumber");
    var finalNumber = 0;
    var memberId = commonUtil.getUrlParams("p");

    /**
     * 获取幸运数字
     */
    var getLuckyData = function () {
        $.ajax({
            url: basicUrl+ "/collectPointController/lastSomeNumber",
            type:"GET",
            data:{
                identity:memberId
            },
            dataType:"json",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success :function (data,textStatus) {
                //console.log(data);
                var  jsonObj = commonUtil.stringToJson(data);
                if(jsonObj.status == 0){
                    var goodFortuneHtml = $("#goodFortune");
                    var datas = jsonObj.datas;
                    if(datas.length > 0){
                        var goodFortuneContent = "";
                       $.each(datas,function (i,v) {
                           goodFortuneContent += '<div class=\"col-md-1 mt-step-col first done\">\n' +
                                                      '<div class=\"mt-step-number bg-white\">\n' +
                                                      datas[i] +
                                                      '</div>\n' +
                                                        '\n' +
                                                    '</div>'
                       })
                        goodFortuneHtml.html(goodFortuneContent);
                    };



                }else if(jsonObj.status == -1){
                    commonUtil.anewLoginLayer();
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
                luckNumber:luckNumber,
                identity:memberId
            },
            type:"POST",
            dataType:"json",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success :function (data,textStatus) {
               // console.log(data);
                var  jsonObj = commonUtil.stringToJson(data);
                if(jsonObj.status == 0){
                    var datas = jsonObj.datas;
                    //庄家昵称
                    $("#makersName").html(datas.banker.name);
                    //庄家输赢
                    $("#bankerWin").html(datas.banker.bunko);
                    //庄家下注分数
                   // $("#makersInSource").html(datas.banker.inSource);
                    //庄家下注尾数
                    $("#makersInNumber").html(datas.banker.inNumber);
                    //庄家上局积分
                    $("#makersLastSource").html(datas.banker.lastSource);
                    //庄家本局积分
                    $("#makersSource").html(datas.banker.source);
                    finalNumber = datas.banker.finalNumber;
                    //庄家点数
                    $("#makersFinalNumber").html(finalNumber);
                    //庄家输多少家
                    $("#makersLoseNumber").html(datas.banker.losePeoples);
                    //庄家赢多少家
                    $("#makersWinNumber").html(datas.banker.winPeoples);
                    //庄家和多少家
                    $("#makersHarmoniousNumber").html(datas.banker.drawPeoples);

                   initMemberShimobunCalculateTable(datas.users);
                   //parentIframeAuto();
                   setTimeout(function () {
                        generateImage();
                    }, 500);
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
     * 初始化坐标表格
     * @param listData
     */
    var initMemberShimobunCalculateTable = function(listData){
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
            //height: $(window).height(),
            width: $(window).width(),
            showColumns: false,                        //是否显示列
            pagination: false,
            minimumCountColumns: 2,
            pageNumber: 1,                       //初始化加载第一页，默认第一页
            pageSize: 100000,                       //每页的记录行数（*）
            pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
            showExport: true,
            exportDataType: 'all',
            columns: [
                {
                    field: 'userId',
                    title: '编号',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    width:'11%'
                }, {
                    field: 'name',
                    title: '闲家昵称',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    //width:'11%'
                },
                {
                    field: 'inSource',
                    title: '下注分数',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    width:'11%'
                },
                {
                    field: 'inNumber',
                    title: '尾数',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    width:'7%'
                },
                {
                    field: 'finalNumber',
                    title: '点数',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    width:'11%'
                },

                {
                    field: 'lastSource',
                    title: '上局剩余积分',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    width:'11%'
                },
                {
                    field: 'source',
                    title: '本局剩余积分',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    width:'11%'
                },
                {
                    field: 'bunko',
                    title: '本局盈亏',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    width:'11%'
                },
                {
                    field: 'bunko',
                    title: '本局输赢',
                    align: 'center',
                    valign: 'middle',
                    sortable: false,
                    width:'8%',
                    formatter: function (value, row, index) {
                        var e = '<a href="javascript:;" class="btn btn-circle btn-sm grey-cascade" style="font-size: 14px;"> 输</a> ';
                        //if(row.finalNumber > finalNumber){
                        if(value > 0){
                            e = '<a href="javascript:;" class="btn btn-circle btn-sm green-meadow" style="font-size: 14px;"> 赢</a> ';
                        }else if(value == 0) {
                            e = '<a href="javascript:;" class="btn btn-circle btn-sm purple-plum" style="font-size: 14px;"> 合</a> ';
                        }
                        return e;
                    }
                }]
        });


    }


    /**
     * 生成图片
     */
    function generateImage() {
        console.log("..开始执行生成图片.............");
      /*  html2canvas(document.getElementById("infoContent"),{
            allowTaint: true,
            taintTest: false,
            onrendered: function(canvas){
               // var imagedData = canvas.toDataURL("image/jpg");
                $("#infoContent").children('.green-sharp').remove();
               // var imageHtml = '<img src="'+imagedData+'">';
                document.getElementById("infoContent").appendChild(canvas);
            },
            width: $("#infoContent").width()+14,
            height: $("#infoContent").height()-22
        });*/


        var w = $("#infoContent").width();
        var h = $("#infoContent").height();

        var sw = 0;
        var sh = 0;
        //判断是否存在滚动条
        $("body").scrollTop(10);//控制滚动条下移10px
        if( $("body").scrollTop() > 0 ){
            sw = 34;
            sh = 30;
        }else{

        }
        $("body").scrollTop(0);//滚动条返回顶部

        //要将 canvas 的宽高设置成容器宽高的 2 倍
        var canvas = document.createElement("canvas");
        canvas.width = w * 2+sw;
        canvas.height = h * 2-49-sh;
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
                //parentIframeAuto();
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