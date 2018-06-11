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
 *  Create a new poll
 *  @param courseId: id hash for the course
 *  @param pollType: type of poll
 *  @param question: question of the poll
 *  @param answer: answer of the poll
 *  @param possibleAnswers: possible answers students can choose from
 *  @param successFunction: function called whenever the API call succeeds
 */
var createPoll = function(courseId, pollType, question, answer, possibleAnswers, image, successFunction){
    console.log("Create poll called");
    try {
        let post_dict = {
            "poll_type": pollType,
            "question": question,
            "answer": answer
        };
        console.log(possibleAnswers);
        if (possibleAnswers !== null) {
            post_dict["possible_answers"] = possibleAnswers
        }
        try {
            console.log(!navigator.geolocation);
            if ("geolocation" in navigator) {
                console.log('In geolocation');
                navigator.geolocation.getCurrentPosition(function (position) {
                    console.log('posting');
                    post_dict["location"] = position.coords;
                    axios.post("/api/poll/" + courseId, post_dict).then(function (result) {
                        console.log(result);
                        successFunction(result['data']);
                    }).catch(function (error) {
                        alert("Unable to create poll");
                        console.log(error);
                    });
                }, function(err){
                    // Without location
                    console.log(err);
                    axios.post("/api/poll/" + courseId, post_dict).then(function (result) {
                        console.log(result);
                        successFunction(result['data']);
                    }).catch(function (error) {
                        alert("Unable to create poll");
                        console.log(error);
                    });
                }, {timeout:5000});
            } else {
                console.log("Geolocation unavailable");
            }
        }catch(err){
            console.log("caught");
            console.log(err);
        }
    }catch(err){
        console.log('caught');
        console.log(err);
    }
};

/*
 *  Get available polls
 *  @param courseId: id hash of the course
 *  @param successFunction: function called whenever the API call succeeds
 */
var getAvailablePolls = function(courseId, successFunction){
    axios.get("/api/poll/" + courseId).then(function(result){
        console.log(result);
        successFunction(result['data']);
    }).catch(function(err){
        console.log(err);
    })
};

var getPollData = function(courseId, pollId, successFunction){
    axios.get("/api/poll/" + courseId + "/" + pollId).then(function(result){
        console.log(result);
        successFunction(result['data']);
    }).catch(function(err){
        console.log(err);
    })
};

var endPoll = function(courseId, pollId, successFunction){
    console.log("ending");
    axios.put("/api/poll/" + courseId + "/" + pollId).then(function(result){
        console.log(result);
        successFunction(result['data']);
    }).catch(function(err){
        console.log(err);
    })
};

var sendStudentResponse = function(courseId, pollId, studentId, schoolId, name, response, successFunction){
    let postDict = {
        "student_id": studentId,
        "school_id": schoolId,
        "name": name,
        "response":response
    };
    console.log(postDict);
    axios.post("/api/poll/" + courseId + "/" + pollId, postDict).then(function (result) {
        console.log(result);
        successFunction(result['data']);
    }).catch(function (error) {
        console.log(error);
    });

};