// TODO: vote by message_id
var voted = {};

/*
 * function called whenever the user submits a comment
 */
var submitComment = function(elem) {
    console.log(elem)
    var id = $(elem).attr("id");
    var idNumber = id.split("_")[1];
    var isNewSubthread = id.split("_")[2];
    console.log(id);
    console.log(idNumber);
    var urlStr = $("#meta-data").attr("data-name");
    console.log(urlStr);
    console.log(isNewSubthread);

    $.ajax({url:"/comment/" + urlStr,
            method:"POST",
            data:{
                'comment': document.getElementById("inputbox_"+idNumber+"_"+isNewSubthread).value,
                'new_subthread': isNewSubthread,
                'parent_message_id': idNumber
            },
            success:function (result) {
                console.log(result);
                $('#message_board').replaceWith(result);
                highlightButtons();
            },
            error: function (err){
                alert("unable to submit message!");
                highlightButtons();
            }
    });
};

/*
 * function called whenever the reply button is clicked
 * display the reply box
 */
var showReplyBox = function(elem){
    $(elem).next().css("display", "inline");
    highlightButtons();
};

/*
 * function called whenever the upvote button is called
 * Sends an upvote message in the backend and highlights the button in green
 */
var upvote = function(elem){
    var id = $(elem).attr("id");
    var idNumber = id.split("_")[1];
    var urlStr = $("#meta-data").attr("data-name");
    console.log(voted);
    if(urlStr in voted){
        if(parseInt(idNumber) in voted[urlStr]){
            return;
        }
    } else{
        voted[urlStr] = {};
    }

    $.ajax({url:"/comment/upvote/" +idNumber + "/"+ urlStr,
            method:"PUT",
            success:function (result) {

                voted[urlStr][parseInt(idNumber)] = true;
                $('#message_board').replaceWith(result);
                highlightButtons();
            },
            error: function (err){
                alert("unable to vote!");
                highlightButtons();
            }
    });
};

/*
 * function called whenever the downvote button is called
 * Sends an downvote message in the backend and highlights the button in green
 */
var downvote = function(elem){
    console.log(voted);
    var id = $(elem).attr("id");
    var idNumber = id.split("_")[1];
    var urlStr = $("#meta-data").attr("data-name");
    if(urlStr in voted){
        if(parseInt(idNumber) in voted[urlStr]){
            return;
        }
    } else{
        voted[urlStr] = {};
    }
    $.ajax({url:"/comment/downvote/" +idNumber + "/"+ urlStr,
            method:"PUT",
            success:function (result) {
                voted[urlStr][parseInt(idNumber)] = false;
                // replace html code
                $('#message_board').replaceWith(result);
                highlightButtons();

            },
            error: function (err){
                alert("unable to vote!");
                highlightButtons();
            }
    });
};

/*
 * Helper function to highlight buttons
 */
var highlightButtons = function(){
    var urlStr = $("#meta-data").attr("data-name");
    for(var storeId in voted[urlStr]){
        console.log("upvote_"+parseInt(storeId));
        if(voted[urlStr][storeId] == true){
            console.log("changed");
            $("#upvote_"+parseInt(storeId)).removeClass("btn-default").addClass("btn-success");
        }
        if(voted[urlStr][storeId] == false){
            $("#downvote_"+parseInt(storeId)).removeClass("btn-default").addClass("btn-danger");
        }
        }
}

$(document).ready(function(){
    console.log("page ready");
    $("#subdirectories").css("display", "show");
    $("#subdirectories").fadeIn(2000);
    $("#files").css("display", "show");
    $("#files").fadeIn(2000);
    $("#title").animate({fontSize:"50px"}, 2000);
});
