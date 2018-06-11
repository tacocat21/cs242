/*
 *  View so students can respond to poll
 */
class PollResultView extends React.Component {
    constructor(props) {
        super(props);
        let courseUrlArr = document.URL.split('/');
        this.pollId = courseUrlArr.pop();
        this.courseId = courseUrlArr.pop();
        this.state = {
            answer: "",
            question: "",
            answerList: [],
            countList: [],
            endStatus: false,
            studentResponses: []
        };
        console.log(this.state);
        this.loadData = this.loadData.bind(this);
        this.callEndPoll = this.callEndPoll.bind(this);
    }

    loadData(result) {
        console.log(result);
        this.setState(prevState => ({
            answer: result['answer'],
            question: result['question'],
            answerList: result['answer_list'],
            endStatus: result['end_status'],
            countList: result['num_count_list'],
            studentResponses: result['student_responses']
        }));
    }


    callEndPoll() {
        endPoll(this.courseId, this.pollId, function (result) {
            console.log(result);
            location.reload();
        });
    }

    componentDidMount() {

        console.log(this.courseId);
        console.log("ending");
        this.timerID = setInterval(
      () => getPollData(this.courseId, this.pollId, this.loadData),
      5000
    );
    }


    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    render() {
        console.log("rendering");
        let userType = sessionStorage.getItem("userType");
        let endPollButton = null;
        if (userType === TEACHERTYPE && !this.state.endStatus) {
            endPollButton = (<a onClick={this.callEndPoll}>
                <button className="btn btn-default single-button">End Poll</button>
            </a>);
        }

        if (userType === TEACHERTYPE) {
            return (<div className="base-box">
                <div className="row">
                    <div className="col-sm-6">
                        <div className="row">
                            <div className="col-sm-3">
                                <h1>Q:</h1>
                            </div>
                            <div className="col-sm-9">
                                <h1 className="big-question">{this.state.question}</h1>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-3">
                                <h1>A:</h1>
                            </div>
                            <div className="col-sm-9">
                                <h1 className="big-question">{this.state.answer}</h1>
                            </div>
                        </div>
                        <div className="row">
                            {endPollButton}
                        </div>
                        <div className="row">
                            <StatisticsTable answerList={this.state.answerList} numCountList={this.state.countList}/>
                        </div>

                    </div>
                    <div className="col-sm-6">
                        <StudentResponseTable studentDict={this.state.studentResponses}/>
                    </div>

                </div>
            </div>);
        } else {

            return (<div className="base-box">
                <div className="row">
                    <div className="col-sm-6">
                        <div className="row">
                            <div className="col-sm-3">
                                <h1>Q:</h1>
                            </div>
                            <div className="col-sm-9">
                                <h1 className="big-question">{this.state.question}</h1>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-3">
                                <h1>A:</h1>
                            </div>
                            <div className="col-sm-9">
                                <h1 className="big-question">{this.state.answer}</h1>
                            </div>
                        </div>
                        <div className="row">
                        </div>

                    </div>
                    <div className="col-sm-6">
                        <StatisticsTable answerList={this.state.answerList} numCountList={this.state.countList}/>
                    </div>

                </div>
            </div>);
        }
    }
}

class StatisticsTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let answerList = this.props.answerList;
        let numCountList = this.props.numCountList;
        console.log(answerList);
        let rows = [];
        for (let idx = 0; idx < answerList.length; idx++) {
            rows.push(<tr key={idx}>
                <th>{answerList[idx]}</th>
                <th>{numCountList[idx]}</th>
            </tr>);
        }
        console.log(rows);
        return (<div>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Attempt</th>
                    <th>Number of guesses</th>
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
 *  Adds a row to the list of students
 */
class StudentResponseRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        status = null;
        if (this.props.isCorrect) {
            status = "correct"
        } else {
            status = "wrong"
        }
        return (<tr className={status}>
            <th scope="row" className={status}>{this.props.name}</th>
            <td className={status}>{this.props.response}</td>
        </tr>);
    }
}

/*
 *  Table contains students registered in the class
 */
class StudentResponseTable extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
    }


    render() {
        let rows = [];
        for (let key in this.props.studentDict) {
            let studentObj = this.props.studentDict[key];
            console.log(studentObj);
            rows.push(<StudentResponseRow key={studentObj._id} name={studentObj.name}
                                          response={studentObj.response} isCorrect={studentObj.is_correct}/>);
        }

        return (<div className="">
            <h1>Student Responses</h1>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Response</th>
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
    <PollResultView />
    , document.getElementById('root'));
