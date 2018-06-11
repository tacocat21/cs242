
class CreateCourse extends React.Component {
    constructor(props) {
        super(props);
        this.createCourse = this.createCourse.bind(this);
    }

    createCourse(e) {
        e.preventDefault();
        try{
            if (sessionStorage.getItem("userType") !== TEACHERTYPE) {
                alert("User is not a teacher!");
                console.log(sessionStorage.getItem("userType"));
                console.log(sessionStorage.getItem("userEmail"));
                return false;
            }
            let teacherId = sessionStorage.getItem("userID");
            let teacherSchoolId = sessionStorage.getItem("userSchoolId");
            let teacherName = sessionStorage.getItem("userName");
            let courseName = document.getElementById("inputCourseName").value;
            let courseCode = document.getElementById("inputCourseCode").value;
            if (courseName === "" || courseCode === "") {
                alert('Empty field!');
                return false;
            }
            createClass(courseName, courseCode, teacherId, teacherSchoolId, teacherName, function (result) {
                window.location = window.baseUrl + "course/list";
            });
        }catch(err){
            alert("Unable to create course");
            console.log(err);
        }
    }

    render() {
        return(<div className="form-box">
                <h1> Create Course</h1>
                <form className="form-horizontal">
                <div className="form-group">
                    <label htmlFor="inputCourseName" className="col-sm-3 control-label"> Course Name</label>
                    <div className="col-sm-8">
                        <input required="true" type="text" className="form-control" id="inputCourseName" placeholder="Name"/>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="inputCourseCode" className="col-sm-3 control-label"> Course Code</label>
                    <div className="col-sm-8">
                        <input required="true" type="text" className="form-control" id="inputCourseCode" placeholder="Course code"/>
                    </div>
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-default submit-button" onClick={this.createCourse}>CREATE COURSE
                    </button>
                </div>
            </form>
        </div>);
    }
}

ReactDOM.render(
    <CreateCourse/>
    , document.getElementById('root'));