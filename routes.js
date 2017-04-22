var main = require('./handlers/main.js');
// 配置文件上传
var multer = require('multer');
var avatar=multer({dest:'avatar/'});
module.exports = function (app) {
    // 访问主页
    app.get('/', main.homeRender);
    // 访问注册页面
    app.get('/reg', main.regRender);
    // 进行注册
    app.post('/reg', main.regHandler);
    // 访问个人资料页面
    app.get('/info', main.infoRender);
    // 访问个人资料页面
    app.post('/info', main.infoHandler);
    // 访问设置头像页面
    app.get('/avatar', main.avatarRender);
    // 访问登录页面
    app.post('/avatar', avatar.single('avatar'), main.avatarHandler);
    // 访问登录页面
    app.get('/login',main.loginRender);
    // 进行登录
    app.post('/login',main.loginHandler);
    // 注销登录
    app.get('/logout',main.logoutHandler);
};