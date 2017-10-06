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
                    userName: {
	                    required: true
	                },
                    userPwd: {
	                    required: true
	                },
	                remember: {
	                    required: false
	                }
	            },

	            messages: {
                    userName: {
	                    required: "请输入用户名."
	                },
                    userPwd: {
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
                    /*$.ajax({
                        url: commonUtil.httpUrl + "/users/logins",
                        data: $(".login-form").serialize(),
                        type: "POST",
                        dataType: "json",
                        success: function (data, textStatus) {
                            console.log(data);
                            if(data.status == 0){
                            	var obj = data.data;
                            	console.log(obj);
                                commonUtil.setSeesionId(obj.SESSION);
                                commonUtil.setToken(obj.token);
                            	document.cookie="SESSION="+obj.SESSION;
                                $.cookie('SESSION', obj.SESSION);
                                $.cookie('token', obj.token);
                            	console.log("登录成功..........");


                                console.log("cookie sessionId : "+ $.cookie('SESSION'));
                                console.log("cookie token: "+ $.cookie('token'));

                               // window.location.href = "resources/pages/index.html?SESSION="+obj.SESSION+"&TOKEN="+obj.token;
                                window.location.href = "resources/pages/index.html";
                            }else{
                                layer.alert(data.msg, {
                                    skin: 'layui-layer-lan',
                                    closeBtn: 1,
                                    anim: 4 //动画类型
                                });
							}
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            layer.alert('网络出现错误!', {
                                skin: 'layui-layer-lan',
                                closeBtn: 1,
                                anim: 4 //动画类型
                            });
                        }
                    });*/

                    window.location.href = "resources/pages/home.html";

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



	var handleForgetPassword = function () {
		$('.forget-form').validate({
	            errorElement: 'span', //default input error message container
	            errorClass: 'help-block', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            ignore: "",
	            rules: {
	                email: {
	                    required: true,
	                    email: true
	                }
	            },

	            messages: {
	                email: {
	                    required: "Email is required."
	                }
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit   

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

	            submitHandler: function (form) {
	                form.submit();
	            }
	        });

	        $('.forget-form input').keypress(function (e) {
	            if (e.which == 13) {
	                if ($('.forget-form').validate().form()) {
	                    $('.forget-form').submit();
	                }
	                return false;
	            }
	        });

	        jQuery('#forget-password').click(function () {
	            jQuery('.login-form').hide();
	            jQuery('.forget-form').show();
	        });

	        jQuery('#back-btn').click(function () {
	            jQuery('.login-form').show();
	            jQuery('.forget-form').hide();
	        });

	}

    /**
	 * 注册
     */
	var handleRegister = function () {

         $('.register-form').validate({
	            errorElement: 'span', //default input error message container
	            errorClass: 'help-block', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            ignore: "",
	            rules: {

                    userNickname: {
	                    required: true
	                },
                    userEmail: {
	                    required: true,
	                    email: true
	                },
                    userName: {
	                    required: true
	                },
                    userPwd: {
	                    required: true
	                },
	                rpassword: {
	                    equalTo: "#register_password"
	                },
	                tnc: {
	                    required: true
	                }
	            },

	            messages: { // custom messages for radio buttons and checkboxes
                    userNickname: {
                        required: "请输入昵称."
                    },
                    userEmail: {
                        required: "请输入邮箱."
                    },
                    userName: {
                        required: "请输入用户名."
                    },
                    userPwd: {
                        required: "请输入密码."
                    },
                    rpassword: {
                        equalTo: "确认密码不一致."
                    },
	                tnc: {
	                    required: "请接受服务条款和隐私政策."
	                }
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit   

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
	                if (element.attr("name") == "tnc") { // insert checkbox errors after the container                  
	                    error.insertAfter($('#register_tnc_error'));
	                } else if (element.closest('.input-icon').size() === 1) {
	                    error.insertAfter(element.closest('.input-icon'));
	                } else {
	                	error.insertAfter(element);
	                }
	            },
	        });

			$('.register-form input').keypress(function (e) {
	            if (e.which == 13) {
	                if ($('.register-form').validate().form()) {
                        registerSubmit();
	                }
	                return false;
	            }
	        });

	        jQuery('#register-btn').click(function () {
                jQuery('.login-form').hide();
                jQuery('.register-form').show();
	        });

	        //注册事件
			jQuery('#register-submit-btn').click(function () {
                registerSubmit();
            });


	        jQuery('#register-back-btn').click(function () {
	            jQuery('.login-form').show();
	            jQuery('.register-form').hide();
	        });

	        //注册
	        function registerSubmit(){
                commonUtil.inputTrim();
                if($('.register-form').validate().form()){
                    $.ajax({
                        url: commonUtil.httpUrl + "/users/signins",
                        data:$(".register-form").serialize(),
                        type:"POST",
                        dataType:"json",
                        success :function (data,textStatus) {
                            console.log(data);
                            $(".register-form")[0].reset();
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
			}
	}
    
    return {
        //main function to initiate the module
        init: function () {
        	
            handleLogin();
            handleForgetPassword();
            handleRegister();    

            // init background slide images
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