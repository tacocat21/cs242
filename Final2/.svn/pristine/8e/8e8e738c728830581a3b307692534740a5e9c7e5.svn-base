var addCourseToStudent = function(studentId, courseId, successFunction){
    post_dict={"student_id":studentId,
               "course_id":courseId};
    for(var key in post_dict){
        if(post_dict[key] === null){
            alert("Unable to add student to course");
            return false;
        }
    }
    axios.post("/api/course/student", post_dict).then(function(result){
        successFunction(result);
    }).catch(function (error) {
        alert("Unable to create course");
        console.log(error);
    });
};

var getCourseList = function(filterDict, successFunction){
    if(filterDict === undefined){
        axios.get("/api/course").then((result) => {
            console.log(result['data']);
            console.log(successFunction);
            successFunction(result['data']);
        }).catch(function(err){
            console.log(err);
        });
    }
    else{
        axios.get("/api/course",{
            params: {
                filter_dict: filterDict
            }
        }).then(function(result){
            successFunction(result);
        }).catch(function(err){
            console.log(err);
        });
    }
};

var createClass = function(courseName, courseCode, teacherId, teacherSchoolId, teacherName, successFunction){
    post_dict={"course_name":courseName,
    "course_code":courseCode,
    "teacher_id":teacherId,
    "teacher_school_id":teacherSchoolId,
    "teacher_name":teacherName};
    for(var key in post_dict){
        if(post_dict[key] === null){
            alert("Unable to create course");
            return false;
        }
    }
    console.log("creating class");
    axios.post("/api/course", post_dict).then(function(result){
        successFunction(result);
    }).catch(function (error) {
        alert("Unable to create course");
        console.log(error);
    });
};

var getCourseData = function(courseId, successFunction){
    axios.get("/api/course/" + courseId).then(function(result){
        console.log(result);
        successFunction(result['data']);
    }).catch(function(err){
        successFunction(err);
    })
};

