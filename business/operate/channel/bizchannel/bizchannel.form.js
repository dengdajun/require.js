define(function () { 
	
	function Global( vars ) {
		//=======================================================
		// 获取基础组件
		//=======================================================
		var base = require( "app/base" )
			, message = base.message
			, tools = base.tools;
//		var moment = require( "moment" );
		base.code.cache( "Is_No,Branch_Type,Acct_Type,Branch_Self_Typ" );
		
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
			this.valdiate();
		};
		
		//初始化远程请求处理
		that.load = function() {
			var that = this.global();
			if ( !that.params.item ) return;
			that.handlers.load( that.params.item );
		};
		
		//验证组件
		that.valdiate = function() {
			var that = this.global(); 
			that.vars.validator = that.selector.find( "form" ).validate( {
				rules: {
					branchNo: { required: true },
					branchName: { required: true },
					branchSelf: { required: true },
					//validCiry: { required: true },
					//openArea: { required: true },
					branchAddr: { required: true },
//					branchLevel: { required: true ,isNumber:true},
					branchTyp: { required: true },
//					branchScore: { required: true ,isNumber:true},
					contctPer: { required: true },
					contctDuty: { required: true },
					contctTel: { required: true,isPhone:true },
					acctNo: { required: true ,isNumber:true},
					acctName: { required: true },
					openOrg: { required: true },
					bankNo: { required: true },
					bankName: { required: true },
					signContr: { required: true },
					signDate: { required: true },
					stat: { required: true },
					blckListFlag: { required: true }
				}
			} );
		};
		
		//页面布局
		that.layout = function() {
			var that = this.global();//获取组件的全局对象
			
			that.selector.find( ".input" ).input( {} );//实例input插件
			that.selector.find( "input[name=stat]" ).select( {
				code: { type: "Is_No" }
			} );
			
			that.selector.find( "input[name=blckListFlag]" ).select( {
				code: { type: "Is_No" }
			} );
			
			that.selector.find( "input[name=branchTyp]" ).select( {
				code: { type: "Branch_Type" }
			} );
			that.selector.find( "input[name=branchSelf]" ).select( {
				code: { type: "Branch_Self_Typ" }
			} );
			that.selector.find( "input[name=openOrg]" ).select( {
				code: { type: "Open_Org" },
				events: {
					change: {
						data: {},
						handler: function (event, val, item) {
							that.selector.find( "input[name=bankNo]" ).valChange( val );
						}
					}
				}
			} );
			
			that.selector.find( ".branchAddr" ).selectArea( {
				code: { type: "area.code.json" },
				itemLevelValues: [ "branchProv", "branchCity", "branchArea" ]
			} );
			that.selector.find( ".openSelectArea" ).selectArea( {
				code: { type: "area.code.json" },
				showChildrenLevel:2,
				itemLevelValues: [ "openProv", "openCity"]
			} );
			
			that.selector.find( "input[name=signDate]" ).datetimepicker({});
			
			//保存事件
			that.selector.find( "#submitBtn" ).click( function(event) {
				that.handlers.save();
				return false;
			});
			//关闭事件
			that.selector.find( "#closeBtn" ).click( function(event) {
				that.close();
				return false;
			});
			
		};
		//=======================================================
		// 业务逻辑申明
		//=======================================================
		/** 加载数据*/
		handlers.load = function( item ) {
			var that = this.global();
			var branchAddr = item.branchProv+','+item.branchCity+','+item.branchArea;
			var openSelectArea = item.openProv+','+item.openCity;
			that.selector.find( ".openSelectArea" ).valChange(openSelectArea);
			that.selector.find( ".branchAddr" ).valChange(branchAddr);
			that.selector.find( ":input[name=id]" ).valChange( item.id ); 
			that.selector.find( ":input[name=branchNo]" ).valChange( item.branchNo ); 
			that.selector.find( ":input[name=branchName]" ).valChange( item.branchName );
			that.selector.find( ":input[name=branchLevel]" ).valChange( item.branchLevel );
			that.selector.find( ":input[name=longAddr]" ).valChange( item.longAddr );
			that.selector.find( ":input[name=latAddr]" ).valChange( item.latAddr );
			that.selector.find( ":input[name=branchScore]" ).valChange( item.branchScore ); 
			that.selector.find( ":input[name=branchTyp]" ).valChange( item.branchTyp );
			that.selector.find( ":input[name=branchSelf]" ).valChange( item.branchSelf );
			that.selector.find( ":input[name=branchAddr]" ).valChange( item.branchAddr ); 
			that.selector.find( ":input[name=contctPer]" ).valChange( item.contctPer ); 
			that.selector.find( ":input[name=contctDuty]" ).valChange( item.contctDuty ); 
			that.selector.find( ":input[name=contctTel]" ).valChange( item.contctTel ); 
			that.selector.find( ":input[name=acctNo]" ).valChange( item.acctNo ); 
			that.selector.find( ":input[name=acctName]" ).valChange( item.acctName ); 
			
			that.selector.find( ":input[name=openOrg]" ).valChange( item.openOrg ); 
			that.selector.find( ":input[name=bankNo]" ).valChange( item.bankNo ); 
			that.selector.find( ":input[name=bankName]" ).valChange( item.bankName ); 
			that.selector.find( ":input[name=signContr]" ).valChange( item.signContr ); 
			
			that.selector.find( ":input[name=signContr]" ).valChange( item.signContr ); 
			that.selector.find( ":input[name=signDate]" ).valChange( item.signDate ); 
			that.selector.find( ":input[name=stat]" ).valChange( item.stat ); 
			that.selector.find( ":input[name=blckListFlag]" ).valChange( item.blckListFlag ); 
			that.selector.find( ":input[name=blckListDesc]" ).valChange( item.blckListDesc ); 
//			that.selector.find( ":input[name=repayNo]" ).disabled( true );
			that.selector.find( ":input[name=branchNo]" ).readonly( true );
		};
		
		/** 保存*/
		handlers.save = function() {
			var that = this.global();
			//验证
			if ( !that.vars.validator.form() ) return;
			//所在地区
			var  validCiry = that.selector.find("input[name='validCiry']").parent().find("div.level-item-value input:eq(0)").val();
			if(!validCiry){
				that.selector.find( "input[name=validCiry]" ).validErrorTip("不能为空");
				return;
			}else{
				that.selector.find( "input[name=validCiry]" ).validErrorTip("");
			}
			//开户行所在地
			var  openArea = that.selector.find("input[name='openArea']").parent().find("div.level-item-value input:eq(0)").val();
			if(!openArea){
				that.selector.find( "input[name=openArea]" ).validErrorTip("不能为空");
				return;
			}else{
				that.selector.find( "input[name=openArea]" ).validErrorTip("");
			}
			
			var data = that.selector.find( "form" ).serialize();
			that.loading.show(); 
			$.ajax( {
				url: "operate/channel/bizchannel/save",
				type: "POST",
				data: data,
				complete: function() {
					that.loading.hide();
				},
				success: function( data ) {
					if ( !data.success ) {
						return message.error( data.msg );
					}
					message.success( data.msg );
					that.close( data );
				}
			} );
		};
	};
	
	return Global;
});