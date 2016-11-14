var ActionResult =
 {
     HCI_LOGIN_SUCCESS: 0x0000,   //登录成功
     HCI_LOGIN_FAIL_NET_UNAVAILABLE: 0x0002,   //登录失败：网络故障
     HCI_LOGIN_FAIL_LOCKED: 0x0003,   //登录失败：用户被锁
     HCI_LOGIN_FAIL_UNKNOWN: 0x0004,   //登录失败：原因未知
     HCI_LOGIN_FAIL_OPT_PWD_ERR: 0x0005,   //登录失败：操作员账号密码错误
     HCI_LOGIN_FAIL_OPT_UNMATCH_UC: 0x0006,   //登录失败：操作员和电话账号不匹配
     HCI_LOGIN_FAIL_SVR_ERROR: 0x0007,   //登录失败：服务器忙
     HCI_LOGIN_FAIL_OPERATOR_AUTH_FAILED: 0x0008,   //登录失败：操作员鉴权失败

     HCI_SETSTATUS_IDLE_SUCCESS: 0x0020,   //置闲失败
     HCI_SETSTATUS_BUSY_SUCCESS: 0x0021,   //置闲成功
     HCI_SETSTATUS_IDLE_FAILED: 0x0022,   //置忙成功
     HCI_SETSTATUS_BUSY_FAILED: 0x0023,   //置忙失败
     HCI_SETSTATUS_RELOGIN_IDLE: 0x0024,   //重新登录
     HCI_SETSTATUS_FORCE_LOGOUT: 0x0025,   //被服务器强制下线
     HCI_SENDMSG_RES_SUCCESS: 0x0026,   //短信发送成功
     HCI_SENDMSG_RES_FAILED: 0x0027,   //短信发送失败

     HCI_CALL_HOLD_SUCCESS: 0x0040,   //保持呼叫成功
     HCI_CALL_HOLD_FAILED: 0x0041,   //保持呼叫失败
     HCI_CALL_UNHOLD_SUCCESS: 0x0042,   //恢复呼叫成功
     HCI_CALL_UNHOLD_FAILED: 0x0043,   //恢复呼叫失败
     HCI_CALL_TRANSFERAUTO_SUCCESS: 0x0044,   //自动转接成功
     HCI_CALL_TRANSFERAUTO_FAILED: 0x0045,   //自动转接失败
     HCI_CALL_TRANSFERMANUAL_SUCCESS: 0x0046,   //人工转接成功
     HCI_CALL_TRANSFERMANUAL_FAILED: 0x0047,   //人工转接失败

     HCI_MOD_PHONE_PWD_SUCCESS: 0x0060,   //修改电话密码成功
     HCI_MOD_PHONE_PWD_AUTH_FAILED: 0x0061,   //旧密码不正确
     HCI_MOD_PHONE_PWD_CONN_TIMEOUT: 0x0062,   //服务器连接超时
     HCI_MOD_PHONE_PWD_CONN_ERROR: 0x0063,   //服务器连接错误
     HCI_MOD_PHONE_PWD_LOCKED: 0x0064,   //修改操作被锁定
     HCI_MOD_PHONE_PWD_OTHER_FAILED: 0x0065,   //其他未知错误
     HCI_MOD_OPT_PWD_SUCCESS: 0x0066,   //修改操作员密码成功
     HCI_MOD_OPT_PWD_REQUEST_BADFMT: 0x0067,   //请求格式错误
     HCI_MOD_OPT_PWD_ACCOUNT_ERROR: 0x0068,   //帐号错误
     HCI_MOD_OPT_PWD_AUTH_FAIL: 0x0069,   //原密码错误
     HCI_MOD_OPT_PWD_REQUEST_ERROR: 0x0070,   //请求错误
     HCI_MOD_OPT_PWD_TIMEOUT: 0x0071,   //请求超时
     HCI_MOD_OPT_PWD_SVR_ERROR: 0x0072,   //服务端错误
     HCI_MOD_OPT_PWD_NEWPWD_SIMPLE: 0x0073,   //新密码太简单
     HCI_MOD_OPT_PWD_OTHER_FAILED: 0x0074,   //其他未知错误

     HCI_ACTION_RESULT_BUT: 0xFFFF    //无效响应值
 };

 var SocketStatuse =
{
    HCI_SOCKET_CLOSE: 0, //socket链接关闭
    HCI_SOCKET_OPEN: 1   //socket链接开打
};

var DisconnectReason =
{
    HCI_DIC_REASON_NORMA: 0,  //正常挂机
    HCI_DIC_REASON_BUSY: 1, //对方忙
    HCI_DIC_REASON_REJECT: 2,  //对方拒接
    HCI_DIC_REASON_NOT_AVAILABLE: 3,   //不可达
    HCI_DIC_REASON_FORBIDDEN: 4,   //呼叫受限
    HCI_DIC_REASON_OTHER: 5      //其他未知
};


