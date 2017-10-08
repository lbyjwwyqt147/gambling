var SystemSettingsForm  = function () {
    var basicUrl = commonUtil.httpUrl;
    var basicForm = $("#rakeForm");

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
                cut: {
                    required: true
                },
                password:{
                    required:true
                }
               /* directCommission: {
                    required: true
                },
                indirectRecommendation: {
                    required: true
                },
                commissionSeries: {
                    required: true
                }*/
            },

            messages: {
                cut: {
                    required: "请填写抽成比例."
                },
                password:{
                    required:"请填写系统密码."
                }
                /*directCommission: {
                    required: "请填写直接推荐提成."
                },
                indirectRecommendation: {
                    required: "请填写间接推荐提成."
                },
                commissionSeries:{
                    required: "请填写提成级数."
                }*/
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
        if (basicForm.validate().form()) {
            var params = new Array();
            var cutObj = {
                key:"cut",
                value:$("#cut").val(),
                type:"1",
                id:$("cutid").val()
            };
            var pwdObj = {
                key:"password",
                value:$("#password").val(),
                type:"1",
                id:$("pwdid").val()
            };
            params.push(cutObj);
            params.push(pwdObj);
             $.ajax({
                 url: basicUrl+ "/systemController/saveList",
                 data:{
                     params:JSON.stringify(params)
                 },
                 type:"POST",
                 dataType:"json",
                 xhrFields: {
                     withCredentials: true
                 },
                 crossDomain: true,
                 success :function (data,textStatus) {
                     var jsonObj = commonUtil.stringToJson(data);
                     if(jsonObj.status == 0){
                         layer.msg('保存系统设置信息成功.', {icon: 1});
                     }else{
                        /* layer.alert(data.message, {
                             skin: 'layui-layer-lan',
                             closeBtn: 1,
                             shade: 0.01,
                             anim: 4 //动画类型
                         });*/
                         layer.msg(jsonObj.message, {icon: 5});

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
     * 设置form数据
     */
    var setFormValue = function () {
        $.ajax({
            url: basicUrl+ "/systemController/getAllValue",
            type:"POST",
            dataType:"json",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success :function (data,textStatus) {
                console.log(data);
                var jsonObj = commonUtil.stringToJson(data);
                if(jsonObj.status == 0){
                    $.each(jsonObj.datas,function (i,v) {
                        if(v.key == "cut"){
                            $("input[name='cut']").val(v.value);
                            $("input[name='cutid']").val(v.id);
                        }else if (v.key == "password"){
                            $("input[name='password']").val(v.value);
                            $("input[name='pwdid']").val(v.value);
                        }
                    });
                }else{
                  /*  layer.alert(jsonObj.message, {
                        skin: 'layui-layer-lan',
                        closeBtn: 1,
                        shade: 0.01,
                        anim: 4 //动画类型
                    });*/
                    layer.msg(jsonObj.message, {icon: 5});
                }
            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {
                /*layer.alert('网络出现错误!', {
                    skin: 'layui-layer-lan',
                    closeBtn: 1,
                    shade: 0.01,
                    anim: 4 //动画类型
                });*/
                layer.msg("网络错误!", {icon: 5});
            }
        });
    }

    return {
        init: function () {
            validateForm();
            setFormValue();
        }
    };
}();

jQuery(document).ready(function() {
    SystemSettingsForm.init();
});