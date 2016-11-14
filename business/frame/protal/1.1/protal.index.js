define([
"frame/protal/1.1/protal.core",
"call",
"css2!business/frame/protal/1.1/protal.index"
],function() {
			var $ = require("jquery"), base = require("app/base"), message = base.message, tools = base.tools;
			//var call = require("call");
			function Global() {
				var that = this;
				this.namespace = "protal.index";
				// this.content = "#protalSection";
				var handlers = this.handlers = {};

				var loginName = document.getElementById("loginName").value;
				var userName = document.getElementById("userName").value;

				handlers.global = this.global = function() {
					return that;
				};

				this.init = function() {
					this.layout();
				};

				this.layout = function() {
					var that = this.global();

					that.selector.find(".nav-tools-search")
							.bind(
									"click",
									function(event) {
										that.selector.find("#mainSerach")
												.slideToggle();
									});

					that.selector.find(".nav-tools-password").bind("click",
							function(event) {
								that.handlers.modifyPassword();
							});

					that.selector.find(".nav-tools-logout").bind("click",
							function(event) {
								that.handlers.logout();
							});

					// 未登录监听
					$(document).bind("request.ajax.error.510", function(event) {
						that.handlers.loginForm();
					});

					// 审批状态修改
					that.selector.find(".appr-drag").drag({
						'css' : {
							'left' : document.body.clientWidth - 50
						}
					});
					
					
					// 判读登陆人员是否属于审批类型
					$.ajax({
						url : "appro/state/loginType",
						type : "POST",
						data : {
							loginName : loginName
						},
						success : function(data) {
							if (data) {
								that.handlers.loginType();
							}
						}
					});
					// 文本内容分别是：sign 签到 ready 就绪 leave 离开 sign 下线
					
//					var sta = "true"; //阻止重复添加审批中记录
					// 当登陆人员角色类型为审批类型这执行方法
					handlers.loginType = function() {
						// 取消隐藏
						$(".text-div").removeClass("state");
						$.ajax({
							url : "appro/state/list",
							type : "POST",
							data : {
								loginName : loginName,
								userName : userName
							},
							success : function(data) {
								
								if (data == "23700001") {
									$(".qiandao").html("已就绪");
									$(".ready").html("已就绪");
									$(".sign").html("已签到");
									$(".leave").html("离开");
									$(".coil").html("下线");
								} else if (data == "23700002") {
									$.ajax({
										url : "appro/state/update",
										type : "POST",
										data : {
											staff : data,
											loginName : loginName
										},
										success : function(data) {
											if(data){
												$(".qiandao").html("审批中");
												$(".ready").html("就绪");
												$(".sign").html("已签到");
												$(".leave").html("离开");	
												$(".coil").html("下线");
											}
										}	
									});
									
								} else if (data == "23700003") {
									$(".qiandao").html("已签到");
									$(".ready").html("就绪");
									$(".sign").html("已签到");
									$(".leave").html("离开");	
									$(".coil").html("下线")
								} else if (data == "23700004") {
									$(".qiandao").html("请签到");
									$(".ready").html("就绪");
									$(".leave").html("离开");	
									$(".coil").html("已下线")
								} else if (data == "23700005") {
									$(".qiandao").html("已离开");
									$(".ready").html("就绪");
									$(".leave").html("恢复");
									$(".sign").html("已签到");
									$(".coil").html("下线")
								}

							}
						});
						
						var type  = "yes";
						setInterval(function() {
						$.ajax({
							url : "appro/state/list",
							type : "POST",
							data : {
								loginName : loginName,
								userName : userName
							},
							success : function(data) {
								if(data == "23700002"){
									if(type == "yes"){
										that.dialog.confirm("“亲，有新单子推进，请记得及时审批额O(∩_∩)O”", function(event,
												index) {
											$.ajax({
												url : "appro/state/update",
												type : "POST",
												data : {
													staff : data,
													loginName : loginName
												},
												success : function(data) {
													if(data){
														$(".qiandao").html("审批中");
														$(".ready").html("就绪");
														$(".sign").html("已签到");
														$(".leave").html("离开");	
														$(".coil").html("下线");
													}
												}	
											});
										});
									}
									type = "no";												
								}
								if($(".qiandao").text()	 == "已就绪"){
									
									type = "yes";
								}
								
							}
						});},30000);
								
						
						// 控制样式
						that.handlers.stateStyle();

						//用于控制连点
						var dbClick = 0;
						// 点击签到
						var clickSign = 0;
						$("#sign").click(function() {
							 if (clickSign == 0 && dbClick == 0) {  
								 clickSign = 1;  
								 dbClick = 1;
								 that.handlers.sign();
				                    setTimeout(function () { clickSign = 0; dbClick = 0}, 1000);  
				                }  
							
						});
						// 点击下线
						var clickCoil = 0;
						$("#coil").click(function() {
							 if (clickCoil == 0 && dbClick == 0) {  
								 clickCoil = 1;
								 dbClick = 1;
								 that.handlers.coil();
				                    setTimeout(function () { clickCoil = 0 ;dbClick = 0}, 1000);  
				                }  
							
						});
						// 点击离开
						var clickLeave = 0;
						$("#leave").click(function() {
							 if (clickLeave == 0 && dbClick == 0) {  
								 clickLeave = 1;  
								 dbClick = 1;
				                    that.handlers.leave();
				                    setTimeout(function () { clickLeave = 0;dbClick = 0 }, 1000);  
				                }  
						});
						// 点击就绪
						var clickReady = 0;
						$("#ready").click(function() {
							if (clickReady == 0 && dbClick == 0) {  
									clickReady = 1;  
									dbClick = 1;
									that.handlers.ready();
				                    setTimeout(function () { clickReady = 0;dbClick = 0 }, 1000);  
				              } 
							
						});

					};

					//校验密码是否到期
					that.handlers.loading();
				}
				
				// =======================================================
				// 业务逻辑申明
				// =======================================================
				handlers.stateStyle = function() {
					// 显示或隐藏状态栏
					$(".text-div").mouseover(function() {
						$(".text-div").addClass("state")
						$(".icons-div").removeClass("state")
					});
					// 鼠标在sig事件
					$("#sign").mouseover(function() {
						$(".sign").removeClass("state")
						$(".fa-check-circle").addClass("state");
					});
					// 鼠标离开sig事件
					$("#sign").mouseout(function() {
						$(".fa-check-circle").removeClass("state")
						$(".sign").addClass("state");
					});
					// 鼠标在ready事件
					$("#ready").mouseover(function() {
						$(".ready").removeClass("state")
						$(".fa-minus-circle").addClass("state");
					});
					// 鼠标离开ready事件
					$("#ready").mouseout(function() {
						$(".fa-minus-circle").removeClass("state")
						$(".ready").addClass("state");
					});

					// 鼠标在leave事件
					$("#leave").mouseover(function() {
						$(".leave").removeClass("state")
						$(".fa-clock-o").addClass("state");
					});
					// 鼠标离开leave事件
					$("#leave").mouseout(function() {
						$(".fa-clock-o").removeClass("state")
						$(".leave").addClass("state");
					});

					// 鼠标在coil事件
					$("#coil").mouseover(function() {
						$(".coil").removeClass("state")
						$(".fa-times-circle").addClass("state");
					});
					// 鼠标离开coil事件
					$("#coil").mouseout(function() {
						$(".fa-times-circle").removeClass("state")
						$(".coil").addClass("state");
					});

					$(".icons-div").mouseleave(function() {
						$(".text-div").removeClass("state");
						$(".icons-div").addClass("state")
					});

				}
				
				//点击下线
				handlers.coil = function() {
					$.ajax({
						url : "appro/state/list",
						type : "POST",
						data : {
							loginName : loginName
						},
						success : function(data) {
							if (data != "23700004") {
								if(data == "23700002"){
									message.error("还有未审批信息不能下线");
								}else{
									that.dialog.confirm("是否确定下线", function(event,
											index) {
										if (index == 0) {
											$.ajax({
												url : "appro/state/update",
												type : "POST",
												data : {
													staff : "23700004",
													loginName : loginName
												},
												success : function(data) {
													if (data) {
														$(".qiandao").html("请签到");
														$(".sign").html("签到");
														$(".ready").html("就绪");
														$(".leave").html("离开");
														$(".coil").html("已下线");
														message.success("已下线！！！");
													} else {
														message.error("下线失败！！！");
													}
												}
											});
										}
									});
								}
							}else{
								message.error("已经下线了！！！");
							}
						}
					});

				}
				// 离开事件
				handlers.leave = function() {
					$.ajax({
						url : "appro/state/list",
						type : "POST",
						data : {
							loginName : loginName
						},
						success : function(data) {
							if(data =="23700005"){
								$.ajax({
									url : "appro/state/getBefore",
									type : "POST",
									data : {
										staff : "23700005",
										loginName : loginName
									},
									success : function(type) {
										$.ajax({
											url : "appro/state/update",
											type : "POST",
											data : {
												staff : type,
												loginName : loginName
												
											},
											success : function(data) {
												if(data){
													$.ajax({
														url : "appro/state/list",
														type : "POST",
														data : {
															loginName : loginName
															
														},
														success : function(type) {
															if(type=="23700001"){
																$(".qiandao").html("已就绪");
																$(".ready").html("已就绪");
																$(".sign").html("已签到");
																$(".leave").html("离开");
																$(".coil").html("下线");
																message.success("已恢复为离开前状态：已就绪");
															}else if(type =="23700003"){
																$(".qiandao").html("已签到");
																$(".ready").html("就绪");
																$(".sign").html("已签到");
																$(".leave").html("离开");	
																$(".coil").html("下线");
																message.success("已恢复为离开前状态：已签到");
															}else if(type =="23700002"){
																$(".qiandao").html("审批中");
																$(".ready").html("就绪");
																$(".sign").html("已签到");
																$(".leave").html("离开");	
																$(".coil").html("下线");
																message.success("已恢复为离开前状态：审批中");
															}
															
														}	
													});
												}
												
											}
										});
									}
								});
							}else if(data =="23700004"){
								message.error("已下线，不能改为离开！！！");
							}else if(data =="23700002"){
								$.ajax({
									url : "appro/state/update",
									type : "POST",
									data : {
										staff : "23700002",
										loginName : loginName
									},
									success : function(data) {
										
									}
								});
								that.dialog.confirm("亲！还有未审批信息，是否确定离开", function(event,
										index) {
									if(index == 0){
										if(data){
												$.ajax({
													url : "appro/state/update",
													type : "POST",
													data : {
														staff : "23700005",
														loginName : loginName
													},
													success : function(data) {
														message.success("已离开！！！");
														$(".qiandao").html("已离开");
														$(".ready").html("就绪");
														$(".leave").html("恢复");
														$(".sign").html("已签到");
														$(".coil").html("下线")
													}
												});
										}
										
									}else {
										$.ajax({
											url : "appro/state/update",
											type : "POST",
											data : {
												staff : data,
												loginName : loginName
											},
											success : function(data) {
												if(data){
													$(".qiandao").html("审批中");
													$(".ready").html("就绪");
													$(".sign").html("已签到");
													$(".leave").html("离开");	
													$(".coil").html("下线");
												}
											}	
										});
									}
								});
							}else{
								$.ajax({
									url : "appro/state/update",
									type : "POST",
									data : {
										staff : "23700005",
										loginName : loginName
									},
									success : function(data) {
										message.success("已离开！！！");
										$(".qiandao").html("已离开");
										$(".ready").html("就绪");
										$(".leave").html("恢复");
										$(".sign").html("已签到");
										$(".coil").html("下线")
									}
								});
							}
						
						}
					})

				}
				//就绪事件
				handlers.ready = function() {
					$.ajax({
						url : "appro/state/list",
						type : "POST",
						data : {
							loginName : loginName,
							userName : userName
						},
						success : function(data) {
							if (data == "23700001") {
								message.error("已就绪，不需要就绪了！！！");
							} else if(data == "23700003"){
								$.ajax({
									url : "appro/state/update",
									type : "POST",
									data : {
										staff : "23700001",
										loginName : loginName
									},
									success : function(data) {
										message.success("已就绪！！！");
										$(".qiandao").html("已就绪");
										$(".ready").html("已就绪");
										$(".sign").html("已签到");
										$(".leave").html("离开");
										$(".coil").html("下线");
									}
								});
							}else if(data == "23700004"){
								message.error("已下线，不能更改为就绪状态！！！");
							}else if(data =="23700002"){
								message.error("审批中，不能更改为就绪状态！！！");
							}else if(data =="23700005"){
								message.error("已离开，不能更改为就绪状态！！！");
							}
								
						}
					});

				}
				//签到时间
				handlers.sign = function() {
				$.ajax({
					url : "appro/state/list",
					type : "POST",
					data : {
						loginName : loginName
					},
					success : function(data) {
						if (data == "23700004") {
							$.ajax({
								url : "appro/state/update",
								type : "POST",
								data : {
									staff : "23700003",
									loginName : loginName
									
								},
								success : function(data) {
									if (data) {
										message.success("签到成功");
										$.ajax({
										url : "appro/state/list",
										type : "POST",
										data : {
											loginName : loginName,
										},
										success : function(data) {
											$(".qiandao").html("已签到");
											$(".ready").html("就绪");
											$(".sign").html("已签到");
											$(".leave").html("离开");	
											$(".coil").html("下线")
										}
									});
									}else{
										message.error("未签到，请先签到");
									}
								}
							});
						} else {
							message.error("已签到！不能重复签到");
						}
					}
				});

				};

				

				

				handlers.loginForm = function() {
					var that = this.global();
					that.modal.open({
						title : "用户登录",
						size : "modal-md",
						style : "width: 600px;",
						url : "frame/login/form",
						closeBtn : false,
						events : {
							hiden : function(closed, data) {
								message.success("登录成功， 马上跳转...");
								setTimeout(function() {
									window.location.reload(true);
								}, 500);
							}
						}
					});
				};

				handlers.modifyPassword = function() {
					var that = this.global();
					that.modal.open({
						title : "修改密码",
						size : "modal-md",
						url : "frame/protal/modifyPassword"
					});
				};

				handlers.logout = function() {
					var that = this.global();
					that.dialog.confirm("确认用户注销?", function(event, index) {
						if (index == 0) {
							$.ajax({
								url : "frame/logout",
								type : "POST",
								success : function(data) {
									if (!data.success) {
										return message.error(data.msg);
									}
									message.success("用户注销成功，马上跳转...");
									setTimeout(function() {
										window.location.reload(true);
									}, 700);
								},
								dataType : "json"
							});
						}
					});
				};
				
				//密码到期强制修改
				handlers.loading = function() {
					$.ajax( {
						url: "frame/protal/enforcementModifyPwd",
						type: "POST",
						success: function ( data ) {
							//true强制修改密码,否则不进行密码强制修改
							if ("true"== data.msg) {
								var t = {
									duration:"true"	
								}
								that.modal.open( {
									title: "密码已到期,请先修改密码",
									size: "modal-md",
									params: {item: t},
									url: "frame/protal/modifyPassword"
								} );
							}
						
						},
						dataType: "json"
					} );
					
					
				}
				
			}
			return Global;
		});

