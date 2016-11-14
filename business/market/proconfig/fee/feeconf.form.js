define(function (){
	function Global( vars ){
		var $ = require( "jquery" )
		, base = require( "app/base" )
		, message = base.message
		, tools = base.tools;
		var moment = require( "moment" );
		base.code.cache( "branch_grp_type,First_Pay_Type,Is_No,Repay_Num" );
		
		var that = this;
		var vars = that.vars = $.extend( true, {}, vars );
		var handlers = that.handlers = {};//处理程序
		handlers.global = function() { return that; };
		
		that.init = function() {
			this.layout(); 
			this.load();
		};
		
		//初始化远程请求处理
		that.load = function() {
			var that = this.global();
			that.handlers.load();
		};
		
		that.layout = function (){
			var that = this.global();
			/*base.code.getCacheByCallBack("Repay_Num","__default__",function (code){
				that.selector.find( "#divideInt" ).nextAll().remove();
				var iniRoot = that.selector.find( "#divideInt" );
				$.each(code,function (i,obj){
					var divide = obj.valName;
					var html_ = "<button type='button' class='btn btn-default divide' id="+divide+"><i class='fa fa-square-o grid-ui-check'></i> "+divide+"</button>";
					$(html_).insertAfter(iniRoot);
					iniRoot = $("button.divide").nextAll().andSelf()[0];
				});
			});*/
			that.selector.find( ".input" ).input( {} );
			
			that.selector.find("#addBtn").bind('click',function (event){
				that.handlers.openFeelItem();
			});
			that.selector.find("#delBtn").bind('click',function (event){
				var selectFeelItems = that.vars.selectProGrid.selectedRows();
				that.handlers.deleteFeelItem( selectFeelItems );
			});
			that.selector.find( "#feeCloseBtn" ).bind('click',function (event){
				that.close();
				return false;
			});
			//期数样式控制
			that.selector.find( ".divide" ).bind( "click", function( event ) {
				that.handlers.toggle($(this));
			} );
			
			that.layoutSelectFeeItems();
			that.handlers.layoutDivideGrid();
		};
		
		
		
		/**
		 * 初始化已选的费用项
		 */
		that.layoutSelectFeeItems = function (){
			var that = this.global();
			var config = {
				sort:false,
				remote: {
		        	url: "market/proconfig/fee/selectByProduct",
		            params: {},
		            async:false,
		            callback:function (data){
		            	return data;
		            }
		        },
		        multi: true,
		        page: false,
		        plugins: [],
		        events: {
		        	loaded: //加载完毕调用
		        	{ 
			       		data: {}, 
			       		handler: function (event, items) {
			       			
			       		}
		       	    }
		        },
		        customEvents: []
			};
			
			config.cols = cols = [];
			cols[ cols.length ] = { title: "费用编码", name: "feeNo", width: "250px",lockWidth: true };
			cols[ cols.length ] = { title: "费用项", name: "feeName", width: "250px",lockWidth: true };
			cols[ cols.length ] = { title: "客户选择", name: "isSel", width: "100px",lockWidth: true, align:'center',renderer: function( val, item, rowIndex ) {
				var claName = item.isSel=="13900002"?"否":"是";
				var cla = item.isSel=="13900002"?"off":"on";
				return format( [ '<a href="javascript:;" class="pro-toggle isSelStatus"><i class="fa fa-toggle-'+cla+'"></i> '+claName+' </a>' ] );
			}};
			cols[ cols.length ] = { title: "优先级", name: "setlPrior", width: "80px",lockWidth: true, align:'center'};
			cols[ cols.length ] = { title:"操作",name:"setlPrior", width: "100px",lockWidth: true, align:'center', renderer:function (val, item, rowIndex){
				return format( [ '<a href="javascript:;" class="pro-toggle-up"><i class="fa fa-long-arrow-up"></i>上移</a>&nbsp;<a href="javascript:;" class="pro-toggle-down"><i class="fa fa-long-arrow-down"></i>下移</a>' ] );
			}};
			config.remote.params["params[prodNo]"] = $( "#prodNo" ).val();
			config.events.click = {
				handler: function( event, item, rowIndex ) {}
			};
			config.customEvents.push( 
			 {
				target: ".pro-toggle-up",
				handler: function( event, item, rowIndex ) {
					that.handlers.toggleUp(item,rowIndex);
					return false;
				}
			 },
			 {
				 target: ".pro-toggle-down",
				 handler: function( event, item, rowIndex ) {
					that.handlers.toggleDown(item,rowIndex);
					return false;
				 } 
			 },
			 {
				target: ".isSelStatus",
				handler: function( event, item, rowIndex ) {
					that.handlers.toggleOnOrOff(item, rowIndex);
					return false;
				}
			 });
			
			that.vars.selectProGrid = that.selector.find( "#selectProGrid" ).grid( config );//renderer
		};//end
		
		/**
		 * 业务逻辑处理
		 */
		handlers.layoutDivideGrid = function (){
			var that = this.global();
			//加载头部  已选的费用项数据
			var selectFeelItems = [];
			that.loading.show();
			$.ajax({
				url: "market/proconfig/fee/selectByProduct",
				type: "POST",
				async:false,
				data: {'params[prodNo]':$( "#prodNo" ).val()},
				success: function( data ) {
					selectFeelItems = data.list;
				}
			});
			if(selectFeelItems.length<=0){
				that.loading.hide();
				return ;
			}
			$("#feelGrid").html("<table id='feelItem'><caption></caption></table>");
			var config = {
				sort:false,
				remote: {
		        	url: "market/proconfig/fee/selectFeelList",
		            params: {},
		            callback:function (data){
		            	return data;
		            }
		        },
		        multi: false,
		        page: false,
		        checkCol: false,
		        indexCol:false,
		        events: {
		        	loaded:{
		        		data:{},
		        		handler:function (event, items){
		        			that.selector.find( ".itemVal" ).bind("change",function (event){
		        				that.handlers.divideInputChange($(this));
		        			});
		        			that.selector.find( ".itemVal" ).bind("click",function (event){
		        				$(this).focus();
		        			});
		        			that.loading.hide();
		        		}
		        	}
		        },
		        customEvents: []
			};
			config.cols = cols = [];
			cols[ cols.length ] = { title: '期数', name: "divideNo", width: "60px",lockWidth:true};
			$.each(selectFeelItems,function (index,item){
				cols[ cols.length ] = { title: item.feeName, name: item.feeNo, width: "100px",align:'center',renderer:function (val, row, rowIndex){
					if(typeof(val) == 'undefined'){
						val = '0';
					}
					if(val == 'null'){
						val = '0';
					}
					//占比 还是 值
					var First_Pay_Type = '';
					if(item.feeValType == '16400001'){
						First_Pay_Type = '%';
					}
					return format(['<input type="text" style="width: 80px;" value='+val+' class="itemVal"  name='+item.feeNo+' index='+rowIndex+' />   '+First_Pay_Type ]);
				}};
			});
			config.remote.params["params[prodNo]"] = $( "#prodNo" ).val();
			that.vars.gridVarDivide = that.selector.find( "#feelItem" ).grid( config );//renderer
		};
		handlers.load = function (){
			var prodNo = $( "#prodNo" ).val();
			$.ajax({
				url: "market/proconfig/fee/getDivideNum",
				type: "POST",
				data: {'prodNo':$( "#prodNo" ).val()},
				success: function( data ) {
					if ( !data.success ) {
						return message.error( data.msg );
					}
					$.each(data.list,function (i,item){
						var obj = $('#'+item);
						obj.addClass('active');
						obj.find('i:eq(0)').addClass('fa-check-square');
					});
				}
			});
		};
		
		handlers.openFeelItem = function (){
			var that = this.global();
			//判断产品当前状态
			var prodStat = $("#prodStat").val();
			if(prodStat == '16500002'){
				return message.error( '产品销售中...禁止操作' );
			}
			var item = new Object();
			item.prodNo = $( "#prodNo" ).val();
			that.modal.open( {
				title: "产品-费用项管理 | 待选费用项",
				url: "market/proconfig/fee/feelForm",
				size: "modal-lg",
				params: item,
				events: {
					hiden: function( closed, data ) {
						that.vars.selectProGrid.load();
						that.handlers.layoutDivideGrid();
					}
				}
			} );
		};
		
		/**
		 * 删除所选的费用项
		 */
		handlers.deleteFeelItem = function ( items ){
			if ( items == null || items.length == 0 ) {
				return message.error( "请选择至少一条操作数据。" );
			}
			//判断产品当前状态
			var prodStat = $("#prodStat").val();
			if(prodStat == '16500002'){
				return message.error( '产品销售中...禁止操作' );
			}
			var feeNos = new Array();
			$.each( items, function( index, item ) {
				feeNos.push( item.feeNo );
			} ); 
			
			var prodNo = that.selector.find( "#prodNo" ).val();
			
			that.dialog.confirm("确定删除选择的[ " + feeNos.length + " ]条数据？",function ( event, index ){
				if ( index == 1 ) return false;
				that.loading.show();
				$.ajax( {
					url: "market/proconfig/fee/deleteFeel",
					type: "POST",
					data: {'feeNos':feeNos,'prodNo':$( "#prodNo" ).val()},
					success: function( data ) {
						if ( !data.success ) {
							return message.error( data.msg );
						}
						message.success( data.msg );
						that.vars.selectProGrid.load();
						that.handlers.layoutDivideGrid();
						that.loading.hide();
					}
				} );
			});
			
		};
		/**
		 * 设置已选费用项客户选择状态
		 */
		handlers.toggleOnOrOff = function (item, rowIndex){
			var that = this.global();
			//判断产品当前状态
			var prodStat = $("#prodStat").val();
			if(prodStat == '16500002'){
				return message.error( '产品销售中...禁止操作' );
			}
			if(!item.isSel){
				item.isSel = '13900002';
			}
			else if(item.isSel == '13900002'){
				item.isSel = '13900001'
			}
			else{
				item.isSel = '13900002';
			}
			
			$.ajax({
				url: "market/proconfig/fee/updateCustIsSelStatus",
				async:false,
				type: "POST",
				contentType:"application/json",
				data: JSON.stringify(item),
				success: function( data ) {
					if ( !data.success ) {
						return message.error( data.msg );
					}
					dataMap =  data.map;
				}
			});
			that.vars.selectProGrid.load();
		};
		
		/**
		 * 上移
		 */
		handlers.toggleUp = function (item,rowIndex){
			var that = this.global();
			//判断产品当前状态
			var prodStat = $("#prodStat").val();
			if(prodStat == '16500002'){
				return message.error( '产品销售中...禁止操作' );
			}
			if(rowIndex == 0){
				return true;
			}
			var row = that.vars.selectProGrid.getRow(rowIndex - 1)[0];
			var prvFeeNo = row.feeNo;
			var nextFeeNo = item.feeNo;
			var prodNo = $( "#prodNo" ).val();
			that.loading.show();
			$.ajax({
				url: "market/proconfig/fee/sortFeelItem",
				async:false,
				type: "POST",
				data: {'prvFeeNo':prvFeeNo,'nextFeeNo':nextFeeNo,'prodNo':prodNo},
				success: function( data ) {
					that.loading.hide();
					if ( !data.success ) {
						return message.error( data.msg );
					}
					that.vars.selectProGrid.load();
					
				}
			});
		};
		
		/**
		 * 下移
		 */
		handlers.toggleDown = function (item,rowIndex){
			var that = this.global();
			//判断产品当前状态
			var prodStat = $("#prodStat").val();
			if(prodStat == '16500002'){
				return message.error( '产品销售中...禁止操作' );
			}
			var length = that.vars.selectProGrid.getAllRows().length;
			if(rowIndex == length-1){
				return true;
			}
			var row = that.vars.selectProGrid.getRow(rowIndex + 1)[0];
			var prvFeeNo = item.feeNo;
			var nextFeeNo = row.feeNo;
			var prodNo = $( "#prodNo" ).val();
			that.loading.show();
			$.ajax({
				url: "market/proconfig/fee/sortFeelItem",
				async:false,
				type: "POST",
				data: {'prvFeeNo':prvFeeNo,'nextFeeNo':nextFeeNo,'prodNo':prodNo},
				success: function( data ) {
					that.loading.hide();
					if ( !data.success ) {
						return message.error( data.msg );
					}
					that.vars.selectProGrid.load();
				}
			});
		};//end 下移
		
		
		/**
		 * 期数样式控制
		 */
		handlers.toggle = function ( obj ){
			var that = this.global();
			//判断产品当前状态
			var prodStat = $("#prodStat").val();
			if(prodStat == '16500002'){
				return message.error( '产品销售中...禁止操作' );
			}
			that.loading.show();
			var divideNo = $.trim(obj.text());
			var prodNo = $( "#prodNo" ).val();
			if(obj.hasClass('active')){
				obj.removeClass('active');
				obj.find('i:eq(0)').removeClass('fa-check-square');
				$.ajax({
					url: "market/proconfig/fee/updateDivideNum",
					async:false,
					type: "POST",
					data: {'divideNum':divideNo,'prodNo':prodNo,'action':'delete'},
					success: function( data ) {
						if ( !data.success ) {
							return message.error( data.msg );
						}
						that.vars.selectProGrid.load();
						that.handlers.layoutDivideGrid();
					}
				});
			}
			else{
				obj.addClass('active');
				obj.find('i:eq(0)').addClass('fa-check-square');
				$.ajax({
					url: "market/proconfig/fee/updateDivideNum",
					async:false,
					type: "POST",
					data: {'divideNum':divideNo,'prodNo':prodNo,'action':'add'},
					success: function( data ) {
						if ( !data.success ) {
							return message.error( data.msg );
						}
						that.vars.selectProGrid.load();
						that.handlers.layoutDivideGrid();
					}
				});
			}
			that.loading.hide();
		};//end 样式控制
		
		/**
		 * 初始化 分期按钮样式
		 */
		handlers.loadDivideStyle = function (items){
			if(items.length<0){
				return false;
			}
			var that = this.global();
			$.each(items,function (i,item){
				var divideNo = item.divideNo;
				var obj = $('#'+divideNo);
				obj.addClass('active');
				obj.find('i:eq(0)').addClass('fa-check-square');
				
			});
			
		};//end
		
		
		//期数表中数据改变调用方法
		handlers.divideInputChange = function ( obj ){
			var that = this.global();
			//判断产品当前状态
			var prodStat = $("#prodStat").val();
			if(prodStat == '16500002'){
				return message.error( '产品销售中...禁止操作' );
			}
			var index = parseInt(obj.attr('index'));
			var feeNo = obj.attr('name');
			var value = obj.val();
			if(!(/^[-\+]?\d+$/.test(value)) && !(/^[-\+]?\d+(\.\d+)?$/.test(value))){
				var item = that.vars.gridVarDivide.getRow(index)[0];
				item[feeNo] = 0;
				that.vars.gridVarDivide.updateRows(item,index);
				return message.error( "输入的费用值不正确，只能输入整数或者小数。" );
			}
			var item = that.vars.gridVarDivide.getRow(index)[0];
			var divideNum = item.divideNo;
			var prodNo = $("#prodNo").val();
			var feeVal = value;
			$.ajax({
				url: "market/proconfig/fee/updateDivideFeelValue",
				async:false,
				type: "POST",
				data: {'divideNum':divideNum,'prodNo':prodNo,'feeNo':feeNo,'feeVal':feeVal},
				success: function( data ) {
					if ( !data.success ) {
						return message.error( data.msg );
					}
					that.handlers.layoutDivideGrid();
				}
			});
		};
		
	};
	
	
	
	return Global;
});