/**
 * 登陆页面
 */
var ILogin = {};
ILogin.Index = function () {
	var form = null;
	function _Initialization() {
		$('#btnLogin').unbind().bind('click', _LoginValidate);
		$('#tool-regist-save').unbind().bind('click', _Regist);
		
		form = $('#registForm');
		form.submit(function (e) {
            $(this).ajaxSubmit(options);
            return false;
        });
		
		//登录按下enter提交
		$('#loginForm').find('input').each(function () { 
			$(this).unbind().bind('keypress', function(e){
				var theEvent = e || window.event || arguments.callee.caller.arguments[0]; //兼容IE、FF、Google
		        if (theEvent.keyCode == 13) {
		            window.setTimeout(function () { _LoginValidate(); }, 300); //按下回车后，延迟执行读取数据
		        }
			});
		});
		
		//登录输入框默认内容
		var userIdBox = $('#input-login-userId');
		var pwdBox = $('#input-login-password');
		var pwdBox_show = $('#input-login-password-show');
		var identcodeBox = $('#input-login-identcode');
		userIdBox.val('登录名').css({
				'color': 'gray',
				'font-family': '微软雅黑'
		}).focus(function(){
			if(userIdBox.val() == '登录名'){
				userIdBox.css({'color': 'black'});
				userIdBox.val('');
			}
		}).blur(function(){
			if(userIdBox.val() == ''){
				userIdBox.css({'color': 'gray'});
				userIdBox.val('登录名');
			}
		});
		pwdBox_show.css({'color': 'gray', 'font-family': '微软雅黑'});
		pwdBox_show.val('密码').focus(function(){
			pwdBox_show.hide();
			pwdBox.show().focus();
		});
		pwdBox.blur(function(){
			if(pwdBox.val() == ''){
				pwdBox_show.show();
				pwdBox.hide();
			}
		});

		
		$('#input-regist-userId').blur(function(){
			_CheckUserIdExist();
		});
		

//		
		//老师不需要入学年份
		$('#input-regist-status').combobox({
			onSelect: function(value){
				if(value.text != '学生'){
					$('#label-schoolyear').hide();
					$('#input-regist-schoolYear + .combo').hide();
					$('#input-regist-schoolYear').combobox('select', '');
				}else{
					$('#label-schoolyear').show();
					$('#input-regist-schoolYear + .combo').show();
				}
			}
		});
		
		_SetSchoolYear();
	}
	function _SetSchoolYear(){
		//给入学年份赋值（向前推10年）
		var currentYear = new Date().getFullYear();
		var years = [];
		for(var i = 0; i < 10; i++){
			years.push({ 'id': currentYear - i, 'text': currentYear - i});
		}
		$('#input-regist-schoolYear').combobox({
	        data: years,
	        valueField: 'id',
	        textField: 'text'
	    });
		$('#input-regist-schoolYear').combobox('select', currentYear);
	}
	//登陆验证
	function _LoginValidate(){
    	var login_userId = $('#input-login-userId').val();
    	var login_password = $('#input-login-password').val();
//    	var login_identcode = $('#input-login-identcode').val();
        if (login_userId == '' || login_userId == '登录名') {
            $.messager.alert('系统操作提示', '请输入用户名！', 'info');
            $('#input-login-userId').focus();
            return false;
        }
        if (login_password == '') {
        	$.messager.alert('系统操作提示', '请输入密码！', 'info');
            $('#input-login-password').focus();
            return false;
        }
//        if (login_identcode == '') {
//        	$.messager.alert('系统操作提示', '请输入验证码！', 'info');
//            $('#pic-identcode').focus();
//            return false;
//        }
        $.ajax({
            type: "post",
            url: 'method/User!loginValidate',
            dataType: "json",
//            data: {'userId': login_userId, 'password': login_password, 'identcode': login_identcode},
            data: {'userId': login_userId, 'password': login_password},
            success: function (data) {
            	if(data.action)
            		$('#loginForm').submit();
            	else
            		$.messager.alert('系统操作提示', data.message, 'error');
            }
        });
	}
	
    //注册
    function _Regist(){
    	var userId = $('#input-regist-userId').val();
    	var password = $('#input-regist-password').val();
    	var passwordConfirm = $('#input-regist-passwordConfirm').val();
    	var userName = $('#input-regist-userName').val();
    	var email = $('#input-regist-email').val();
    	
    	//非空验证
    	if(userId == ''){
    		$.messager.alert('系统操作提示', '登录名不能为空！', 'info');
    		return;
    	}
    	if(password == ''){
    		$.messager.alert('系统操作提示', '请填写密码！', 'info');
    		return;
    	}
    	if(passwordConfirm == ''){
    		$.messager.alert('系统操作提示', '请填写确认密码！', 'info');
    		return;
    	}
    	if(userName == ''){
    		$.messager.alert('系统操作提示', '请填写姓名！', 'info');
    		return;
    	}
    	if(email == ''){
    		$.messager.alert('系统操作提示', '请填写邮箱！', 'info');
    		return;
    	}
    	if(password != passwordConfirm){
    		$.messager.alert('系统操作提示', '两次密码不一致！', 'error');
    		return;
    	}
    	//正则表达式邮箱格式验证
    	if(email != ''){
    		var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    		if(!filter.test(email)){
    			$.messager.alert('系统操作提示', '邮件格式不正确！', 'info');
        		return;
    		}
    	}
    	
    	form.submit();
    }
	
    function _CheckUserIdExist(){
    	var userId = $('#input-regist-userId').val();
    	$.ajax({
            type: "post",
            url: 'method/User!checkExist',
            dataType: "json",
            data: {'userId': userId},
            success: function (data) {
            	if(data.action){
            		$.messager.alert('系统操作提示', data.message, 'error');
            	}
            }
        });
    }
    
    
	var options = {
		success: function (data, statusText) {
            if(data.action){
            	$.messager.alert('系统操作提示', data.message, 'info');
                $('#window-regist').window('close');
            }
            else{
            	$.messager.alert('系统操作提示', data.message, 'error');
            }
        },
        type: 'post',
        dataType: 'json',
        url: 'uesrRegister'
	};
	
	
    var _intance = null;
    if (_intance == null) {
        _intance = {
            Initialization: function () {
            	return _Initialization();
            }
        };
    }
    return _intance;
}();

/**
 * 主页面显示
 */
var IIndex = {};
IIndex.Index = function () {
	var form = null;
	var gridtable = null;
	var advpanel = null;
	function _Initialization() {
		gridtable = $('#grid-Report');
        advpanel = $('#panel-announce');
		
		$('a[data-permissions=true]').bind('click', null, function (obj, evt) {
            obj = $(this);
            var action = obj.data('action');
            var method = obj.data('method');
            if (window.Destroy != null) window.Destroy();
            var p = $('#main-center');
            p.panel('refresh', action + '!' + method);
        });
		
		form = $('#editInfoForm');
		form.submit(function (e) {
            $(this).ajaxSubmit(options);
            return false;
        });
		
		$('#tools-index-editinfo').unbind().bind('click', _EditInfo);
		$('#tools-edit-save').unbind().bind('click', _SaveEdit);
		
		$('#tools-index-bug').unbind().bind('click', _BugFeedback);
		$('#btn-announce').unbind().bind('click', _Announce);
		
		$('#tool-home-logout').unbind().bind('click', _Logout);
		
		$('#input-edituser-passwordConfirm').val($('#input-edituser-password').val());
		
		
		//老师不需要入学年份
		$('#input-edituser-status').combobox({
			onSelect: function(value){
				if(value.text != '学生'){
					$('#label-schoolyear').hide();
					$('#input-edituser-schoolYear + .combo').hide();
					$('#input-edituser-schoolYear').combobox('select', '');
				}else{
					$('#label-schoolyear').show();
					$('#input-edituser-schoolYear + .combo').show();
				}
			}
		});
		
		
		_SetSchoolYear();
		_SetAnnouncement(1, 20);
        _LoadData();
	}
	function _LoadData() {
        gridtable.datagrid({
        	url: 'method/Report!showAllReports',
            method: 'post',
            queryParams: { "sort": "reportdate", "order": "desc" },
            dataType: 'json',
            onLoadSuccess: function (data) {
                if (data.action) {
                    gridtable.datagrid('clearSelections');
                }
                else {
                    $.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
                }
            }
        });
    }
	function _SaveEdit(){
		var userId = $('#input-edituser-userId').val();
		var pswdefault = $('#input-edituser-password')[0].defaultValue;
		var psw = $('#input-edituser-password').val();
		var pswcon = $('#input-edituser-passwordConfirm').val();
		var userName = $('#input-edituser-userName').val();
		var email = $('#input-edituser-email').val();
		
		
		if(userId == ''){
			$.messager.alert('系统操作提示', '请输入登录名！', 'info');
			return;
		}
		if(psw == ''){
			$.messager.alert('系统操作提示', '请输入密码！', 'info');
			return;
		}
		if(pswcon == ''){
			$.messager.alert('系统操作提示', '请确认密码！', 'info');
			return;
		}
		if(userName == ''){
			$.messager.alert('系统操作提示', '请输入姓名！', 'info');
			return;
		}
		if(email == ''){
			$.messager.alert('系统操作提示', '请输入邮箱！', 'info');
			return;
		}
		//正则表达式邮箱格式验证
    	if(email != ''){
    		var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    		if(!filter.test(email)){
    			$.messager.alert('系统操作提示', '邮件格式不正确！', 'info');
        		return;
    		}
    	}
		
		if(psw != pswcon){
			$.messager.alert('系统操作提示', '密码不一致！', 'info');
			return;
		}
		
		//是否修改了密码
		if(pswdefault != psw)
			$('#input-edituser-editPsdFlag').val("1");
		else
			$('#input-edituser-editPsdFlag').val("0");
			
		form.submit();
	}
	
	function _EditInfo(){
		 $('#window-editinfo').window('open');
	}
	/**
	 * 设置公告栏的内容
	 */
	function _SetAnnouncement(pageNumber, pageSize){
		$.ajax({
    		type: "post", 
    		url: "method/Announce!showAnnouncement",
    		data: {'page': pageNumber, 'rows': pageSize},
    		dataType: "json",
    		success: function(data){
    			if(data.action){
    				var content = '';
    				for(var i = 0; i < data.rows.length; i++){
    					content += "<div style='padding:0px 0px 5px 10px'><strong>" + data.rows[i].userName + "：</strong></div>" + 
						 	"<div style='padding:0px 20px 0px 20px'>" + data.rows[i].content + "</div>" + 
						 	"<div align='right' style='padding:0px 25px 0px 0px'><font color='#A9A9A9'>" + data.rows[i].upTime + "</font></div>" +
    			
						 	"<hr width=97% size=1 color=#D3D3D3 >";
    				}
					advpanel.panel({
    					content: content
    				});
					//pagination
					$('#pagination-announce').pagination({
						showPageList: false,                
						showRefresh: false,                
						displayMsg: '',
	                    total: data.total,
	                    pageSize: 20,
	                    //pageNumber: r[r.length - 1].Page,
	                    onSelectPage: function (pageNumber, pageSize) {
	                    	_SetAnnouncement(pageNumber, pageSize);
	                    }
	                });
					$('#announce-content').val('');
    			}
    			else{
    				$.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
    			}
    		}
    	});
		
	}
	function _Announce(){
		var content = $('#announce-content').val();
		if(content == '')
			return;
		$.ajax({
			type: 'post',
			url: 'method/Announce!addAnnouncement',
			data: {'content': content},
			dataType: 'json',
			success: function(data){
				if(data.action){
					_SetAnnouncement(1, 20);
				}
			}
		});
	}
	function _SetSchoolYear(){
		//给入学年份赋值（向前推10年）
		var currentYear = new Date().getFullYear();
		var years = [];
		for(var i = 0; i < 10; i++){
			years.push({ 'id': currentYear - i, 'text': currentYear - i});
		}
		$('#input-edituser-schoolYear').combobox({
	        data: years,
	        valueField: 'id',
	        textField: 'text'
	    });
		$('#input-edituser-schoolYear').combobox('select', currentYear);
	}
	function _BugFeedback(){
        $('#dialog-bug').dialog({
        	iconCls: 'icon-move',                 
        	buttons: [{                    
        		text:'提交',                    
        		iconCls:'icon-ok',                    
        		handler:function(){                        
        			var bugs = $('#bug-content').val();
        			if(bugs == '')return;
        			$.ajax({
                        type: "post",
                        url: 'method/Role!bugFeedback',
                        dataType: "json",
                        data: {'bugs': bugs},
                        success: function (data) {
                        	if(data.action){
                        		$.messager.alert('系统操作提示', data.message, 'info');
                        		$('#dialog-bug').dialog('close');
                        		$('#bug-content').val('');
                        	}
                        	else{
                        		$.messager.alert('系统操作提示', data.message, 'error');
                        	}
                        }
                    });
        		}                
        	}]
        }).dialog('open');
	}
	function _Logout(){
		$.ajax({
    		type: "post", 
    		url: "index",
    		success: function(){
    			window.location.href="index";
    		}
    	});
	}
	
	
	var options = {
		success: function (data, statusText) {
			if(data.action){
				$.messager.alert('系统操作提示', data.message, 'info');
	            $('#window-editinfo').window('close');
			}
			else
				$.messager.alert('系统操作提示', data.message, 'error');
        },
        type: 'post',
        dataType: 'json',
        url: 'User!saveEdit'
	};
	
	
    var _intance = null;
    if (_intance == null) {
        _intance = {
            Initialization: function () {
            	return _Initialization();
            }
        };
    }
    return _intance;
}();

/**
 * 用户页面
 */
var IUser = {
    Error: function (data) {
        if (data.responseText != undefined && data.responseText.length > 0) {
            var Msg = eval('(' + data.responseText + ')');
            $.messager.alert('系统操作信息', Msg.Message + '可以使用代码重定向到登陆页： window.location.pathname = ' + Msg.DefaultUrl, 'error');
            //window.location.pathname = Msg.DefaultUrl;
        }
    }
};
IUser.Titles = function () {
    return {
        ListTitle: "用户列表"
    };
}();
IUser.Index = function () {
    var gridtable = null;//缓存datagrid对象
    var gridtable_authLeft = null;
    var gridtable_authRight = null;
    
    function _Initialization() {
        gridtable = $('#grid-User');
        gridtable_authLeft = $('#grid-auth-left');
        gridtable_authRight = $('#grid-auth-right');

        $('#tool-user-delete').unbind().bind('click', _Delete);
        $('#tool-user-authorization').unbind().bind('click', _Authorization);
        $('#tool-user-verify').unbind().bind('click', _Verify);
        
        $('#tool-auth-cancel').unbind().bind('click', _Cancel);
        $('#tool-auth-grant').unbind().bind('click', _Grant);
        
        
        _LoadData();
    }
    function _LoadData() {
        gridtable.datagrid({
            url: 'method/User!showUsers',
            method: 'post',
            dataType: 'json',
            queryParams: { "sort": "username", "order": "asc" },
            rowStyler: function(index,row){                    
            	if (row.verify == '未审核'){                        
            		return 'color:#ff6666;font-weight:bold;';       
            	}                
            },
            onLoadSuccess: function (data) {
                if (data.action) {
                    gridtable.datagrid('clearSelections');
                }
                else {
                    $.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
                }
            }
        });
    }
    function _Delete(){
    	var rows = gridtable.datagrid('getSelections');
    	if(rows.length == 0){
    		$.messager.alert('系统操作提示', '请选择数据！', 'info');
    	}
    	else{
    		$.messager.confirm('系统操作提示', '确认删除所选数据？！', function(r){
    			if(r){
    				var ids = '';
    				for(var i = 0; i < rows.length; i++){
    					ids += rows[i].id + ',';
    				}
    				$.ajax({
                        type: "post",
                        url: 'method/User!deleteUsers',
                        dataType: "json",
                        data: {'ids': ids},
                        success: function (data) {
                        	if(data.action){
                        		$.messager.alert('系统操作提示', data.message, 'info');
                        		gridtable.datagrid('reload');
                        	}
                        	else{
                        		$.messager.alert('系统操作提示', data.message, 'error');
                        	}
                        }
                    });
    			}
    		});
    	}
    }
    function _Verify(){
    	var rows = gridtable.datagrid('getSelections');
    	if(rows.length == 0){
    		$.messager.alert('系统操作提示', '请选择数据！', 'info');
    		return;
    	}
    	$.messager.confirm('系统操作提示', '确认通过审核？', function(r){
    		if(r){
    			var ids = '';
            	for(var i = 0; i < rows.length; i++){
            		ids += rows[i].id + ',';
            	}
            	$.ajax({
            		type: "post",
            		url: "method/User!verify",
            		dataType: "json",
            		data: {"ids": ids}, 
            		success: function(data){
            			if(data.action){
            				gridtable.datagrid('reload');
            			}
            			else{
            				$.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
            			}
            		}
            	});
    		}
		});
    }
    function _Authorization(){
    	var rows = gridtable.datagrid('getSelections');
    	if(rows.length == 0){
    		$.messager.alert('系统操作提示', '请选择数据！', 'info');
    		return;
    	}
    	else if(rows.length > 1){
    		$.messager.alert('系统操作提示', '只能选择一条数据', 'info');
    		return;
    	}
    	var id = rows[0].id;
    	$('#authorization').window({
    		resizable: false,
    		maximizable: false,
    		minimizable: false,
    		collapsible: false
    	}).window('open');
    	
    	gridtable_authLeft.datagrid({
            url: 'method/Role!getFunctionsById',
            queryParams: {"ids": "all"},
            method: 'post',
            dataType: 'json',
            onLoadSuccess: function (data) {
                if (data.action) {
                	gridtable_authLeft.datagrid('clearSelections');
                }
                else {
                    $.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
                }
            }
        });
    	gridtable_authRight.datagrid({
            url: 'method/Role!getFunctionsById',
            queryParams: {"ids": id},
            method: 'post',
            dataType: 'json',
            onLoadSuccess: function (data) {
                if (data.action) {
                	gridtable_authRight.datagrid('clearSelections');
                }
                else {
                    $.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
                }
            }
        });
    }
    /**
     * 取消授权
     */
    function _Cancel(){
    	var usersid = gridtable.datagrid('getSelections')[0].id;
    	
    	var rows = gridtable_authRight.datagrid('getSelections');
    	if(rows.length == 0){
    		$.messager.alert('系统操作提示', '请选择数据！', 'info');
    		return;
    	}
    	var ids = '';
    	for(var i = 0; i < rows.length; i++){
    		ids += rows[i].id + ',';
    	}
    	$.ajax({
    		type: "post",
    		url: "method/Role!cancel",
    		dataType: "json",
    		data: {"usersid": usersid, "ids": ids}, 
    		success: function(data){
    			if(data.action){
    				gridtable_authRight.datagrid('reload');
    			}
    			else{
    				$.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
    			}
    		}
    	});
    }
    /**
     * 授权
     */
    function _Grant(){
    	var usersid = gridtable.datagrid('getSelections')[0].id;
    	
    	var rows = gridtable_authLeft.datagrid('getSelections');
    	if(rows.length == 0){
    		$.messager.alert('系统操作提示', '请选择数据！', 'info');
    		return;
    	}
    	var ids = '';
    	for(var i = 0; i < rows.length; i++){
    		ids += rows[i].id + ',';
    	}
    	$.ajax({
    		type: "post", 
    		url: "method/Role!grant",
    		dataType: "json",
    		data: {"usersid": usersid, "ids": ids}, 
    		success: function(data){
    			if(data.action){
    				gridtable_authRight.datagrid('reload');
    			}
    			else{
    				$.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
    			}
    		}
    	});
    }
    
    var _intance = null;
    if (_intance == null) {
        _intance = {
            Initialization: function () { return _Initialization(); }
        };
    }
    return _intance;

}();

/**
 * 组会安排
 */
var IArrange = {
    Error: function (data) {
        if (data.responseText != undefined && data.responseText.length > 0) {
            var Msg = eval('(' + data.responseText + ')');
            $.messager.alert('系统操作信息', Msg.Message + '可以使用代码重定向到登陆页： window.location.pathname = ' + Msg.DefaultUrl, 'error');
            //window.location.pathname = Msg.DefaultUrl;
        }
    }
};
IArrange.Titles = function () {
    return {
        ListTitle: "组会安排"
    };
}();
IArrange.Index = function () {
    var gridtable_arrangeLeft = null;
    var gridtable_arrangeRight = null;
    var infodialog = null;
    var infoform = null;
    var processwindow = null;
    
    function _Initialization() {
        gridtable_arrangeLeft = $('#grid-arrange-left');
        gridtable_arrangeRight = $('#grid-arrange-right');
        infodialog = $('#dialog-arrange-info');
        infoform = $('#arrangeInfoForm');
        processwindow = $('#window-process');
        
        infoform.submit(function (e) {
        	var rows = gridtable_arrangeLeft.datagrid('getSelections');
        	var ids = '';
        	for(var i = 0; i < rows.length; i++){
        		ids += rows[i].id + ',';
        	}
        	
            $(this).ajaxSubmit({
            	beforeSubmit: function(){
            		processwindow.window('open');
            	},
            	data: {'ids': ids},
            	type: 'post',    
            	dataType:"json",  
            	url: "Report!grant" ,
            	success: function(data){   
            		if(data.action){
            			infoform.form('clear');
            			infodialog.dialog('close');
            			processwindow.window('close'),
            			gridtable_arrangeRight.datagrid('reload');
            			gridtable_arrangeLeft.datagrid('clearSelections');
            		}
            	},    
            	error: IArrange.Error
            });
            return false;
        });
        
        $('#tools-arrange-cancel').unbind().bind('click', _Cancel);
        $('#tools-arrange-grant').unbind().bind('click', _Grant);
        
        $('#tools-info-confirm').unbind().bind('click', _Confirm);
        
        _LoadData();
    }
    function _LoadData() {
    	gridtable_arrangeLeft.datagrid({
    		url: 'method/User!showAllUsers',
            method: 'post',
            queryParams: { "sort": "username", "order": "asc", "keyword": "已审核", "field": "verify"},
            dataType: 'json',
            onLoadSuccess: function (data) {
                if (data.action) {
                	gridtable_arrangeLeft.datagrid('clearSelections');
                }
                else {
                    $.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
                }
            }
        });
    	gridtable_arrangeRight.datagrid({
            url: 'method/Report!showAllReports',
            method: 'post',
            queryParams: { "sort": "reportdate", "order": "desc" },
            dataType: 'json',
            onLoadSuccess: function (data) {
                if (data.action) {
                	gridtable_arrangeRight.datagrid('clearSelections');
                }
                else {
                    $.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
                }
            }
        });
    }
    function _Confirm(){
		var reportDate = $('#input-arrange-reportDate').datebox('getValue');
		
		if(reportDate == ''){
			$.messager.alert('系统操作提示', '请选择报告日期！', 'info');
			return;
		}
		
    	$.messager.confirm('系统操作提示', '确认后将给被安排人员发送邮件通知，是否继续？', function(r){
    		if(r){
    			infoform.submit();
    		}
    	});
    }
    
    /**
     * 取消
     */
    function _Cancel(){
    	var rows = gridtable_arrangeRight.datagrid('getSelections');
    	if(rows.length == 0){
    		$.messager.alert('系统操作提示', '请选择数据！', 'info');
    		return;
    	}
    	var ids = '';
    	for(var i = 0; i < rows.length; i++){
    		ids += rows[i].id + ',';
    	}
    	$.ajax({
    		type: "post",
    		url: "u r",
    		dataType: "json",
    		data: {"ids": ids},
    		success: function(data){
    			if(data.action){
    				gridtable_arrangeRight.datagrid('reload');
        			gridtable_arrangeRight.datagrid('clearSelections');
    			}
    			else{
    				$.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
    			}
    		}
    	});
    }
    /**
     * 添加
     */
    function _Grant(){
    	var row = gridtable_arrangeLeft.datagrid('getSelections');
    	if(row.length == 0){
    		$.messager.alert('系统操作提示', '请选择报告人！', 'info');
    		return;
    	}
    		
    	//先打开信息框
    	infodialog.dialog('open');
    }
    
    var _intance = null;
    if (_intance == null) {
        _intance = {
            Initialization: function () { return _Initialization(); }
        };
    }
    return _intance;

}();



/**
 * OtherFile页面
 */
var IOtherFile = {
    Error: function (data) {
        if (data.responseText != undefined && data.responseText.length > 0) {
            var Msg = eval('(' + data.responseText + ')');
            $.messager.alert('系统操作信息', Msg.Message + '可以使用代码重定向到登陆页： window.location.pathname = ' + Msg.DefaultUrl, 'error');
            //window.location.pathname = Msg.DefaultUrl;
        }
    }
};
IOtherFile.Titles = function () {
    return {
        ListTitle: "otherFile列表"
    };
}();
IOtherFile.Index = function () {
    var gridtable = null;
    var uploadForm = null;
    var editOtherFileForm = null;
    
    function _Initialization() {
        gridtable = $('#grid-otherFile');

        uploadForm = $('#uploadOtherFileForm');
        uploadForm.submit(function (e) {
            $(this).ajaxSubmit({//如果ajax不起作用，那么可能少jquery.form.js
            	beforeSubmit: function(){
            		$('#window-process').window('open');
            	},
            	type: 'post',    
            	dataType:"json",  
            	url: "OtherFileUpload" ,
            	success: function(data){   
            		if(data.action){
            			uploadForm.form('clear');
            			$('#dialog-upload').dialog('close');
            			$('#window-process').window('close');
            			$.messager.alert('系统操作提示', data.message, 'info');
            			gridtable.datagrid('reload');
            		}
            		else{
            			$.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
            		}
            	},    
            	error: IOtherFile.Error
            });
            return false;
        });
        
        //修改页面的保存
        editOtherFileForm = $('#editOtherFileForm');
        editOtherFileForm.submit(function (e) {
            $(this).ajaxSubmit({//如果ajax不起作用，那么可能少jquery.form.js
            	type: 'post',    
            	dataType:"json",  
            	url: "OtherFile!edit" ,
            	success: function(data){   
            		if(data.action){
            			$.messager.alert('系统操作提示', data.message, 'info');
            			editOtherFileForm.form('clear');
            			$('#window-edit').window('close');
            			gridtable.datagrid('reload');
            		}
            		else{
            			$.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
            		}
            	},    
            	error: IOtherFile.Error
            });
            return false;
        });
        
        $('#tool-otherFile-delete').unbind().bind('click', _Delete);
        $('#tool-otherFile-edit').unbind().bind('click', _Edit);
        
        $('#tool-otherFile-upload').unbind().bind('click', _Upload);
        
        $('#tool-otherFileedit-save').unbind().bind('click', function(){
        	editOtherFileForm.submit();
        });
        
        _LoadData();
    }
    
    function _LoadData() {
        gridtable.datagrid({
            url: 'method/OtherFile!showOtherFiles',
            method: 'post',
            queryParams: { "sort": "uptime", "order": "desc" },
            dataType: 'json',
            onLoadSuccess: function (data) {
                if (data.action) {
                    gridtable.datagrid('clearSelections');
                }
                else {
                    $.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
                }
            },
            view: detailview,                
            detailFormatter:function(index,row){                    
            	return '<div class="ddv" style="padding:5px 50px; text-align:right;" ></div>';                
            },
            onExpandRow: function(index,row){     
                var ddv = $(this).datagrid('getRowDetail',index).find('div.ddv'); 
                var fileName = row.fileName;
                ddv.panel({     
                	content: "<a href='OtherFileDownload?filename=" + fileName + "'><font color=red>下载</font></a>"
                });
                gridtable.datagrid('fixDetailRowHeight',index);     
            }
        });
    }
    function _UploadSubmit(){
		var psw = $('#upload-subject').val();
		if(psw == '' || psw == null)
			$.messager.alert('系统操作提示', '请填写主题！', 'info');
		else
			uploadForm.submit();
	}
    
    function _Edit(){
    	var row = gridtable.datagrid('getSelections');
    	if(row.length == 0){
    		$.messager.alert('系统操作提示', '请选择数据！', 'info');
    		return;
    	}
    	if(row.length > 1){
    		$.messager.alert('系统操作提示', '只能选择一条！', 'info');
    		return;
    	}
    	$('#input-otherFileedit-filename').val(row[0].fileName);
    	$('#input-otherFileedit-subject').val(row[0].subject);
    	$('#input-otherFileedit-author').val(row[0].author);
    	$('#input-otherFileedit-description').val(row[0].description);
    	//hidden
    	$('#input-otherFileedit-id').val(row[0].id);
    	$('#input-otherFileedit-upTime').val(row[0].upTime);
    	$('#input-otherFileedit-uploader').val(row[0].uploader);
    	$('#input-otherFileedit-location').val(row[0].location);
    	
    	$('#window-edit').window('open');
    	//直接从页面取选的数据
    	
    }
    function _Delete(){
    	var rows = gridtable.datagrid('getSelections');
    	if(rows.length == 0){
    		$.messager.alert('系统操作提示', '请选择数据！', 'info');
    		return;
    	}
		$.messager.confirm('系统操作提示', '确认删除所选数据？！', function(r){
			if(r){
				var ids = '';
				var fileloc = '';
				for(var i = 0; i < rows.length; i++){
					ids += rows[i].id + ',';
					fileloc += rows[i].location + ',';
				}
				$.ajax({
                    type: "post",
                    url: 'method/OtherFile!deleteOtherFiles',
                    dataType: "json",
                    data: {'ids': ids, 'fileloc': fileloc},
                    success: function (data) {
                    	if(data.action){
                    		$.messager.alert('系统操作提示', data.message, 'info');
                    		gridtable.datagrid('reload');
                    	}
                    	else{
                    		$.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
                    	}
                    }
                });
			}
		});
    }
    function _Upload(){
        $('#dialog-upload').dialog({
        	iconCls: 'icon-save',                 
        	buttons: [{                    
        		text:'上传',                    
        		iconCls:'icon-ok',                    
        		handler:function(){                        
        			_UploadSubmit();             
        		}                
        	},{                    
        		text:'清空',    
        		iconCls:'icon-cancel',
        		handler:function(){                        
        			uploadForm.form('clear');
        		}                
        	}]
        }).dialog('open');
    }
    
    
    var _intance = null;
    if (_intance == null) {
        _intance = {
            Initialization: function () { return _Initialization(); }
        };
    }
    return _intance;

}();


/**
 * 组会查看页面
 */
var IReport = {
    Error: function (data) {
        if (data.responseText != undefined && data.responseText.length > 0) {
            var Msg = eval('(' + data.responseText + ')');
            $.messager.alert('系统操作信息', Msg.Message + '可以使用代码重定向到登陆页： window.location.pathname = ' + Msg.DefaultUrl, 'error');
            //window.location.pathname = Msg.DefaultUrl;
        }
    }
};
IReport.Titles = function () {
    return {
        ListTitle: "报告列表"
    };
}();
IReport.Index = function () {
    var gridtable = null;
    var editform = null;
    
    function _Initialization() {
        gridtable = $('#grid-Report');
        editform = $('#editreportForm');
		editform.submit(function (e) {
            $(this).ajaxSubmit(options);
            return false;
        });
		
        $('#tool-report-delete').unbind().bind('click', _Delete);
        $('#tool-reprot-edit').unbind().bind('click', _Edit);
        
        $('#report-edit-confirm').unbind().bind('click', _EditConfirm);
        
        _LoadData();
    }
    function _LoadData() {
        gridtable.datagrid({
            url: 'method/Report!showReports',
            method: 'post',
            queryParams: { "sort": "reportdate", "order": "desc" },
            dataType: 'json',
            onLoadSuccess: function (data) {
                if (data.action) {
                    gridtable.datagrid('clearSelections');
                }
                else {
                    $.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
                }
            },
            rowStyler: function(index,row){                    
            	if (row.invalid == '否'){                        
            		return 'color:#ff6666;font-weight:bold;';       
            	}                
            },
            view: detailview,                
            detailFormatter:function(index, row){                    
            	return '<div class="ddv" style="padding:5px 50px; text-align:right;" ></div>';
            },
            onExpandRow: function(index,row){     
                var ddv = $(this).datagrid('getRowDetail',index).find('div.ddv'); 
                if(row.fileName != null && row.fileName != ''){
                	ddv.panel({     
                		doSize:true, 
                        cache:false,  
                        href:'Report!subDownload',
                        onLoad:function(){  
                        	gridtable.datagrid('fixDetailRowHeight',index);
                        	gridtable.datagrid('clearSelections');
                        	gridtable.datagrid('selectRow',index);  
                        }
                    });
                }
                else{
                	ddv.panel({     
                		doSize:true, 
                        cache:false,  
                        href:'Report!subUpload',
                        onLoad:function(){  
                        	gridtable.datagrid('fixDetailRowHeight',index);
                        	gridtable.datagrid('clearSelections');
                        	gridtable.datagrid('selectRow',index);  
                        }
                    });
                }
                gridtable.datagrid('fixDetailRowHeight',index);     
            }     
        });
    }
    function _Delete(){
    	var rows = gridtable.datagrid('getSelections');
    	if(rows.length == 0){
    		$.messager.alert('系统操作提示', '请选择数据！', 'info');
    	}
    	else{
    		$.messager.confirm('系统操作提示', '确认删除所选数据？', function(r){
    			if(r){
    				var ids = '';
    				for(var i = 0; i < rows.length; i++){
    					ids += rows[i].id + ',';
    				}
    				$.ajax({
                        type: "post",
                        url: 'method/Report!deleteReports',
                        dataType: "json",
                        data: {'ids': ids},
                        success: function (data) {
                        	if(data.action){
                        		$.messager.alert('系统出错提示', data.message, 'info');
                        		gridtable.datagrid('reload');
                        	}
                        	else{
                        		$.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
                        	}
                        }
                    });
    			}
    		});
    	}
    }
    function _Edit(){
    	var rows = gridtable.datagrid('getSelections');
    	if(rows.length == 0){
    		$.messager.alert('系统操作提示', '请选择要修改的数据！', 'info');
    		return;
    	}
    	if(rows.length > 1){
    		$.messager.alert('系统操作提示', '只能选择一条！', 'info');
    		return;
    	}
    	$('#input-edit-id').val(rows[0].id);
    	$('#input-edit-reporter').val(rows[0].reporter);
    	$('#input-edit-reportDate').datebox('setValue',rows[0].reportDate);
    	$('#input-edit-theme').val(rows[0].theme);
    	$('#input-edit-comment').val(rows[0].comment);
    	
    	$('#window-editreport').window('open');
    }
    function _EditConfirm(){
		var reporter = $('#input-edit-reporter').val();
		var reportDate = $('#input-edit-reportDate').datebox('getValue');
		
		if(reporter == ''){
			$.messager.alert('系统操作提示', '请输入报告人！', 'info');
			return;
		}
		if(reportDate == ''){
			$.messager.alert('系统操作提示', '请选择报告日期！', 'info');
			return;
		}
		editform.submit();
	}
    
    var options = {
		success: function (data, statusText) {
            if(data.action){
            	$.messager.alert('系统操作提示', data.message, 'info');
            	gridtable.datagrid('reload');
                $('#window-editreport').window('close');
            }
            else{
    			$.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
    		}
        },
        error: IReport.Error,
        type: 'post',
        dataType: 'json',
        url: 'Report!editReport'
	};
    
    var _intance = null;
    if (_intance == null) {
        _intance = {
            Initialization: function () { return _Initialization(); }
        };
    }
    return _intance;

}();
IReport.SubUpload = function () {
	var form = null;
	var gridtable = null;
    function _Initialization() {
    	gridtable = $('#grid-Report');//这样都能得到父容器的元素啊。。。。。。。。
    	
    	
    	form = $('#uploadReportForm');
    	form.submit(function (e) {
    		var row = gridtable.datagrid('getSelections');
    		var ids = row[0].id;
    		
            $(this).ajaxSubmit({//如果ajax不起作用，那么可能少jquery.form.js
            	data: {'ids': ids},
            	type: 'post',    
            	dataType:"json",  
            	url: "ReportUpload" , 
            	success: function(data){
            		if(data.action){
            			$.messager.alert('系统操作提示', data.message, 'info');
            			gridtable.datagrid('reload');
            		}
            		else{
            			$.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
            		}
            	},    
            	error: function(XmlHttpRequest, textStatus, errorThrown){    
            		$.messager.alert('系统操作提示', '上传发生错误！', 'info');
            	}
            });
            return false;
        });
    	
        $('#tool-report-upload').unbind().bind('click', _Submit);
    }
    
    function _Submit(){
    	form.submit();
    }
    
    
    var _intance = null;
    if (_intance == null) {
        _intance = {
            Initialization: function () { return _Initialization(); }
        };
    }
    return _intance;

}();
IReport.SubDownload = function () {
	var gridtable = null;
    function _Initialization() {
    	gridtable = $('#grid-Report');//这样都能得到父容器的元素啊。。。。。。。。
    	
        $('#tool-subDownloadReport-download').unbind().bind('click', _Download);
        $('#tool-subDownloadReport-deleteFile').unbind().bind('click', _DeleteFile);
    }
    function _Download(){
    	var row = gridtable.datagrid('getSelections');
    	if(row.length == 0){
    		$.messager.alert('系统操作提示', '请选择要删除文件的数据行！', 'info');
    		return;
    	}
    	if(row.length > 1){
    		$.messager.alert('系统操作提示', '只能选择一行！', 'info');
    		return;
    	}
    	var filename = row[0].fileName;
    	window.location.href="ReportDownload?filename=" + filename;
    }
    function _DeleteFile(){
    	var row = gridtable.datagrid('getSelections');
    	if(row.length == 0){
    		$.messager.alert('系统操作提示', '请选择要删除文件的数据行！', 'info');
    		return;
    	}
    	if(row.length > 1){
    		$.messager.alert('系统操作提示', '只能选择一行！', 'info');
    		return;
    	}
    	var id = row[0].id;
    	var fileloc = row[0].fileLocation;
    	$.ajax({
            type: "post",
            url: 'method/Report!deleteFile',
            dataType: "json",
            data: {'ids': id, 'fileloc': fileloc},
            success: function (data) {
            	if(data.action){
            		$.messager.alert('系统出错提示', data.message, 'info');
            		gridtable.datagrid('reload');
            	}
            	else{
            		$.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
            	}
            }
        });
    }
    
    var _intance = null;
    if (_intance == null) {
        _intance = {
            Initialization: function () { return _Initialization(); }
        };
    }
    return _intance;

}();



/**
 * 图书页面
 */
var IBook = {
    Error: function (data) {
        if (data.responseText != undefined && data.responseText.length > 0) {
            var Msg = eval('(' + data.responseText + ')');
            $.messager.alert('系统操作信息', Msg.Message + '可以使用代码重定向到登陆页： window.location.pathname = ' + Msg.DefaultUrl, 'error');
            //window.location.pathname = Msg.DefaultUrl;
        }
    }
};
IBook.Titles = function () {
    return {
        ListTitle: "图书列表"
    };
}();
IBook.Index = function () {
    var gridtable = null;
    var addform = null;
    var editform = null;
    
    function _Initialization() {
        gridtable = $('#grid-Book');
        
        addform = $('#addbookForm');
		addform.submit(function (e) {
            $(this).ajaxSubmit(addOptions);
            return false;
        });
		editform = $('#editbookForm');
		editform.submit(function (e) {
            $(this).ajaxSubmit(editOptions);
            return false;
        });

        $('#tool-book-delete').unbind().bind('click', _Delete);
        $('#tool-book-edit').unbind().bind('click', _Edit);
        $('#tool-book-add').unbind().bind('click', _Add);
        $('#tool-book-borrow').unbind().bind('click', _Borrow);
        $('#tool-book-back').unbind().bind('click', _Back);
        $('#tool-book-lost').unbind().bind('click', _Lost);
        
        $('#book-add-confirm').unbind().bind('click', _AddConfirm);
        $('#book-edit-confirm').unbind().bind('click', _EditConfirm);
        
        
        $('#book-searchbox').searchbox({
        	searcher: function(value, name){
        		_Search(value, name);
        	}
        });
        
        _LoadData();
        
        
    }
    function _LoadData() {
        gridtable.datagrid({
            url: 'method/Book!showBooks',
            method: 'post',
            queryParams: { "sort": "bookname", "order": "asc", "keyword": ""},
            dataType: 'json',
            onLoadSuccess: function (data) {
                if (data.action) {
                    gridtable.datagrid('clearSelections');
                }
                else {
                    $.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
                }
            },
            rowStyler: function(index,row){                    
            	if (row.status == '怀疑遗失'){                        
            		return 'background-color:#ff6666;color:#fff';                    
            	}  
            	else if(row.status == '已借出'){
            		return 'color:#ff6666;font-weight:bold;';
            	}
            }
        });
    }
    function _Delete(){
    	var rows = gridtable.datagrid('getSelections');
    	if(rows.length == 0){
    		$.messager.alert('系统操作提示', '请选择数据！', 'info');
    	}
    	else{
    		$.messager.confirm('系统操作提示', '确认删除所选数据？', function(r){
    			if(r){
    				var ids = '';
    				for(var i = 0; i < rows.length; i++){
    					ids += rows[i].id + ',';
    				}
    				$.ajax({
                        type: "post",
                        url: 'method/Book!deleteBooks',
                        dataType: "json",
                        data: {'ids': ids},
                        success: function (data) {
                        	if(data.action){
                        		$.messager.alert('系统操作提示', data.message, 'info');
                        		gridtable.datagrid('reload');
                        	}
                        	else{
                        		$.messager.alert('系统出错提示', data.message, 'error');
                        	}
                        }
                    });
    			}
    		});
    	}
    }
    function _Add(){
    	//查到所有用户(???和edit里的请求合为一个后，其中一个combo能出来但不能选？？？？？)
		var users = [];
		$.ajax({
    		type: "post",
    		url: "method/User!showAllUsers",
    		dataType: "json",
    		data: {"sort": "username", "keyword": "已审核", "field": "verify"},
    		success: function(data){
    			if(data.action){
    				for(var i = 0; i < data.rows.length; i++){
        				users.push({'id': data.rows[i].userName, 'text': data.rows[i].userName});
        			}
					$('#input-add-buyer').combobox({
        		        data: users,
        		        valueField: 'id',
        		        textField: 'text'
        		    });
    			}
    		}
    	});
    	$('#window-addbook').window('open');
    }
    function _Edit(){
    	var rows = gridtable.datagrid('getSelections');
    	if(rows.length == 0){
    		$.messager.alert('系统操作提示', '请选择要修改的书！', 'info');
    		return;
    	}
    	if(rows.length > 1){
    		$.messager.alert('系统操作提示', '只能选择一本书！', 'info');
    		return;
    	}
    	$('#input-edit-id').val(rows[0].id);
    	$('#input-edit-bookName').val(rows[0].bookName);
    	$('#input-edit-author').val(rows[0].author);
    	$('#input-edit-publisher').val(rows[0].publisher);
    	$('#input-edit-publishTime').val(rows[0].publishTime);
    	$('#input-edit-edition').val(rows[0].edition);
    	$('#input-edit-ISBN').val(rows[0].ISBN);
    	$('#input-edit-price').val(rows[0].price);
    	$('#input-edit-num').val(rows[0].num);
    	$('#input-edit-buyer').val(rows[0].buyer);
    	$('#input-edit-comment').val(rows[0].comment);
    	
    	//查到所有用户
		var users = [];
		$.ajax({
    		type: "post",
    		url: "method/User!showAllUsers",
    		dataType: "json",
    		data: {"sort": "username", "keyword": "已审核", "field": "verify"},
    		success: function(data){
    			if(data.action){
    				for(var i = 0; i < data.rows.length; i++){
        				users.push({'id': data.rows[i].userName, 'text': data.rows[i].userName});
        			}
					$('#input-edit-buyer').combobox({
        		        data: users,
        		        valueField: 'id',
        		        textField: 'text'
        		    }).combobox('select', rows[0].buyer);
    			}
    		}
    	});
    
    	$('#window-editbook').window('open');
    }
	function _Borrow(){
		var rows = gridtable.datagrid('getSelections');
		if(rows.length == 0){
    		$.messager.alert('系统操作提示', '请选择数据！', 'info');
    		return;
    	}
		var ids = '';
		for(var i = 0; i < rows.length; i++){
//			if((rows[i].status == '已借出')&&(rows[i].avaliablenum==0)){
//			if(row[i].Number==0){
			if(rows[i].avaliablenum==0){
				$.messager.alert('系统操作提示', '《' + rows[i].bookName + '》已经被借走了！', 'info');
				return;
			}
			if(rows[i].status == '怀疑遗失'){
				$.messager.alert('系统操作提示', '《' + rows[i].bookName + '》可能丢了！如果找到了，请先点击“归还”', 'info');
				return;
			}
			
			ids += rows[i].id + ',';
		}
		$.messager.confirm('系统操作提示', '确认要借所选这' + rows.length + '本书？', function(r){
			if(r){
				$.ajax({
					type: "post",
					url: "method/Book!borrow",
					data: {'ids': ids},
					dataType: "json",
					success: function(data){
						if(data.action){
							$.messager.alert('系统操作提示', data.message, 'info');
							gridtable.datagrid('reload');
						}
						else{
							$.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
						}
					}
				});
			}
		});
	}
	function _Back(){
		var rows = gridtable.datagrid('getSelections');
		if(rows.length == 0){
    		$.messager.alert('系统操作提示', '请选择数据！', 'info');
    		return;
    	}
		var ids = '';
		for(var i = 0; i < rows.length; i++){
			
			var a=rows[i].avaliablenum;
			var b=rows[i].num;
			if(a-b==0){
				$.messager.alert('系统操作提示', '无法归还这本书，请重新确认', 'info');
				return ;
			}
			ids += rows[i].id + ',';
		}
		$.messager.confirm('系统操作提示', '确认要还所选这' + rows.length + '本书？', function(r){
			if(r){
				$.ajax({
					type: "post",
					url: "method/Book!back",
					data: {'ids': ids},
					dataType: "json",
					success: function(data){
						if(data.action){
							$.messager.alert('系统操作提示', data.message, 'info');
							gridtable.datagrid('reload');
						}
						else{
							$.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
						}
					}
				});
			}
		});
	}
	function _Lost(){
		var rows = gridtable.datagrid('getSelections');
		if(rows.length == 0){
    		$.messager.alert('系统操作提示', '请选择数据！', 'info');
    		return;
    	}
		var ids = '';
		for(var i = 0; i < rows.length; i++){
			ids += rows[i].id + ',';
		}
		$.messager.confirm('系统操作提示', '确认要将这' + rows.length + '本书标记为“已遗失”？', function(r){
			if(r){
				$.ajax({
					type: "post",
					url: "method/Book!lost",
					data: {'ids': ids},
					dataType: "json",
					success: function(data){
						if(data.action){
							$.messager.alert('系统操作提示', data.message, 'info');
							gridtable.datagrid('reload');
						}
						else{
							$.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
						}
					}
				});
			}
		});
	}
	function _AddConfirm(){
		var bookName = $('#input-add-bookName').val();
		var author = $('#input-add-author').val();
		var publisher = $('#input-add-publisher').val();
		var publishTime = $('#input-add-publishTime').val();
		var ISBN = $('#input-add-ISBN').val();
		
		if(bookName == ''){
			$.messager.alert('系统操作提示', '请输入书名！', 'info');
			return;
		}
		if(author == ''){
			$.messager.alert('系统操作提示', '请输入作者！', 'info');
			return;
		}
		if(publisher == ''){
			$.messager.alert('系统操作提示', '请输入出版社！', 'info');
			return;
		}
		if(publishTime == ''){
			$.messager.alert('系统操作提示', '请输入出版时间！', 'info');
			return;
		}
		if(ISBN == ''){
			$.messager.alert('系统操作提示', '请输入ISBN！', 'info');
			return;
		}
		addform.submit();
	}
	function _EditConfirm(){
		var bookName = $('#input-edit-bookName').val();
		var author = $('#input-edit-author').val();
		var publisher = $('#input-edit-publisher').val();
		var publishTime = $('#input-edit-publishTime').val();
		var ISBN = $('#input-edit-ISBN').val();
		
		if(bookName == ''){
			$.messager.alert('系统操作提示', '请输入书名！', 'info');
			return;
		}
		if(author == ''){
			$.messager.alert('系统操作提示', '请输入作者！', 'info');
			return;
		}
		if(publisher == ''){
			$.messager.alert('系统操作提示', '请输入出版社！', 'info');
			return;
		}
		if(publishTime == ''){
			$.messager.alert('系统操作提示', '请输入出版时间！', 'info');
			return;
		}
		if(ISBN == ''){
			$.messager.alert('系统操作提示', '请输入ISBN！', 'info');
			return;
		}
		
		editform.submit();
	}
	function _Search(value, name){
		var queryParams = {"sort": "bookname", "order": "asc", 'field': name, 'keyword': value};
		gridtable.datagrid('reload', queryParams);
	}
    
	var addOptions = {
		success: function (data, statusText) {
            if(data.action){
            	$.messager.alert('系统操作提示', data.message, 'info');
            	gridtable.datagrid('reload');
                $('#window-addbook').window('close');
                addform.form('clear');
            }
            else{
    			$.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
    		}
        },
        error: IBook.Error,
        type: 'post',
        dataType: 'json',
        url: 'Book!add'
	};
	var editOptions = {
		success: function (data, statusText) {
            if(data.action){
            	$.messager.alert('系统操作提示', data.message, 'info');
            	gridtable.datagrid('reload');
                $('#window-editbook').window('close');
            }
            else{
    			$.messager.alert('系统出错提示', '对不起，从服务器读取数据出错！<br/>错误信息：' + data.message, 'error');
    		}
        },
        error: IBook.Error,
        type: 'post',
        dataType: 'json',
        url: 'Book!edit'
	};
	
    var _intance = null;
    if (_intance == null) {
        _intance = {
            Initialization: function () { return _Initialization(); }
        };
    }
    return _intance;

}();