function Global( vars ) {
	var base = this.base,
		code = base.code,
		tools = base.tools,
		format = tools.format;
	
	var parentThat = this.parent;
	
	var that = this;
	var vars = this.vars = {};//全局变梁
	var handlers = this.handlers = {};//处理程序
	handlers.global = function() { return that; };
	this.selector = $( "body" );
	
	var myflow = $.myflow;
	
	/* 工作流码表缓存 依赖APPUI2.0(bee) */
	myflow.editors.dynamicSelectCodeEditor = function( type, defaultValue ) {
		
		if ( typeof defaultValue != "string" ) defaultValue = ""; 
		
		this.init = function( props, k, div, src, r ) {
			this.props = props; this.k = k; this.div = div, this.src = src, this.r = r;
			var that = this;
			var value = props[ k ].value;
			if ( typeof value != "string" || value.length == 0 ) {
				value = props[ k ].value = defaultValue;
			}
			
			var input = this.input = $( '<select  style="width:100%;"></select>' )
				.val( props[ k ].value )
				.change( function() {
					that.props[ that.k ].value = $( this ).val();
					if(that.k == "nodeKind")
						document.getElementById("nodeTypeId" ).value = that.props[ that.k ].value;
//					alert(that.k + "[" + that.props[ that.k ].value + "]");
				} )
				.appendTo( '#'+ div );
	
			code.getCacheByCallBack( type, "__default__", function( codes ) {
				var htmls = [];
				htmls.push( format( '<option value="">选择</option>', "") );
				var selectIndex = 0;
				for ( var index = 0; index < codes.length; index++ ) {
					if ( codes[ index ].valCode == that.props[ k ].value ) {
						selectIndex = index + 1;
					}
					htmls.push( format( '<option value="{valCode}">{valName}</option>', codes[ index ] ) );
				}
				
				that.input.append( htmls.join( "" ) );
				that.input.val( that.props[ that.k ] );
				that.input.find( "option" ).eq( selectIndex ).attr("selected",true);
			}, window, 1 );
		};
		
		this.destroy = function() {
			var that = this;
			$( '#' + this.div + ' input' ).each( function() {
				that.props[ that.k ].value = $( this ).val();
			} );
		};
	};
	
	
	var ConfigDefault = {
		multi: false,
		limit: ",",
		multiKey: "multi",
		limitKey: "limit",
		paramKey: "paramValue",
		labelKey: "label",
		valueKey: "value",
		orgUserRoleKey:"orgUserRole",
		orgUserRole:""
	};
	
	myflow.editors.dynamicSelectPopupEditor = function( url, config ) {
		
		this.config = $.extend( true, {}, ConfigDefault, config );
		
		this.init = function( props, k, div, src, r ) {
			var k2 = this.k2 = k + "_label";;
			if ( typeof props[ k2 ] == "undefined" ) {
				props[ k2 ] = { value: "" };
			}
			this.props = props; this.k = k; this.div = div, this.src = src, this.r = r;
			
			var that = this;
			
			var $div = $( '#'+ div ).addClass( "select-popup" );
			
			var show = this.show = $( '<input type="text" readonly="readonly" class="readonly 12"/>' ).appendTo( $div );
			
			var input = this.input = $( '<input type="hidden"/>' )
				.val( props[ k ].value )
				.change( function() {
					that.props[ that.k ].value = $( this ).val();
					that.props[ that.k2 ].value = that.show.val();
				} ).appendTo( $div );
			
			var btn = this.btn = $( '<button type="button" class="btn btn-default">选择</button>' ).appendTo( $div );
			
			input.val( that.props[ that.k ].value );
			show.val( that.props[ that.k2 ].value );
			
			
			var params = {};
			params[ that.config.multiKey ] = that.config.multi;
			params[ that.config.limitKey ] = that.config.limit;
			params[ that.config.orgUserRoleKey ] = that.config.orgUserRole;
			
			var _label = "";
			if(that.config.orgUserRole == "user")
				_label = that.props.assignee.label;
			if(that.config.orgUserRole == "org")
				_label = that.props.orgCode.label;
			if(that.config.orgUserRole == "role")
				_label = that.props.roleCode.label;
			
			this.btn.bind( "click", function() {
				debugger;
				var nodeTypeId = document.getElementById("nodeTypeId" ).value;
				if(k == "conditionVal" || (k == "orgCode" && (nodeTypeId == "17300001" || nodeTypeId == "17300002" || nodeTypeId == "17300003")))
				{
					params[ that.config.multiKey ] = false;
					that.config.multi = false;
					if(k == "conditionVal")
						params[ "conditionVal" ] = that.props[ that.k ].value;
				}
				else
				{
					params[ that.config.multiKey ] = true;
					that.config.multi = true;
				}
				
				params[ that.config.paramKey ] = that.input.val();
				parentThat.modal.open( {
					title: "选择" + _label,
					url: url,    // 公用
					params: params,
					events: {
						hiden: function( closed, data ) {
							if ( !closed ) return;
							
							if ( that.config.multi ) {
								if ( !( typeof data == "object" &&  $.isArray(data ) ) ) {
									return base.message.error( "多选必选返回数据组，可以为空数组" );
								}
								var items = data, item, labels = [], values = [];
								for ( var index = 0; index < items.length; index++ ) {
									item = items[ index ];
									labels.push( item[ that.config.labelKey ] || "" );
									values.push( item[ that.config.valueKey ] || "" );
								}
								
								that.show.val( labels.join( that.config.limit ) );
								that.input.val( values.join( that.config.limit ) );
								
								that.props[ that.k2 ].value = labels.join( that.config.limit );
								that.props[ that.k ].value = values.join( that.config.limit ); 
								
								return;
							}
							
							//单选
							if ( typeof data != "object"  ) {
								data = {};
							}
							
							if ( $.isArray( data ) ) data = data[ 0 ];
							
							var item = data;
																			
							that.show.val( item[ that.config.labelKey ] || "" );
							that.input.val( item[ that.config.valueKey ] || "" );
							
							that.props[ that.k2 ].value = item[ that.config.labelKey ];
							that.props[ that.k ].value = item[ that.config.valueKey ];
						}
					}
				} );
			} );
			
		};
		
		this.destroy = function() {
			var that = this;
			$( '#' + this.div + ' input' ).each( function() {
				that.props[ that.k ].value = $( this ).val();
			} );
		};
	};
	
	
	this.init = function(val) {
		this.layout(val);
	};
	
	this.layout = function(val) {
		var that = this;
		that.selector.find( '#myflow' ).myflow( {
			basePath : "/loan/",
			restore : eval("(" + val + ")"),
			tools : {
				save : {
					onclick : function(data) {
//						alert('save:\n' + data);
						parentThat.savedata( data );
					}
				}
			}
		});
		
	}
};