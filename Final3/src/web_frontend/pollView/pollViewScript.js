/*
 *  View so students can respond to poll
 */
class PollView extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            question: "",
            possibleAnswers:[],
            pollType:"INTPOLL",
            imageUri: ""
        };
        let courseUrlArr = document.URL.split('/');
        this.pollId = courseUrlArr.pop();
        this.courseId = courseUrlArr.pop();
        this.loadData = this.loadData.bind(this);
        this.submitAnswer = this.submitAnswer.bind(this);
        this.setImage = this.setImage.bind(this);
    }
    setImage(result){
        this.setState(prevState => ({
                imageUri: result
            }));
    }
    loadData(result){
        console.log(result);
        console.log(result['poll_type']);
        this.setState(prevState => ({
            question:result['question'],
            possibleAnswers:result['possible_answers'],
            pollType:result['poll_type']
        }));
    }

    submitAnswer(e){
        e.preventDefault();
        console.log("submitting");
        let studentId = sessionStorage.getItem('userID');
        let schoolId =  sessionStorage.getItem('userSchoolId');
        let name =  sessionStorage.getItem('userName');
        console.log(studentId);
        console.log(schoolId);
        console.log(name);
        let response = document.getElementById("inputAnswer").value;
        sendStudentResponse(this.courseId, this.pollId, studentId, schoolId, name, response, function(result){
            alert('Successfully submitted!');
            console.log(result);
            window.location = window.baseUrl + "course/view/" + this.courseId + "/" + this.pollId;
        });
    }
    componentDidMount(){
        console.log(this.pollId);
        console.log(this.courseId);
        getPollData(this.courseId, this.pollId, this.loadData);
        getImage(this.pollId + ".png", this.getUserImage);
    }

    render(){
        let mcPoll = window.MC_POLL_TYPE;
        let textPoll = window.TEXT_POLL_TYPE;
        let intPoll = window.INT_POLL_TYPE;
        let answerInput = null;
        let answerHTMLList = [];
        console.log(this.state.pollType);
        if(this.state.pollType === mcPoll){
            this.state.possibleAnswers.forEach((value)=>{
                answerHTMLList.push(<option key={value} value={value}>{value}</option>)
            });
            console.log(answerHTMLList);
            answerInput = (<select name="answerSelect" className="form-control" id="inputAnswer"
                                onChange={this.onQuestionTypeChange}>
                            {answerHTMLList}
                        </select>);
        } else if(this.state.pollType === textPoll){
            answerInput = (<input required="true" type="text" className="form-control" id="inputAnswer" placeholder="Answer"/>);
        } else if(this.state.pollType === intPoll){
            answerInput = (<input required="true" type="number" className="form-control" id="inputAnswer" placeholder="Answer"/>);
        }
/*        let img = null;
        if(this.state.imageUri!== ""){
            img = (<img src={this.state.imageUri}/>);
        }*/
        console.log(answerInput);
        return(<div className="form-box">
              <h1> Poll Answer</h1>
                <form className="form-horizontal">
                <div className="form-group">
                    <label className="col-sm-3 control-label"> Question</label>
                    <label className="col-sm-8 control-label"> {this.state.question}</label>
                </div>

                <div className="form-group">
                    <label className="col-sm-3 control-label"> Answer </label>
                    <div className="col-sm-8">
                        {answerInput}
                    </div>
                </div>

                <div className="form-group">
                     <button type="submit" className="btn btn-default submit-button" onClick={this.submitAnswer}>SUBMIT
                    </button>
                </div>
            </form>
        </div>);
    }
}


ReactDOM.render(
    <PollView/>
    , document.getElementById('root'));
