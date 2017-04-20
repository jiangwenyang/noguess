var express = require('express');
var app = express();
// 加载资源库
var credentials = require('./credentials.js');
// 配置handlebars模板引擎
var exphbs = require('express-handlebars');
var hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs'
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
// 配置mongoose连接数据库
var mongoose = require('mongoose');
var opts = {
    server: {
        socketOptions: {
            keepAlive: 1
        }
    }
};
switch (app.get('env')) {
    case 'development':
        mongoose.connect(credentials.mongo.development.connectionString, opts);
        break;
    case 'production':
        mongoose.connect(credentials.mongo.production.connectionString, opts);
        break;
    default:
        throw new Error('Unknow execution enviroment' + app.get('env'));
}
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('数据库连接成功！！！'.rainbow);
});
// 配置会话持久化
var MongoSessionStore = require('session-mongoose')(require('connect'));
var sessionStore = new MongoSessionStore({
    url: credentials.mongo.development.connectionString
});
// 托管静态文件
app.use(express.static('public'));
app.use(express.static('avatar'));
// 配置body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
// 配置cookie-parser
app.use(require('cookie-parser')(credentials.cookieSecret));
// 配置express-session
app.use(require('express-session')({
    secret: credentials.cookieSecret,
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}));
// 配置即显消息
app.use(function (req, res, next) {
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});
// 登录检测
app.use(function (req, res, next) {
    if (req.url=='/reg'||req.url=='/login'||req.session.uid) {
        next();
    }else{
        res.redirect('/login');
    }

})
// 访问用户模型
var User = require('./models/users.js');
// 配置控制台色彩输出
var colors = require('colors');
// 设置默认端口号
app.set('port', process.env.PORT || 3000);
// 链入路由
require('./routes.js')(app);
// 定制404
app.use(function (req, res, next) {
    res.type('text/plain');
    res.status(404);
    res.send('404-Not Found');
});
// 定制500页面
app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500-Server Error');
});

app.listen(app.get('port'), function () {
    console.log(('Express started in ' + app.get('env') +
        ' mode on port ' + app.get('port') +
        '; press Ctrl-C to terminate.').green);
});