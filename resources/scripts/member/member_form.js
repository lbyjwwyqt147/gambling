var MemberForm  = function () {
    var basicUrl = commonUtil.httpUrl;

    $('#close-button').on('click', function(){
        closeForm();
    });


/*    function submitForm() {
        commonUtil.inputTrim();
        $.ajax({
            url: basicUrl+ "/roles",
            data:$("#addRoleForm").serialize(),
            type:"POST",
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
                if(data.status == 0){

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
    }*/

/*
    $('#save-button').on('click', function(){
        submitForm();
    });*/

    /**
     * 关闭窗口
     */
    var closeForm = function () {
        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
        parent.layer.close(index);
    }

    return {
        init: function () {



        }
    };
}();

jQuery(document).ready(function() {
    MemberForm.init();
});