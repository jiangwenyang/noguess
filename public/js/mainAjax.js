$(function () {
    var tabList = $('#tabPanelList');
    var tabListItem = tabList.find('a');
    tabListItem.click(function () {
        var currentItemID = $(this).attr('href').slice(1);
        $.ajax({
            type: 'GET',
            url: '/profile/'+currentItemID,
            success: function (data, textStatus) {
                console.log(data);
                console.log(textStatus);
            }
        });
    });
});