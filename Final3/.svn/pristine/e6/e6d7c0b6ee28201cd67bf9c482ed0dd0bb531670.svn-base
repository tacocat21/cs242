/*
 *  Get message json data
 *  @param courseId: id hash for the course
 *  @param pollId: id hash for the poll
 *  @param userType: either "Teacher" or "Student"
 *  @param successFunction: function called whenever the API call succeeds
 */
var getMessage = function(courseId, pollId, userType, successFunction){
    var type = "";
    if(userType === TEACHERTYPE){
        type = "teacher/";
    }else{
        type = "student/";
    }
    axios.get("/api" + type + "poll/message/" + courseId + "/" + pollId).then(function(result){
        console.log(result);
        successFunction(result['data']);
    }).catch(function(err){
        console.log(err);
    })
};


/*
 *  Post message to the post
 *  @param courseId: id hash for the course
 *  @param pollId: id hash for the poll
 *  @param userName: user name
 *  @param userType: either "Teacher" or "Student"
 *  @param message: message to post
 *  @param successFunction: function called whenever the API call succeeds
 */
var postMessage = function(courseId, pollId, userName, userType, message, successFunction){
    console.log("postMessage called");
    try {
        if (userType === TEACHERTYPE) {
            userType = "teacher/";
        } else {
            userType = "student/";
        }
        console.log(userType);
        var postDict = {
            "course_id": courseId,
            "poll_id": pollId,
            "user_name": userName,
            "message": message,
            "message_post_type": "message"
        };
        console.log(postDict);
        axios.post("/api/" + userType + "poll/message", postDict).then(function (result) {
            console.log(successFunction);
            successFunction(result['data']);
        }).catch(function (error) {
            console.log("Unable to create session");
            console.log(error);
        });
    }catch(err){
        console.log(err);
    }
};


/*
 *  Create a new session
 *  @param courseId: id hash for the course
 *  @param successFunction: function called whenever the API call succeeds
 */
var createSession = function(courseId, successFunction){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            var post_dict={"location":position.coords};

            axios.post("/api/session/" + courseId, post_dict).then(function(result){
                successFunction(result['data']);
            }).catch(function (error) {
                console.log("Unable to create session");
                console.log(error);
            });
        });
    }else{
        console.log("Geolocation unavailable");
    }
};

/*
 *  Create a new poll
 *  @param courseId: id hash for the course
 *  @param pollType: type of poll
 *  @param question: question of the poll
 *  @param answer: answer of the poll
 *  @param possibleAnswers: possible answers students can choose from
 *  @param successFunction: function called whenever the API call succeeds
 */
var createPoll = function(courseId, pollType, question, answer, possibleAnswers, successFunction){
    console.log("Create poll called");
    try {
        var post_dict = {
            "poll_type": pollType,
            "question": question,
            "answer": answer
        };
        if (possibleAnswers !== undefined) {
            post_dict["possible_answers"] = possibleAnswers
        }

        axios.post("/api/poll/" + courseId, post_dict).then(function (result) {
            console.log(result);
            successFunction(result['data']);
        }).catch(function (error) {
            alert("Unable to create poll");
            console.log(error);
        });
    }catch(err){
        console.log(err);
    }
};

/*
 *  Get available polls
 *  @param courseId: id hash of the course
 *  @param successFunction: function called whenever the API call succeeds
 */
var getAvailablePolls = function(courseId, successFunction){
    axios.get("/api/session/" + courseId).then(function(result){
        console.log(result);
        successFunction(result['data']);
    }).catch(function(err){
        console.log(err);
    })
};
