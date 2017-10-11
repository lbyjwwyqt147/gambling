var Login = function () {
    /**
	 * 登录
     */
	var handleLogin = function() {
		//验证登录
		$('.login-form').validate({
	            errorElement: 'span', //default input error message container
	            errorClass: 'help-block', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            rules: {
                    /*userName: {
	                    required: true
	                },*/
                    password: {
	                    required: true
	                },
	                remember: {
	                    required: false
	                }
	            },

	            messages: {
                    /*userName: {
	                    required: "请输入用户名."
	                },*/
                    password: {
	                    required: "请输入密码."
	                }
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit   
	                $('.alert-danger', $('.login-form')).show();
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
	            },


	        });

		    //开始登录
		    function startLogin() {
				commonUtil.inputTrim();
                if ($('.login-form').validate().form()) {
                	/*var pwd = $("#password").val();
                    var hash = md5(pwd);
                    $("#password").val(hash);*/
                    $.ajax({
                        url: commonUtil.httpUrl + "/systemController/login",
                        data: $(".login-form").serialize(),
                        type: "POST",
                        dataType: "json",
                        success: function (data, textStatus) {
                        	var jsonObj = commonUtil.stringToJson(data);
                            if(jsonObj.status == 0){
                            	console.log("登录成功..........");
                               // window.location.href = "resources/pages/home.html";
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
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
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

	        $('.login-form input').keypress(function (e) {
	            if (e.which == 13) {
					startLogin();
	                return false;
	            }
	        });

          jQuery('#login-btn').click(function () {
              startLogin();
           });

	}




    
    return {
        init: function () {
            handleLogin();
		    $.backstretch([
		        "assets/pages/media/bg/1.jpg",
		        "assets/pages/media/bg/2.jpg",
		        "assets/pages/media/bg/3.jpg",
		        "assets/pages/media/bg/4.jpg"
		        ], {
		          fade: 1000,
		          duration: 8000
		    	}
        	);
        }
    };

}();

jQuery(document).ready(function() {
    Login.init();
});