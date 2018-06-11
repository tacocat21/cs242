/*
 *  List the available polls
 */
class PollTable extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        let rows = [];
        this.props.availablePolls.forEach((value) => {
            rows.push(<PollRow key={value.poll_id} question={value.question}
                               courseId={this.props.courseId} pollId={value.poll_id}
                               finished={this.props.finished}/>);
        });
        if(rows.length === 0){
            return(<div>
                <h1>None available</h1>
            </div>)
        }
        console.log(rows);
        return(
            <table className="table table-hover">
            <tbody>
                {rows}
            </tbody>
            </table>);
    }
}

class PollRow extends React.Component {
    constructor(props) {
        super(props);
        this.redirectToPollPage = this.redirectToPollPage.bind(this);
    }

    redirectToPollPage(){
        let userType = sessionStorage.getItem("userType");
        if(userType===STUDENTTYPE && !this.props.finished){
            window.location = window.baseUrl + "poll/view/" + this.props.courseId + "/" + this.props.pollId;
        } else {
            window.location = window.baseUrl + "poll/result/" + this.props.courseId + "/" + this.props.pollId;
        }
    }

    render(){
        return(<tr onClick={this.redirectToPollPage}>
            <th scope="row"><h1>Q:</h1></th>
            <th><p className="question">{this.props.question}</p></th>
        </tr>);
    }
}


/*
 *  Overall React component to tie all of the other components together
 */
class CourseView extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            studentList: [],
            availablePolls: [],
            pollHistory: []
        };
        let courseUrl = document.URL;
        this.courseId = courseUrl.split('/').pop();
        this.updateCourseData = this.updateCourseData.bind(this);
        this.updatePollData = this.updatePollData.bind(this);
        this.redirectToCreatePoll = this.redirectToCreatePoll.bind(this);
    }

    updateCourseData(result){
        console.log(result);
        console.log("class Data");
        this.setState(prevState =>({
            studentList: result['student_list'],
            pollHistory: result['poll_session']
        }));
    }

    updatePollData(result){
        console.log(result);
        this.setState(prevState =>({
            availablePolls: result
        }));
    }

    componentDidMount() {
        getCourseData(this.courseId, this.updateCourseData);
        getAvailablePolls(this.courseId, this.updatePollData);
    }

    redirectToCreatePoll(){
        window.location = window.baseUrl + "poll/create/" + this.courseId;
    }

    render(){
        console.log(this.state.studentList);

        let userType = sessionStorage.getItem("userType");
        if(userType === TEACHERTYPE){
            return(<div className="base-box">
                    <div className="row">
                       <div className="col-sm-4">
                           <h1> Available Polls</h1>
                           <PollTable courseId={this.courseId} availablePolls={this.state.availablePolls} finished={false}/>
                        <a onClick={this.redirectToCreatePoll} ><button className="btn btn-default single-button">Create Poll</button></a>
                       </div>
                       <div className="col-sm-4">
                           <h1> Poll History</h1>
                           <PollTable courseId={this.courseId} availablePolls={this.state.pollHistory} finished={true}/>
                       </div>
                       <div className="col-sm-4">
                            <StudentTable studentList={this.state.studentList}/>
                       </div>
                    </div>
                   </div>);
        } else{
            return(<div className="base-box">
                    <div className="row">
                       <div className="col-sm-6">
                           <h1> Available Polls</h1>
                           <PollTable courseId={this.courseId} availablePolls={this.state.availablePolls} finished={false}/>
                       </div>
                       <div className="col-sm-6">
                           <h1> Poll History</h1>
                           <PollTable courseId={this.courseId} availablePolls={this.state.pollHistory} finished={true}/>
                       </div>
                    </div>
                   </div>);
        }

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
            <h1>Student List</h1>
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


ReactDOM.render(
    <CourseView/>
    , document.getElementById('root'));
