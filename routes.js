var main=require('./handlers/main.js');
module.exports=function(app){
    // 访问主页
    app.get('/',main.homeRender);
    // 访问注册页面
    app.get('/reg',main.regRender);
    // 进行注册
    app.post('/reg',main.regHandler);
    // 访问个人资料页面
    app.get('/info',main.infoRender);
    // 访问个人资料页面
    app.post('/info',main.infoHandler);
    // 访问登录页面
    app.get('/login',function(req,res){
        res.render('login');
    });
    // 进行登录
    app.post('/login',function(req,res){
        
    });
};
