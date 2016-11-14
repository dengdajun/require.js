define(function () {

    function Global( vars ) {

        //=======================================================
        //获取基础组件
        //=======================================================
        var $ = require( "jquery" )
            , base = require( "app/base" )
            , message = base.message
            , tools = base.tools
            , code = base.code;
        var moment = require( "moment" );

        //缓存码值
        code.cache( "Prod_Type","Open_Org","Cert_Area_No","Data_Source" );

        //=======================================================
        //当前组件
        //=======================================================
        var that = this;
        var condition = null;
        var vars = that.vars = $.extend( true, {}, vars );//全局变梁
        var handlers = that.handlers = {};//处理程序
        handlers.global = function() { return that; };

        //组件入口函数  相当于java.main
        that.init = function() {
            this.layout();
        };

        //页面布局
        that.layout = function() {
            var that = this.global();//获取组件的全局对象
            that.selector.find( ".input" ).input( {} );

            that.selector.find( "input[name=begIntDate]" ).datetimepicker( {
                format: 'YYYYMMDD'
            } );
            that.selector.find( "input[name=dueDate]" ).datetimepicker( {
                format: 'YYYYMMDD'
            } );
            that.selector.find( "input[name=reqDate]" ).datetimepicker( {
                format: 'YYYY-MM-DD'
            } );

            //绑定导出按钮
            that.selector.find( "#exportBtn" ).click( function(event) {
                that.handlers.exportForm();
                return false;
            });


            //缓存查询条件
            that.selector.find( "#caccfundreqGrid" ).on( "click","#queryBtn",function(){
                condition = that.selector.find( "form" ).serialize();
            } );

            var config = {
                remote: {
                    url: "operate/channel/caccfundreq/list",
                    params: {}
                },
                multi: false,
                page: true,
                query: {
                    isExpand:true,
                    target: that.selector.find( ".grid-query" )
                },
                plugins: [],
                events: {},
                customEvents: []
            };
            config.cols = cols = [];
            cols[ cols.length ] = {title:"姓名", name:"custName", width:"100px", lockWidth:true, style:"text-align: center"};
            cols[ cols.length ] = {title:"证件号码", name:"certNo", width:"160px", lockWidth:true, style:"text-align: center"};
            cols[ cols.length ] = {title:"手机号码", name:"phoneNo", width:"130px", lockWidth:true, style:"text-align: center"};
            cols[ cols.length ] = {title:"签约日期", name:"reqDate", width:"130px", lockWidth:true, style:"text-align: center",
            		renderer:function(val,item,rowIndex){
                        if(val){
                            return moment(val).format("YYYY-MM-DD");
                        }
                    }
            };
            cols[ cols.length ] = {title:"合同号", name:"contractNo", width:"160px", lockWidth:true, style:"text-align: center"};
            cols[ cols.length ] = {title:"贷款本金", name:"loanAmt", width:"100px", lockWidth:true, style:"text-align: center"};
            cols[ cols.length ] = {title:"起息日", name:"begIntDate", width:"130px", lockWidth:true, style:"text-align: center",
                renderer:function(val,item,rowIndex){
                    if(val){
                        return moment(val).format("YYYY-MM-DD");
                    }
                }
            };
            cols[ cols.length ] = {title:"到期日", name:"dueDate", width:"130px", lockWidth:true, style:"text-align: center",
                renderer:function(val,item,rowIndex){
                    if(val){
                        return moment(val).format("YYYY-MM-DD");
                    }
                }
            };
            cols[ cols.length ] = {title:"分期期数", name:"instNum", width:"90px", lockWidth:true, style:"text-align: center"};
            cols[ cols.length ] = {title:"还款方式", name:"repayKind", width:"100px", lockWidth:true, style:"text-align: center"};
            cols[ cols.length ] = {title:"首次还款日", name:"fstRepayDate", width:"100px", lockWidth:true, style:"text-align: center",
                renderer:function(val,item,rowIndex){
                    if(val) {
                        return moment(val).format("YYYY-MM-DD");
                    }
                }
            };
            cols[ cols.length ] = {title:"代扣日期", name:"deductDate", width:"100px", lockWidth:true, style:"text-align: center",
                renderer:function(val,item,rowIndex){
                    if(val) {
                        return moment(val).format("YYYY-MM-DD");
                    }
                }
            };
            cols[ cols.length ] = {title:"月还款金额", name:"mthRepayAmt", width:"100px", lockWidth:true, style:"text-align: center"};
            cols[ cols.length ] = {title:"经销商名称", name:"branchName", width:"200px", lockWidth:true, style:"text-align: center"};
            cols[ cols.length ] = {title:"商品名称", name:"goodsName", width:"200px", lockWidth:true, style:"text-align: center"};
            cols[ cols.length ] = {title:"价格", name:"pric", width:"70px", lockWidth:true, style:"text-align: center"};
            cols[ cols.length ] = {title:"首付金额", name:"fstPayAmt", width:"70px", lockWidth:true, style:"text-align: center"};
            cols[ cols.length ] = {title:"合同金额", name:"contractAmt", width:"70px", lockWidth:true, style:"text-align: center"};
            cols[ cols.length ] = {title:"放款金额", name:"payAmt", width:"70px", lockWidth:true, style:"text-align: center"};

            //cols[ cols.length ] = {title:"贷款编号", name:"loanNo", width:"200px", lockWidth:true, style:"text-align: center"};
            //cols[ cols.length ] = { title: "客户姓名", name: "custName", width: "70px", lockWidth: true , style:"text-align: center"};
            //cols[ cols.length ] = { title: "逾期开始日期", name: "beginDate", width: "100px", lockWidth: true , style:"text-align: center",
            //    renderer:function(val,item,rowIndex){return moment(val).format("YYYY-MM-DD");}
            //};
            //cols[ cols.length ] = { title: "逾期结束日期", name: "endDate", width: "100px", lockWidth: true , style:"text-align: center",
            //    renderer:function(val,item,rowIndex){return moment(val).format("YYYY-MM-DD");}
            //};
            //cols[ cols.length ] = { title: "扣款银行", name: "openOrg", width: "150px", lockWidth: true , style:"text-align: center",
            //    renderer:function(val,item,rowIndex){return base.code.getText("Open_Org",val);}
            //};

            that.vars.gridVar = that.selector.find( "#caccfundreqGrid" ).grid( config );//renderer
        };


        //=======================================================
        //业务逻辑申明
        //=======================================================
        //加载贷款信息的展示页面
        handlers.query = function(items){
            
        };
        
        handlers.exportForm = function (){
        	that.modal.open( {
                title: "导出请款单文件",
                url: "operate/channel/caccfundreq/exportForm",
                size: "modal-md",
                params:{},
                events: {
                    hiden: function( closed, data ) {
                        that.vars.gridVar.load();
                    }
                }
            } );
        };

        //导出
        handlers.export = function(){
            var params = condition;
            url = "operate/channel/caccfundreq/export?params="+params;
            if(!document.getElementById( "_filedown_")){
                var downWindow = document.createElement( 'iframe');
                downWindow.width = '0';
                downWindow.height = '0';
                downWindow.name = "_filedown_";
                downWindow.id = "_filedown_";
                downWindow.src =  url;
                document.body.appendChild(downWindow);
            }else{
                document.getElementById( "_filedown_").src = url;
            }
        };

    };
    return Global;

} );