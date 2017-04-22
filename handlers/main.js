var User = require('../models/users.js');
// 主页渲染
exports.homeRender = function (req, res) {
    res.render('home');
};
// 注册渲染
exports.regRender = function (req, res) {
    res.render('reg', {
        layout: 'welcome',
    });
};
// 注册处理
exports.regHandler = function (req, res) {
    // 成功就跳转到资料填写页面
    var user = new User({
        email: req.body.email,
        password: req.body.password,
        nickname: req.body.nickname,
    })
    user.save(function (err, doc) {
        // 如果用户名已经被注册，进行提示，如果没有，跳转提醒进行资料填写
        if (err) {
            console.log(err);
            req.session.flash = {
                code: err.code,
                msg: '该邮箱已经被注册了，请尝试换一个'
            };
            res.redirect('/reg');
        } else {
            req.session.uid = doc.id;
            req.session.email = doc.email;
            req.session.nickname = doc.nickname;
            req.session.avatar = 'avatar.gif'; //设置默认头像
            res.redirect('/info');
            console.log('成功插入用户信息！！！' + '\nid:' + doc.id + '\nemail:' + doc.email);
        }

    });
};
// 资料填写渲染
exports.infoRender = function (req, res) {
    res.render('info', {
        layout: 'welcome'
    });
};
// 资料处理
exports.infoHandler = function (req, res) {
    var fullTime = req.body.birthday.split('-');
    var update = {
        gender: req.body.gender,
        marital: req.body.marital,
        birthday: {
            year: fullTime[0],
            month: fullTime[1],
            day: fullTime[2],
        },
        education: req.body.education,
        site: req.body.site,
        height: req.body.height
    }
    User.findByIdAndUpdate(req.session.uid, update, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log(('填写注册资料成功').green);
            res.redirect('/avatar');
        }
    });
};
// 头像设置渲染
exports.avatarRender = function (req, res) {
    res.render('avatar', {
        layout: 'welcome'
    });
};
// 头像设置处理
exports.avatarHandler = function (req, res) {
    var update = {
        avatar: {
            isSetted: true,
            path: req.file.filename
        }
    }
    User.findByIdAndUpdate(req.session.uid, update, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            req.session.avatar = req.file.filename;
            res.redirect('/');
        }
    });
};
// 登录渲染
exports.loginRender = function (req, res) {
    res.render('login', {
        layout: 'welcome'
    });
};
// 登录处理
exports.loginHandler = function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, doc) {
        if (err) {
            console.log(err);
        } else if (doc == null) {
            req.session.flash = {
                msg: '账号不存在，请重新输入！'
            }
            res.redirect('/login');
        } else if (doc.password == req.body.password) {
            req.session.uid = doc.id;
            req.session.email = doc.email;
            req.session.nickname = doc.nickname;
            if(doc.avatar.isSetted){
                req.session.avatar=doc.avatar.path;
            }else{
                req.session.avatar='avatar.gif';
            }
            res.redirect('/');
        } else {
            req.session.flash = {
                msg: '密码不正确，请重新输入！'
            }
            res.redirect('/login');
        }
    })
};
// 注销登录处理
exports.logoutHandler = function (req, res) {
    delete req.session.uid;
    delete req.session.email;
    delete req.session.nickname;
    delete req.session.avatar; //设置默认头像
    res.redirect('/login');
};