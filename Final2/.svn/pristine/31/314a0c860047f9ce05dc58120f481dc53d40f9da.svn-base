
var getUserData = function(userId, userType, successFunction){
    var userUrl = "";
    if(userType === TEACHERTYPE){
        userUrl = "/api/teacher/";
    }
    else if(userType === STUDENTTYPE){
        userUrl = "/api/student/";
    } else{
        console.log("Unable to get student data because of undefined user type");
        return false;
    }
    axios.get(userUrl + userId).then(function(result){
        // console.log(result['data']);
        // console.log(successFunction);
        successFunction(result['data']);
        console.log("function finished");
    }).catch(function(err){
        console.log("Unable to get student data");
        console.log(err);
    });
};




