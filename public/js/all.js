$(function () {
    // 处理编辑用户名
    var editNicknameBtn = $('#editNicknameBtn');
    var editNickNameForm = $('#editNickNameForm');
    editNickNameForm.hide();
    editNicknameBtn.click(function () {
        $(this).hide();
        editNickNameForm.show();
    });

    // 处理加入话题
    var joinBtn = $('.joinBtn');
    joinBtn.click(function () {
        var url = '/joinActivity/' + $(this).attr('data-activity');
        var that = $(this);
        $.get(url, function (data) {
            if (data.code) {
                $('<button class="disabled btn btn-sm  btn-default">已参与</button>').replaceAll(that);
            } else {
                alert('服务器发生了错误，请稍后重试！');
            }
        });
    });

    // 处理关注用户
    var floowingBtn = $('.floowingBtn');
    floowingBtn.click(function () {
        var url = '/following/' + $(this).attr('data-user');
        var that = $(this);
        $.get(url, function (data) {
            if (data.code) {
                $('<button class="disabled btn btn-sm  btn-default">关注</button>').replaceAll(that);
            } else {
                alert(data.msg);
            }
        });
    });
    // 发送私信
    var msgSendBox = $('#msgSendBox'), //模态框
        msgSendBoxForm = msgSendBox.find('form'), //模态框里面的form
        msgSendBtn = $('.msgSendBtn'), //触发模态框私信按钮
        sendToName = $('#sendToName'), //模态框私信接受者nickname
        sendToUid = $('#sendToUid'), //模态框私信接收者id
        sendText = $('#sendText'),
        msgSendBoxBtn = $('#msgSendBox-Btn'); //模态框里面的发送按钮
    msgSendBtn.click(function () {
        var username = $(this).parent().prev().find('a').text();
        sendToName.text(username);
        sendToUid.val($(this).attr('data-user'));
    });
    msgSendBoxBtn.click(function () {
        $.post('/sendMsg', {
            uid: sendToUid.val(),
            sendText: sendText.val()
        }, function (data) {
            if (data.code == 1) {
                alert('发送成功！')
                sendText.val('');
                msgSendBox.modal('hide');
            }
        });
    })
})