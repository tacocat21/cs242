/*
 *  List the available polls
 */
class AvailablePollTable extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(<div>
            <SessionToggle/>
        </div>);
    }
}

/*
 *  Toggle between session being started and ending
 */
class SessionToggle extends React.Component{
    constructor(props){
        super(props);
        console.log(props);
        this.redirectToCreatePoll = this.redirectToCreatePoll.bind(this);
        this.createSession = this.createSession.bind(this);
        this.toggleClassStr = this.toggleClassStr.bind(this);
        this.toggleButtonStr = this.toggleButtonStr.bind(this);
        this.state = {
            sessionButtonClass:"btn btn-default button-green toggle-button",
            buttonStr: "Begin Session"
        }
    }

    toggleButtonStr(buttonStr){
        if(buttonStr==="Begin Session"){
            return "End Session";
        }
        return "Begin Session";
    }

    toggleClassStr(classString){
        if(classString === "btn btn-default button-green toggle-button"){
            return "btn btn-default button-red toggle-button";
        }
        return "btn btn-default button-green toggle-button"
    }

    redirectToCreatePoll(){
        window.location = "http://localhost:5000/poll/create/" + this.props.courseId;
    }

    createSession(){
        this.setState(prevState => ({
            sessionButtonClass:this.toggleClassStr(prevState.sessionButtonClass),
            buttonStr:this.toggleButtonStr(prevState.buttonStr)
        }))
    }

    render(){
        return(<div className="row">
            <a onClick={this.redirectToCreatePoll} ><button className="btn btn-default button-orange toggle-button">Create Poll</button></a>
            <a onClick={this.createSession} ><button className={this.state.sessionButtonClass}>{this.state.buttonStr}</button></a>
        </div>);
    }
}

/*
 *  Adds a row to the table containing poll history
 */
class PollHistoryRow extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return(<h1>Hello!</h1>);
    }
}

/*
 *  Table containing poll history
 */
class PollHistoryTable extends React.Component{
    constructor(props){
        super(props);
    }


    render(){
        let rows = [];
        this.props.studentList.forEach((studentObj) =>{
            rows.push(<PollHistoryRow/>)
            // rows.push(<PollHistoryRow key={studentObj._id} name={studentObj.name}
            //                          email={studentObj.email} schoolId={studentObj.school_id}/>);
        });

        return(<div className="pre-scrollable">
            {rows}
        </div>);
    }
}

/*
 *  Adds a row to the list of students
 */
class StudentRow extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(<tr>
                <th scope="row">{this.props.name}</th>
                <td>{this.props.schoolId}</td>
                <td>{this.props.email}</td>
               </tr>);
    }
}

/*
 *  Table contains students registered in the class
 */
class StudentTable extends React.Component{
    constructor(props){
        super(props);
        console.log(props);
    }


    render(){
        let rows = [];
        this.props.studentList.forEach((studentObj) =>{
            rows.push(<StudentRow key={studentObj._id} name={studentObj.name}
                                     email={studentObj.email} schoolId={studentObj.school_id}/>);
        });

        return(<div className="">
            <table className="table table-hover">
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>School Id</th>
                    <th>Email</th>
                    </tr>
                </thead>
            <tbody>
                {rows}
            </tbody>
            </table>
        </div>);
    }
}

/*
 *  Overall React component to tie all of the other components together
 */
class CourseView extends React.Component{
    constructor(props){
        super(props);
        this.updateCourseData = this.updateCourseData.bind(this);
        this.updatePollData = this.updatePollData.bind(this);
        this.state = {
            courseId: "",
            courseCode: "",
            courseName: "",
            studentList: [],
            teacherName: "",
            teacherSchoolId: "",
            pollSession: []
        };
    }

    updateCourseData(result){
        this.setState(prevState =>({
            courseId: result['_id'],
            courseCode: result['course_code'],
            courseName: result['course_name'],
            studentList: result['student_list'],
            teacherName: result['teacher_name'],
            teacherSchoolId: result['teacher_school_id'],
            pollHistory: result['poll_session']
        }));
    }

    updatePollData(result){
        console.log(result);
        this.setState(prevState =>({
            availablePolls: result['_id']
        }));
    }

    createSession(e){
        e.preventDefault();
    }

    componentDidMount() {
        let courseUrl = document.URL;
        let courseId = courseUrl.split('/').pop();
        getCourseData(courseId, this.updateCourseData);
        // getAvailablePolls(courseId, this.updatePollData);
    }


    render(){
        console.log(this.state.studentList);
        let userType = sessionStorage.getItem("userType");
        if(userType === TEACHERTYPE){
            return(<div className="base-box">
                    <div className="row">
                       <div className="col-md-4">
                           <AvailablePollTable courseId={this.state.courseId}/>
                       </div>
                       <div className="col-md-4">
                       </div>
                       <div className="col-md-4">
                            <StudentTable studentList={this.state.studentList}/>
                       </div>
                    </div>
                   </div>);
        } else{
            return(<div className="base-box">
                       <div className="col-md-6">
                       </div>
                       <div className="col-md-6">
                       </div>
                   </div>);
        }

     }
}

ReactDOM.render(
    <CourseView/>
    , document.getElementById('root'));
