var MemberForm  = function () {
    var basicUrl = commonUtil.httpUrl;
    var basicForm = $("#memberForm");
    var  params = commonUtil.getUrlParams("params");
    var memberId = commonUtil.getUrlParams("p");

    /**
     * 关闭事件
     */
    $('#close-button').on('click', function(){
        commonUtil.closeForm();
    });

    /**
     * 保存数据
     */
    $('#save-button').on('click', function(){
        submitForm();
    });

    /**
     * 验证表单
     */
    var validateForm = function () {
        basicForm.validate({
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: false,
            rules: {

                name: {
                    required: true,
                    maxlength:25
                },
                source: {
                    required: true
                }
            },

            messages: {

                name: {
                    required: "请填写会员名称."
                },
                source: {
                    required: "请填写会员积分余额."
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit
                //$('.alert-danger', $('.login-form')).show();
            },

            highlight: function (element) { // hightlight error inputs

                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
                parentIframeAuto();
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
                parentIframeAuto();
            },

            errorPlacement: function (error, element) {
                error.insertAfter(element.closest('.input-icon'));
                parentIframeAuto();
            }


        });
    }

    /**
     * 保存数据
     */
    var submitForm = function(){
        commonUtil.inputTrim();
        if (basicForm.validate().form()) {
           $("#identity").val(memberId);
           $.ajax({
                url: basicUrl+ "/userController/addOrUpUser",
                data:$("#memberForm").serialize(),
                type:"POST",
                dataType:"json",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success :function (data,textStatus) {
                    var jsonObj = commonUtil.stringToJson(data);
                    if(jsonObj.status == 0){
                        layer.msg('保存会员信息成功.',
                            {
                                icon: 1,
                                end:function () {
                                   commonUtil.closeForm();
                                 }
                            });
                        //刷新父页面表格数据
                        window.parent.queryData(2);
                    }else if(jsonObj.status == -1){
                        commonUtil.anewLoginLayer();
                    }else{
                        var msg = jsonObj.message;
                        if(msg.indexOf("抽水") == -1){
                            layer.msg(msg, {icon: 5});
                        }
                       /* layer.alert(jsonObj.message, {
                            skin: 'layui-layer-lan',
                            closeBtn: 1,
                            shade: 0.01,
                            anim: 4 //动画类型
                        });*/

                    }
                },
                error:function (XMLHttpRequest, textStatus, errorThrown) {
                    /*layer.alert('网络出现错误!', {
                        skin: 'layui-layer-lan',
                        closeBtn: 1,
                        shade: 0.01,
                        anim: 4 //动画类型
                    });*/
                    layer.msg('网络出现错误!', {icon: 5});

                }
            });


        }

    }

    /**
     * 窗口自适应
     */
    function parentIframeAuto() {
        var  layerIframeIndex = commonUtil.layerIframeIndex();
        parent.layer.iframeAuto(layerIframeIndex);
    }

    /**
     * 初始化Form 值
     */
    function setFormValues() {
        if (params != null && params.trim() != ""){
            params = params.replace(/'/g, '"');
            var jsonValue = JSON.parse(params);
            // id
            $("input[name='userId']").val(jsonValue.id);
            // 编号
            $("input[name='memberCode']").val(jsonValue.memberCode);
            // 会员名称
            $("input[name='name']").val(jsonValue.memberName);
            // 会员积分余额
            $("input[name='source']").val(jsonValue.memberBalance);
            // 会员抽水
            $("input[name='cutSourceSum']").val(jsonValue.rake);
            $("input[name='bankerRebate']").val(jsonValue.bankerRebate);

            $("#rake-input").show();
            $("#bankerRebate-input").show();

        }
    }

    return {
        init: function () {
            validateForm();
            setFormValues();
        }
    };
}();

jQuery(document).ready(function() {
    MemberForm.init();
});