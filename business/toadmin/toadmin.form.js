define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
	var moment = require( "moment" );
	var $ = require( "jquery" );
		base.code.cache( "Is_No,Login_Type,Branch_Self_Typ,Open_Org,Sex,Nation" );
		
		//=======================================================
		// 当前组件
		//=======================================================
		var that = this; //全局对象
		var vars = this.vars = {};//全局变梁
		var handlers = this.handlers = {};//处理程序
		handlers.global = function() { return that; };

		//组件入口函数  相当于java.main
		that.init = function() {
			this.layout();
			this.load();
		};
		
		//初始化远程请求处理
		that.load = function() {
			var that = this.global();
			if ( !that.params.item ) return;
			that.handlers.load( that.params.item );
		};
		
		
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			var item=that.params.item;
			that.selector.find( "#submitBtn" ).bind( "click", function( event ) {
				that.handlers.pass(item);
			} );
			that.selector.find( "#cancel" ).bind( "click", function( event ) {
				that.handlers.failPass(item);
			} );
			//关闭事件
			that.selector.find( "#closeBtn" ).click( function(event) {
				that.close();
				return false;
			});
			that.selector.find( "input[name=branchSelf]" ).select( {
				code: { type: "Branch_Self_Typ" }
			} );
			that.selector.find( "input[name=branchTyp]" ).select( {
				code: { type: "Branch_Type" }
			} );
			that.selector.find( "input[name=openOrg]" ).select( {
				code: { type: "Open_Org" }
			} );
			that.selector.find( "input[name=sex]" ).select( {
				code: { type: "Sex" }
			} );
			that.selector.find( "input[name=ethnic]" ).select( {
				code: { type: "Nation" }
			} );
			that.selector.find( ".branchAddr" ).selectArea( {
				code: { type: "area.code.json" },
				itemLevelValues: [ "branchProv", "branchCity", "branchArea" ]
			} );
			that.selector.find( ".openAddr" ).selectArea( {
				code: { type: "area.code.json" },
				itemLevelValues: [ "openProv", "openCity", "openArea" ]
			} );
			that.selector.find( ".regAddr" ).selectArea( {
				code: { type: "area.code.json" },
				itemLevelValues: [ "regProv", "regCity", "regArea" ]
			} );
			that.selector.find( ".liveAddr" ).selectArea( {
				code: { type: "area.code.json" },
				itemLevelValues: [ "liveProv", "liveCity", "liveArea" ]
			} );
			that.selector.find( ".input" ).input( {} );//实例input插件
		};
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		
		/** 加载数据*/
		handlers.load = function( item ) {
			var that = this.global();
			that.selector.find( ":input[name=id]" ).valChange( item.id ); 
			$.ajax({  
				url:"register/sysadmin/tmpBranch",
				type:"POST",
			    data: {'branchId':item.tmpBranchId},
			    success: function( data ) {
			    	var branchAddr = data.branchProv+','+data.branchCity +','+ data.branchArea;
			    	var openAddr = data.openProv+','+data.openCity +','+ data.openArea;
			    	that.selector.find( ".branchAddr" ).valChange(branchAddr);
			    	that.selector.find( ".openAddr" ).valChange(openAddr);
			    	that.selector.find( ":input[name=temBranchid]" ).valChange( data.id ); 
			    	that.selector.find( ":input[name=branchName]" ).valChange( data.branchName ); 
			    	that.selector.find( ":input[name=branchSelf]" ).valChange( data.branchSelf ); 
			    	that.selector.find( ":input[name=branchTyp]" ).valChange( data.branchTyp ); 
			    	that.selector.find( ":input[name=busLicsNo]" ).valChange( data.busLicsNo ); 
			    	that.selector.find( ":input[name=signContr]" ).valChange( data.signContr ); 
			    	that.selector.find( ":input[name=signDate]" ).valChange( data.signDate ); 
			    	that.selector.find( ":input[name=regalName]" ).valChange( data.regalName ); 
			    	that.selector.find( ":input[name=regalCertNo]" ).valChange( data.regalCertNo ); 
			    	that.selector.find( ":input[name=openOrg]" ).valChange(data.openOrg); 
			    	that.selector.find( ":input[name=bankName]" ).valChange( data.bankName ); 
			    	that.selector.find( ":input[name=acctNo]" ).valChange( data.acctNo ); 
			    	that.selector.find( ":input[name=acctName]" ).valChange( data.acctName ); 
			    	that.handlers.loadFileModule();
			    	that.handlers.loadChannelFileModule();
			    	that.selector.find( ":input" ).readonly( true); 
			    	}
				});
			$.ajax({  
				url:"register/sysadmin/othUser",
				type:"POST",
			    data: {'userId':item.othUserId},
			    success: function( data ) {
			    	var regAddr = data.regProv+','+data.regCity +','+ data.regArea;
			    	var liveAddr = data.liveProv+','+data.liveCity +','+ data.liveArea;
			    	that.selector.find( ".regAddr" ).valChange(regAddr);
			    	that.selector.find( ".liveAddr" ).valChange(liveAddr);
			    	that.selector.find( ":input[name=othuserid]" ).valChange( data.id ); 
			    	that.selector.find( ":input[name=userName]" ).valChange( data.userName ); 
			    	that.selector.find( ":input[name=certNo]" ).valChange( data.certNo ); 
			    	that.selector.find( ":input[name=sex]" ).valChange(data.sex); 
			    	that.selector.find( ":input[name=ethnic]" ).valChange( data.ethnic ); 
			    	that.selector.find( ":input[name=phoneNo]" ).valChange( data.phoneNo ); 
			    	that.selector.find( ":input[name=secPhoneNo]" ).valChange( data.secPhoneNo ); 
			    	that.selector.find( ":input[name=post]" ).valChange( data.post ); 
			    	that.selector.find( ":input[name=regAddrArea]" ).valChange( data.regAddr ); 
			    	that.selector.find( ":input[name=liveAddr]" ).valChange( data.liveAddr ); 
			    	that.handlers.loadUserFileModule();
			    	that.selector.find( ":input" ).readonly( true); 
			    	}
				});
		};
		
		//通过审核
		handlers.pass = function (item){
			var that = this.global();
			that.dialog.confirm( "确定审核通过选中的数据？", function( event, index ) {
				if ( index == 1 ) return false;
				$.ajax( {
					url: "register/sysadmin/save",
					type: "POST",
					contentType:"application/json", 
					data: JSON.stringify(item),
					success: function( data ) {
						if ( !data.success ) {
							return message.error( data.msg );
						}
						message.success( data.msg );
						that.close(data);
					}
				} );
			} );
			
		};
		//不通过审核
		handlers.failPass = function (item){
			var that = this.global();
			that.modal.open( {
				title: "网点管理员审核 | 不通过理由",
				url: "register/sysadmin/remark",
				size: "modal-sg",
				params: { item: item },
				events: {
					hiden: function( closed, data ) {
						if(closed){that.close(data);}
						else{}
						
					}
				}
			} );
		};
		
//		临时网点附件
		//附件上传
		handlers.loadFileModule = function() {
			var that = this.global();
			var busiNo = that.selector.find( "#temBranchid" ).val();
			that.module.load({
				title: "网点法人证件照",
				style: "margin-top: 15px; margin-bottom: 15px;",
				url:"pub/asysatt/index",
				content: "#tmpBranch-file",
				params: {
					remove: false,
					upload: false,
					download: false,
					headers: {
						busiNo: busiNo,
						busiTyp: "21400001"  //管理类型业务 Busi_Typ 业务类型码表
					},
					events:{
						uploadAdd: { //可以用来做文件类型判断 判断是否上传的文件类型不一致
							data: {},
							handler: function( event, fileupload, internal, index ) {
								that.vars.isUploaded = true;
							}
						}
					}
				}
			} );
			
		};
//		网点营业执照
		handlers.loadChannelFileModule = function() {
			var that = this.global();
			var busiNo = that.selector.find( "#temBranchid" ).val();
			that.module.load({
				title: "网点营业执照",
				style: "margin-top: 15px; margin-bottom: 15px;",
				url:"pub/asysatt/index",
				content: "#tmpBranch-file",
				params: {
					remove: false,
					upload: false,
					download: false,
					headers: {
						busiNo: busiNo,
						busiTyp: "21400002"  //管理类型业务 Busi_Typ 业务类型码表
					},
					events:{
						uploadAdd: { //可以用来做文件类型判断 判断是否上传的文件类型不一致
							data: {},
							handler: function( event, fileupload, internal, index ) {
								that.vars.isUploaded = true;
							}
						}
					}
				}
			} );
		}
			
//		end
		handlers.loadUserFileModule = function() {
			var that = this.global();
			var busiNo = that.selector.find( "#othuserid" ).val();
			that.module.load({
				title: "用户证件照",
				style: "margin-top: 15px; margin-bottom: 15px;",
				url:"pub/asysatt/index",
				content: "#othuser-file",
				params: {
					remove: false,
					upload: false,
					download: false,
					headers: {
						busiNo: busiNo,
						busiTyp: "21400001"  //管理类型业务 Busi_Typ 业务类型码表
					},
					events:{
						uploadAdd: { //可以用来做文件类型判断 判断是否上传的文件类型不一致
							data: {},
							handler: function( event, fileupload, internal, index ) {
								that.vars.isUploaded = true;
							}
						}
					}
				}
			} );
			
		};
//		end
	
	};
	
	return Global;
});