var Menus  = function () {
    var basicUrl = commonUtil.httpUrl;
    var  pid = "";
    var  treeData = [];
    var layerIndex = 0;
    var token = commonUtil.getToken();
    token = token != null ? token : "";
    var sessionId = commonUtil.getSessionId();
    var getTreeData = function (pid) {

        console.log("sessionId: " + sessionId);
        console.log("token: " + token);

         $('#menus_tree').data('jstree',false);
        $.ajax({
            url: basicUrl+ "/resourceMenus/tree1",
            data:{
                "pid":pid == "" ? "1" : pid
            },
            type:"GET",
            dataType:"json",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", token);
            },
            success :function (data,textStatus) {
                console.log(data);
              //  treeData.push(data.data);
              //  console.log(treeData);
                if(data.status == 0){
                    initMenusTree(data.data);
                }else{
                    layer.alert(data.msg, {
                        skin: 'layui-layer-lan',
                        closeBtn: 1,
                        anim: 4 //动画类型
                    });
                }

               /* $('#menus_tree').data('jstree',false).empty().jstree({'core': {'data': data
                }
                });*/
            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {
                layer.alert('网络出现错误!', {
                    skin: 'layui-layer-lan',
                    closeBtn: 1,
                    anim: 4 //动画类型
                });
            }
        });
    }

    //初始化菜单树
    var initMenusTree = function (treeData) {


      /*  $('#menus_tree').on('changed.jstree',function (node,data){
            var nodeId = data.instance.get_node(data.selected[0]).id;//获取IDClickMenuTree(id);
            console.log("选中节点ID："+nodeId);
        });
        $('#menus_tree').on('loaded.jstree', function (e, data) {
            data.instance.open_all();//默认展开所有节点
            getTreeData();
        })
*/


        $('#menus_tree').jstree("destroy");




        //getTreeData("#");
       $("#menus_tree").jstree({
            "core" : {
                "themes" : {
                    "responsive": false
                },
                // so that create works
                "check_callback" : true,
              /*  'data': [{
                    "text": "Same but with checkboxes",
                    "children": []
                },
                    "And wholerow selection"
                ]*/
               /* 'data' : [
                    { "id" : "ajson1", "parent" : "#", "text" : "Simple root node" },
                    { "id" : "ajson2", "parent" : "#", "text" : "Root node 2" },
                    { "id" : "ajson3", "parent" : "ajson2", "text" : "Child 1" },
                    { "id" : "ajson4", "parent" : "ajson2", "text" : "Child 2" },
                ]*/
               'data':treeData
                /* 'data':  {
                      'url' : function (node) {
                          return basicUrl+'/resourceMenus/tree2';
                      },
                      'data' : function (node) {
                          return { 'pid' : node.id };
                      },
                     'dataFilter':function (data, type) {
                         // 对Ajax返回的原始数据进行预处理
                         var  treeJsonArray = new Array();
                         treeJsonArray.push(data.data);
                         return treeJsonArray  // 返回处理后的数据
                     }
                }*/
            },
            "types" : {
                "default" : {
                    "icon" : "fa fa-folder icon-state-warning icon-lg"
                },
                "file" : {
                    "icon" : "fa fa-file icon-state-warning icon-lg"
                }
            },
            "state" : { "key" : "demo2" },
            "plugins" : [ "state", "types" ]
        }).on('select_node.jstree', function(e,data) {
           var i, j, r = [];
           for(i = 0, j = data.selected.length; i < j; i++) {
               console.log("节点ID：" + data.instance.get_node(data.selected[i]).a_attr.bid);
               r.push(data.instance.get_node(data.selected[i]).a_attr.bid);
           }
           pid = r.join(', ');
           console.log("pid: " + pid);
           initTableData(pid);
       });

    };

    /**
     * table 数据源
     */
    var initTableData = function (pid) {
        $.ajax({
            url: basicUrl+ "/resourceMenus",
            data:{
                "pid":pid
            },
            type:"GET",
            dataType:"json",
            success :function (data,textStatus) {
                console.log(data);
                if(data.status == 0){
                    initMenusTable(data.data);
                }else{
                    layer.alert(data.msg, {
                        skin: 'layui-layer-lan',
                        closeBtn: 1,
                        anim: 4 //动画类型
                    });
                }

            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {
                layer.alert('网络出现错误!', {
                    skin: 'layui-layer-lan',
                    closeBtn: 1,
                    anim: 4 //动画类型
                });
            }
        });
    }

    //初始化表格
    var initMenusTable = function(data){
        //先销毁表格
        $('#menus-table-pagination').bootstrapTable('destroy');
        //初始化表格,动态从服务器加载数据
        $("#menus-table-pagination").bootstrapTable({
            //method: "get",  //使用get请求到服务器获取数据
            //url:basicUrl+"/resourceMenus" , //获取数据的Servlet地址
            data:data,
            striped: true,  //表格显示条纹
            pagination: true, //启动分页
            pageSize: 20,  //每页显示的记录数
            pageNumber:1, //当前第几页
            pageList: [5, 10, 15, 20, 25],  //记录数可选列表
            search: false,  //是否启用查询
            showColumns: false,  //显示下拉框勾选要显示的列
            showRefresh: false,  //显示刷新按钮
            sidePagination: "server", //表示服务端请求
            //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder
            //设置为limit可以获取limit, offset, search, sort, order
            queryParamsType : "undefined",
            queryParams: function queryParams(params) {   //设置查询参数
                var param = {
                    pageNumber: params.pageNumber,
                    pageSize: params.pageSize,
                    orderNum : $("#orderNum").val()
                };
                return param;
            },
            onLoadSuccess: function(){  //加载成功时执行
                alert("加载成功");
            },
            onLoadError: function(){  //加载失败时执行
                alert("加载数据失败");
            }
        });
    }

    /**
     * 树选择节点
     */
    function treeSelect() {
       /* $('#menus_tree')
            .on('changed.jstree', function (e, data) {
                var i, j, r = [];
                for(i = 0, j = data.selected.length; i < j; i++) {
                    console.log(data.instance.get_node(data.selected[i]));
                    r.push(data.instance.get_node(data.selected[i]).id);
                }
                pid = r.join(', ');
            }).jstree();*/

        $('#menus_tree').on('select_node.jstree', function(e,data) {
            var i, j, r = [];
            for(i = 0, j = data.selected.length; i < j; i++) {
                console.log("节点ID：" + data.instance.get_node(data.selected[i]).a_attr.bid);
                r.push(data.instance.get_node(data.selected[i]).a_attr.bid);
            }
            pid = r.join(', ');

        }).jstree();

        if(pid == ""){
            layer.open({
                title: '提示',
                content: '请选择节点作为父级节点'
            });
        }
    }

    /**
     * 添加事件
     */
    $('#openAddMenusForm').on('click', function(){
        if(pid != ""){
            layerIndex  =  layer.open({
                type: 2,
                title: '资源菜单',
                maxmin: true,
                shadeClose: true, //点击遮罩关闭层
                area : ['63%' , '80%'],
                content: '../../../pages/authority/menus/menus_add.html?pid='+pid,
                end: function () {
                    refurbish();
                }
            });
        }
    });

    $('#reload-tree').on("click",function () {
        refurbish();
    })

    /**
     * 刷新数据
     */
    function refurbish() {
        $("#menus_tree").jstree(true).refresh();
    }

    /**
     * 关闭form
     */
    function  closeForm() {
        layer.close(layerIndex);
    }


    return {
        //main function to initiate the module
        init: function () {
            getTreeData("");
          //  initMenusTable();

        }
    };
}();

jQuery(document).ready(function() {
    Menus.init();
});