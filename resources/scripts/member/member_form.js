var MemberForm  = function () {
    var basicUrl = commonUtil.httpUrl;
    var basicForm = $("#memberForm");
    var  params = commonUtil.getUrlParams("params");

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

                memberName: {
                    required: true
                },
                source: {
                    required: true
                }
            },

            messages: {

                memberName: {
                    required: "请填写会员名称."
                },
                memberBalance: {
                    required: "请填写会员余额."
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit
                //$('.alert-danger', $('.login-form')).show();
            },

            highlight: function (element) { // hightlight error inputs

                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function (error, element) {
                error.insertAfter(element.closest('.input-icon'));
            }


        });
    }

    /**
     * 保存数据
     */
    var submitForm = function(){
        commonUtil.inputTrim();
        var  layerIframeIndex = commonUtil.layerIframeIndex();

        commonUtil.setIframeHeight(layerIframeIndex,"350px");


        parent.layer.iframeAuto(layerIframeIndex);
        if (basicForm.validate().form()) {
            var typeMOde = "POST";
            var id = $("#id").val();
            if(id != null && id != ""){
                typeMOde = "PUT";
            }
           $.ajax({
                url: basicUrl+ "/userController/addOrUpUser",
                data:$("#addRoleForm").serialize(),
                type:typeMOde,
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


                        layer.msg('保存会员信息成功.', {icon: 1});

                        commonUtil.closeForm();

                    }else{
                        layer.alert(data.message, {
                            skin: 'layui-layer-lan',
                            closeBtn: 1,
                            shade: 0.01,
                            anim: 4 //动画类型
                        });
                    }
                },
                error:function (XMLHttpRequest, textStatus, errorThrown) {
                    layer.alert('网络出现错误!', {
                        skin: 'layui-layer-lan',
                        closeBtn: 1,
                        shade: 0.01,
                        anim: 4 //动画类型
                    });
                }
            });


        }

    }



    return {
        init: function () {
            validateForm();
            commonUtil.setFormValues(params,"",basicForm)
        }
    };
}();

jQuery(document).ready(function() {
    MemberForm.init();
});