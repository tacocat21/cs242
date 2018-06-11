/*
 *  Adds a row to the classes currently available
 */
class CurrentCourseRow extends React.Component {
    constructor(props){
        super(props);
        this.redirectPage = this.redirectPage.bind(this);
    }

    redirectPage(){
        window.location = "http://localhost:5000/course/view/" + this.props.courseId;
    }

    render(){
        return (<tr onClick={this.redirectPage}>
                <th scope="row">{this.props.courseCode}</th>
                <td>{this.props.courseName}</td>
        </tr>);
    }
}

/*
 *  Lists current courses the user is registered
 */
class CurrentCourseTable extends React.Component {
    constructor(props) {
        super(props);
        this.redirectToListing = this.redirectToListing.bind(this);
    }

    redirectToListing(){
        window.location = "http://localhost:5000/course/list";
    }

    render() {
        if (this.props.courseList.length === 0) {
            return (<div >
                <h1>Course Listing</h1>
                <a onClick={this.redirectToListing}><button className="btn btn-default single-button">View Courses</button></a>
                <p className="center-text paragraph-margin">No registered courses! Too underfunded</p>
            </div>);
        }
        else {
            console.log("else");
            let rows = [];
            this.props.courseList.forEach((courseObj) => {
                rows.push(<CurrentCourseRow key={courseObj.course_id} courseCode={courseObj.course_code}
                                            courseName={courseObj.course_name}
                                            courseId={courseObj.course_id}/>);
            });

            return (<div>
                <h1>Current Courses</h1>
                <a onClick={this.redirectToListing}><button className="btn btn-default single-button">View Courses</button></a>
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th>Course Code</th>
                        <th>Course Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>

                </table>
            </div>);
        }
    }
}


/*
 *  Displays user information
 */
class UserInfo extends React.Component {
    constructor(props){
        super(props);

    }

    render(){
        return(<div className="sub-box">
            <img src="/api/image/empty_avatar.jpg" className="user-image"/>
            <h2 className="center-text">{this.props.name}</h2>
            <h2 className="center-text">{this.props.email}</h2>
            <h2 className="center-text">{this.props.schoolID}</h2>
        </div>);
    }
}

/*
 *  Container holding all the containers together
 */
class UserIntro extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            courseList: [],
            userEmail: "",
            userName: "",
            userType: "",
            userImage: ""
        };

        this.getUserInfo = this.getUserInfo.bind(this);
        this.getUserImage = this.getUserImage.bind(this);
    }

    getUserImage(result){
        this.setState(prevState => ({
                userImage: result
            }));

    }
    getUserInfo(result){
        try {
            console.log(result);
            this.setState(prevState => ({
                courseList: result['current_courses'],
                userName: result['name'],
                userEmail: result['email'],
                userType: result['type'],
                userSchoolId: result['school_id']
            }));
            console.log("set state");
        }catch(err){
            console.log("FAILED");
            console.log(err);
        }
    }

    componentDidMount(){
        let userId = sessionStorage.getItem("userID");
        let userType = sessionStorage.getItem("userType");
        getUserData(userId, userType, this.getUserInfo);
        getImage("empty_avatar.jpg", this.getUserImage)
    }

    render(){
        console.log("rendering");
        console.log(this.state.courseList);
        return (<div className="base-box"><div className="row">
            <div className="col-sm-6">
                <CurrentCourseTable courseList={this.state.courseList}/>
            </div>
            <div className="col-sm-6">
                <UserInfo name={this.state.userName} email={this.state.userEmail}
                          schoolID={this.state.userSchoolId} img={this.state.userImage}/>
            </div>
        </div></div>);
    }
}



ReactDOM.render(
    <UserIntro/>
    , document.getElementById('root'));

/*

class A extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return ();
    }
}


 */