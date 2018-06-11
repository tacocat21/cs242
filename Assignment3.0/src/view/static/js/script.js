
var submitComment = function() {
    urlStr = $("#meta-data").attr("data-name");
    console.log(urlStr);
    $.ajax({url:"/comment/" + urlStr,
            method:"POST",
            data:{
                'comment': document.getElementById("inputbox").value,
                'new_subthread': false,
                'parent_message_id': 0
            }}).done(function () {
                console.log('received result');
    });
};


$(document).ready(function(){
    console.log("page ready");
    $("#subdirectories").css("display", "show");
    $("#subdirectories").fadeIn(2000);
    $("#files").css("display", "show");
    $("#files").fadeIn(2000);
    $("#title").animate({fontSize:"50px"}, 2000);
});
