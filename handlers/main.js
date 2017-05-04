var User = require('../models/users.js');
var Topic = require('../models/topic.js');
var Activity = require('../models/activity.js');
// 主页渲染
exports.homeRender = function (req, res) {
    var allData = {};
    User.findById(req.session.uid).populate('following', '_id nickname dynamic').populate({
        path: 'following',
        select: '_id nickname dynamic',
    }).select('following').limit(10).exec(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            for (var i = 0; i < doc.following.length; i++) {
                doc.following[i].dynamic = doc.following[i].dynamic[doc.following[i].dynamic.length - 1];
            }
            allData.dynamicNew = doc;
            Topic.find({}).sort({
                'timeStamp': -1,
                'followers': -1
            }).limit(10).populate('leader', '_id nickname').exec(function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    allData.TopicHot = doc;
                    Activity.find({}).sort({ //TODO sort参数可能会有问题
                        'followers': -1,
                        'timeStamp': -1
                    }).limit(2).populate('leader', '_id nickname').exec(function (err, doc) {
                        if (err) {
                            console.log(err);
                        } else {
                            allData.activityHot = doc;
                            res.render('home', allData);
                        }
                    });
                }
            });
        }
    });
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
                msg: '该邮箱已经被注册了，请尝试换一个'
            };
            res.redirect('/reg');
        } else {
            req.session.uid = doc.id;
            req.session.email = doc.email;
            req.session.nickname = doc.nickname;
            req.session.avatar = doc.avatar.path; //设置默认头像
            res.redirect('/info');
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
    var updateConditon = {
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
    User.findByIdAndUpdate(req.session.uid, updateConditon, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            req.session.site = doc.site;
            res.redirect('/qa');
        }
    });
};


// QA渲染
exports.qaRender = function (req, res) {
    res.render('qa', {
        layout: 'welcome'
    });
};
// QA设置处理
exports.qaHandler = function (req, res) {
    var updateConditon = {
        qa: {
            q: req.body.q,
            a: req.body.a
        }
    }
    User.findByIdAndUpdate(req.session.uid, updateConditon, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/avatarSetting');
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
            path: 'avatar/' + req.file.filename
        }
    }
    User.findByIdAndUpdate(req.session.uid, update, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            req.session.avatar = 'avatar/' + req.file.filename;
            res.redirect('/');
        }
    });
};


// 设置页面渲染
exports.settingRender = function (req, res) {
    res.render('setting');
};


// 处理昵称修改
exports.settingNicknameHandler = function (req, res) {
    var newNickname = req.body.nickname;
    User.findByIdAndUpdate(req.session.uid, {
        nickname: newNickname
    }, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            req.session.nickname = newNickname;
            req.session.flash = {
                msg: '修改成功，你的新昵称：' + newNickname
            }
            res.redirect('/setting');
        }
    });
};
// 处理密码修改
exports.editPasswordHandler = function (req, res) {
    var oldPassword = req.body.oldPassword,
        newPassword = req.body.newPassword;
    User.findOneAndUpdate({
        _id: req.session.uid,
        password: oldPassword
    }, {
        password: newPassword
    }, function (err, doc) {
        if (err) {
            console.log(err);
        } else if (!doc) {
            console.log(doc);
            req.session.flash = {
                msg: '原密码不正确，请重新输入！'
            }
            res.redirect('/setting');
        } else {
            req.session.flash = {
                msg: '修改密码成功，重新登录！'
            }
            logoutHandler(req, res);
        }
    })
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
            req.session.avatar = doc.avatar.path;
            req.session.site = doc.site;
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
var logoutHandler = exports.logoutHandler = function (req, res) {
    delete req.session.uid;
    delete req.session.email;
    delete req.session.nickname;
    delete req.session.avatar; //设置默认头像
    res.redirect('/login');
};


// 发布个人动态处理
exports.publishDynamicHandler = function (req, res) {
    var dynamicItem = {
        timeStamp: new Date(),
        content: req.body.dynamicText,
        imgPath: 'dynamic/' + req.file.filename
    };
    User.findByIdAndUpdate(req.session.uid, {
        $push: {
            dynamic: dynamicItem
        },
        $inc: {
            fruit: 2
        }
    }, function (err, doc) {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/');
        }
    });
};


// 发布话题
exports.publishTopicHandler = function (req, res) {
    var topic = new Topic({
        leader: req.session.uid,
        timeStamp: new Date(),
        title: req.body.topicTitle,
        content: req.body.topicText
    });
    topic.save(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            User.findByIdAndUpdate(req.session.uid, {
                $push: {
                    'topic.publish': topic.id
                },
                $inc: {
                    fruit: 5
                }
            }, function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    req.session.flash = {
                        msg: '成功发布新话题'
                    };
                    res.redirect('/allTopic');
                }
            });
        }
    });
}
// 查询所有话题
exports.allTopicHandler = function (req, res) {
    Topic.find({}).populate('leader', 'nickname _id').sort({
        'timeStamp': -1
    }).exec(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            res.render('allTopic', {
                data: doc
            })
        }
    });
};
// 查看单个话题
exports.topicHandler = function (req, res) {
    var topicId = req.params.topicId;
    Topic.findById(topicId).populate('leader', '_id nickname').populate('followers.from', '_id nickname').exec(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            res.render('topic', doc);
        }
    });
};
// 处理话题回复
exports.topicRepeatHandler = function (req, res) {
    var topicId = req.params.topicId;
    var condition = {
        from: req.session.uid,
        time: new Date,
        reply: req.body.repeatText
    }
    Topic.findByIdAndUpdate(topicId, {
        $push: {
            followers: condition
        }
    }, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            User.findById(req.session.uid, function (err, doc) {
                if (err) {
                    console.log(err);
                } else if (doc.topic.reply.indexOf(topicId) != -1) {
                    res.redirect('/topic/' + topicId);
                } else {
                    doc.topic.reply.push(topicId);
                    doc.save();
                    res.redirect('/topic/' + topicId);
                }
            })
        }
    });
};


// 发布活动
exports.publishActivityHandler = function (req, res) {
    var activity = new Activity({
        leader: req.session.uid,
        timeStamp: new Date(),
        startTime: req.body.activityStartTime,
        stopTime: req.body.activityStopTime,
        title: req.body.activityTitle,
        content: req.body.activityText,
        place: req.body.activityPlace
    });
    activity.save(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            User.findByIdAndUpdate(req.session.uid, {
                $push: {
                    'activity.organize': activity.id
                },
                $inc: {
                    fruit: 10
                }
            }, function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    req.session.flash = {
                        msg: '成功发布新活动'
                    };
                    res.redirect('/allActivity');
                }
            });
        }
    });
}
// 查询所有活动
exports.allActivityHandler = function (req, res) {
    Activity.find({}).populate('leader', 'nickname _id').sort({
        'timeStamp': -1
    }).exec(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            var result = doc;
            for (var i = 0; i < result.length; i++) {
                result[i].followersNum = result[i].followers.length;
                if (result[i].followers.indexOf(req.session.uid) == -1) { //当前用户是否已经参与过这个话题
                    result[i].isFollowed = false;
                } else {
                    result[i].isFollowed = true;
                }
            }
            res.render('allActivity', {
                data: result
            })
        }
    });
};
// 参与活动
exports.joinActivityHandler = function (req, res) {
    // TODO参与活动
    var activityId = req.params.activityId;
    User.findById(req.session.uid, function (err, doc) {
        if (err) {
            console.log(err);
        } else if (doc.activity.join.indexOf(activityId) == -1) {
            doc.activity.join.push(activityId);
            doc.save(function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    Activity.findByIdAndUpdate(activityId, {
                        $push: {
                            followers: req.session.uid
                        }
                    }, function (err, doc) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.json({
                                code: 1,
                                msg: "参与成功"
                            })
                        }
                    });
                }
            });
        } else {
            // 已经参与过了
            res.json({
                code: 0,
                msg: "你已经参与过了"
            })
        }
    });
};

// 个人主页渲染
exports.profileRender = function (req, res) {
    var isMe = req.params.uid == req.session.uid ? true : false;
    var hasfollowing = false;
    User.findById(req.params.uid)
        .populate('topic.publish')
        .populate('topic.reply')
        .populate('activity.organize')
        .populate('activity.join')
        .populate('following', '_id nickname gender fruit avatar.path')
        .populate('followers', '_id nickname gender fruit avatar.path')
        .exec(function (err, doc) {
            if (err) {
                console.log(err)
            } else {
                for (var i = 0; i < doc.followers.length; i++) {
                    if (doc.followers[i].id == req.session.uid) {
                        hasfollowing = true;
                    }
                }
                res.render('profile', {
                    profileUid: doc.id,
                    profileAvatar: doc.avatar.path,
                    profileNickname: doc.nickname,
                    profileEmail: doc.email,
                    profileGender: doc.gender,
                    profileBirthday: doc.birthday.year + '/' + doc.birthday.month + '/' + doc.birthday.day,
                    profileSite: doc.site,
                    profileHeight: doc.height + 'cm',
                    profileEducation: doc.education,
                    profileMarital: doc.marital,
                    profileQ: doc.qa.q,
                    profileFruit: doc.fruit,
                    profileIsMe: isMe,
                    profileHasfollowing: hasfollowing,
                    dynamic: doc.dynamic,
                    publish: doc.topic.publish,
                    reply: doc.topic.reply,
                    organize: doc.activity.organize,
                    join: doc.activity.join,
                    following: doc.following,
                    followers: doc.followers,
                    followersNum: doc.followers.length,
                    followingNum: doc.following.length
                });
            }
        })
};

// 条件搜索页面渲染
exports.searchKeyRender = function (req, res) {
    res.render('search-key');
};
// 处理条件搜索
exports.searchKeyHandler = function (req, res) {
    var followingList;
    var condition = {},
        gender = req.body.gender,
        marital = req.body.marital,
        education = req.body.education,
        site = req.body.site;
    if (gender != 'null') condition.gender = gender;
    if (marital != 'null') condition.marital = marital;
    if (education != 'null') condition.education = education;
    if (site.length != 0) condition.site = site;
    User.findById(req.session.uid).select('following').exec(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            followingList = doc.following;
            User.find(condition).select('_id nickname avatar fruit').limit(100).exec(function (err, doc) {
                if (!doc.length) {
                    req.session.flash = {
                        search: true,
                        msg: '没有查找到相关信息'
                    };
                    res.redirect('/search-key');
                } else {
                    for (var i in doc) {
                        if (req.session.uid == doc[i].id) { //如果是自己排除
                            doc[i].isMe = true;
                        } else {
                            doc[i].isMe = false;
                            if (followingList.indexOf(doc[i].id) == -1) { //如果是没有关注的
                                doc[i].hasfollowing = false;
                            } else {
                                doc[i].hasfollowing = true;
                            }
                        }

                    }
                    res.render('search-key', {
                        data: doc
                    });
                }
            });
        }
    });
};
// 同城搜索
exports.oneSiteHandler = function (req, res) {
    var site = req.session.site;
    var followingList;
    User.findById(req.session.uid).select('following').exec(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            followingList = doc.following;
            User.find({
                site: site
            }).select('_id nickname avatar fruit').exec(function (err, doc) {
                if (!doc.length) {
                    flash = {
                        msg: '没有查找到相关信息'
                    };
                    res.render('search-quick', {
                        flash: flash
                    });
                } else {
                    for (var i in doc) {
                        if (req.session.uid == doc[i].id) { //如果是自己排除
                            doc[i].isMe = true;
                        } else {
                            doc[i].isMe = false;
                            if (followingList.indexOf(doc[i].id) == -1) { //如果是没有关注的
                                doc[i].hasfollowing = false;
                            } else {
                                doc[i].hasfollowing = true;
                            }
                        }

                    }
                    res.render('search-quick', {
                        data: doc
                    });
                }

            });
        }
    });
};
// 随机速配
exports.randomHandler = function (req, res) {
    var total = 0;
    var result = [];
    var skipList = [];
    User.find({}).select('_id nickname avatar fruit').exec(function (err, doc) {
        total = doc.length;
        for (var i = 0; i < 10; i++) {
            var skip = Math.floor(Math.random() * total); //生成一个0-文档总长度的随机数
            if (skipList.indexOf(skip) == -1) {
                skipList.push(skip); //存储已经push的下标
                var temp = User.find({}).select('_id nickname avatar fruit').skip(skip).limit(1).exec();
                result.push(temp);
            }
        }
        Promise.all(result).then(function (results) {
            for (var i in results) {
                results[i] = results[i][0];
            }
            res.render('search-quick', {
                data: results
            });
        });
    });
};

// 主导航查询
exports.allSearchHandler = function (req, res) {
    var condition = req.body.anyq;
    var conditionReg = new RegExp(req.body.anyq); //全局搜索正则
    var allData = {
        userData: null
    };
    User.find({
        nickname: conditionReg
    }).exec(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            allData.userData = doc;
            Topic.find({
                title: conditionReg
            }).populate('leader', 'nickname _id').sort({
                'timeStamp': -1
            }).exec(function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    allData.topicData = doc;
                    Activity.find({
                        title: conditionReg
                    }).populate('leader', 'nickname _id').sort({
                        'timeStamp': -1
                    }).exec(function (err, doc) {
                        if (err) {
                            console.log(err);
                        } else {
                            var result = doc;
                            for (var i = 0; i < result.length; i++) {
                                result[i].followersNum = result[i].followers.length;
                                if (result[i].followers.indexOf(req.session.uid) == -1) { //当前用户是否已经参与过这个话题
                                    result[i].isFollowed = false;
                                } else {
                                    result[i].isFollowed = true;
                                }
                            }
                            allData.activityData = result;
                            res.render('anySearch', {
                                allData
                            })
                        }
                    });
                }
            });
        }
    });
};

// 处理关注
exports.following = function (req, res) {
    var followingItem = req.params.uid;
    User.findById(req.session.uid, function (err, doc) {
        if (doc.id == followingItem) {
            res.json({
                code: 0,
                msg: "不要调皮，不能关注自己哦！！！"
            });
        } else if (doc.following.indexOf(followingItem) != -1) {
            res.json({
                code: 0,
                msg: "不要调皮，你已经关注过他了哦！！！"
            });
        } else {
            doc.following.push(followingItem);
            doc.save(function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    User.findByIdAndUpdate(req.params.uid, {
                        $push: {
                            followers: req.session.uid
                        }
                    }, function (err, doc) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.json({
                                code: 1,
                                msg: "关注成功"
                            });
                        }
                    });
                }
            });
        }
    });
};

// 处理发送私信
exports.sendMsgHandler = function (req, res) {
    var to = req.body.uid,
        msg = req.body.sendText,
        form = req.session.uid;
    User.findByIdAndUpdate(to, {
        $push: {
            mailbox: {
                from: form,
                text: msg
            }
        }
    }).exec(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            res.json({
                code: 1,
                msg: '发送成功'
            })
        }
    });
};
exports.mailboxHandler = function (req, res) {
    User.findById(req.session.uid).select('mailbox').populate('mailbox.from', '_id avatar.path nickname').exec(function (err, doc) {
        res.render('mailbox', {
            data: doc
        })
    });
};