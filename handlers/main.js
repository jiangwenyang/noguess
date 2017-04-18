exports.homeRender=function(req,res){
    res.send('首页渲染');
};
exports.regRender=function(req,res){
    res.render('reg',{layout:'welcome'});
};
exports.regHandler=function(req,res){
    // 成功就跳转到资料填写页面
    res.redirect('/info');
};
exports.infoRender=function(req,res){
    res.render('info',{layout:'welcome'});
};
exports.infoHandler=function(req,res){

};