var main = require('./handlers/main.js');
// 配置文件上传
var multer = require('multer');
var avatarPath = multer({
    dest: 'uploads/avatar/'
});
var dynamicImgPath = multer({
    dest: 'uploads/dynamic/'
});
module.exports = function (app) {
    // 访问主页
    app.get('/', main.homeRender);


    // 访问注册页面
    app.get('/reg', main.regRender);
    // 进行注册
    app.post('/reg', main.regHandler);


    // 访问个人资料页面
    app.get('/info', main.infoRender);
    // 设置个人资料
    app.post('/info', main.infoHandler);
    // 访问QA页面
    app.get('/qa', main.qaRender);
    // 设置QA
    app.post('/qa', main.qaHandler);
    // 访问设置头像页面
    app.get('/avatarSetting', main.avatarRender);
    // 设置头像
    app.post('/avatarSetting', avatarPath.single('avatar'), main.avatarHandler);
    // 访问设置页面
    app.get('/setting', main.settingRender);
    // 昵称设置
    app.post('/editNickname', main.settingNicknameHandler);
    // 密码修改
    app.post('/editPassword', main.editPasswordHandler);


    // 访问登录页面
    app.get('/login', main.loginRender);
    // 进行登录
    app.post('/login', main.loginHandler);


    // 注销登录
    app.get('/logout', main.logoutHandler);


    // 发表动态
    app.post('/publishDynamic', dynamicImgPath.single('dynamicImg'), main.publishDynamicHandler);


    // 发布话题
    app.post('/publishTopic', main.publishTopicHandler);
    // 访问所有话题页面
    app.get('/allTopic', main.allTopicHandler);
    // 单个话题页面
    app.get('/topic/:topicId', main.topicHandler);
    // 话题回复
    app.post('/repeat/:topicId', main.topicRepeatHandler);

    // 发布活动
    app.post('/publishActivity', main.publishActivityHandler);
    // 访问活动页面
    app.get('/allActivity', main.allActivityHandler);
    // 参与活动
    app.get('/joinActivity/:activityId', main.joinActivityHandler);

    // 访问个人主页
    app.get('/profile/:uid', main.profileRender);

    // 访问条件搜索页面
    app.get('/search-key', main.searchKeyRender);
    // 进行条件搜索处理
    app.post('/seach-key', main.searchKeyHandler);
    // 同城搜索
    app.get('/oneSite',main.oneSiteHandler);
    // 随机速配
    app.get('/random',main.randomHandler);

    // 主导航任意搜索：根据用户输入关键词去用户表查询昵称，去活动表查询活动标题，去话题表查询话题标题
    app.post('/anySearch', main.allSearchHandler);


    // 关注用户
    app.get('/following/:uid', main.following);

    // 发送私信
    app.post('/sendMsg',main.sendMsgHandler);
    // 获取私信列表
    app.get('/mailbox',main.mailboxHandler);
};