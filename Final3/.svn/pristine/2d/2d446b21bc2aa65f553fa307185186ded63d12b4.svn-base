
class CreatePoll extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            questionType: window.MC_POLL_TYPE,
            possibleAnswers: []
        };
        this.createPoll = this.createPoll.bind(this);
        this.addPossibleAnswer = this.addPossibleAnswer.bind(this);
        this.onQuestionTypeChange = this.onQuestionTypeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    createPoll(e) {
        e.preventDefault();
        try{
            let question = document.getElementById("inputQuestion").value;
            let possibleAnswers = null;
            if(this.state.questionType === window.MC_POLL_TYPE){
                possibleAnswers = this.state.possibleAnswers;
            }
            let answer = document.getElementById("inputAnswer").value;
            let courseUrl = document.URL;
            let courseId = courseUrl.split('/').pop();
            console.log(courseId);
            console.log(this.state.questionType);
            createPoll(courseId, this.state.questionType, question, answer, possibleAnswers, "", function(result){
                console.log(result);
                console.log('change location');
                console.log(window.baseUrl);


                window.location = window.baseUrl + "course/view/" + courseId;

            });
        }catch(err){
            console.log(err);
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        let message = document.getElementById("messageTextInput").value;
        let userType = sessionStorage.getItem("userType");
        let userName = sessionStorage.getItem("userName");
        var referenceLoadMessages = this.loadMessages;
        postMessage(courseId, this.state.pollId, userName, userType, message, referenceLoadMessages);
        document.getElementById("messageTextInput").value = "";
        document.querySelector('input[type=file]').value = "";
    }


    addPossibleAnswer(e){
        e.preventDefault();

        this.setState(prevState => ({
            possibleAnswers: prevState.possibleAnswers.concat([document.getElementById('inputPossibleValue').value])
        }));
        console.log(this.state.possibleAnswers);
        console.log(document.getElementById('inputPossibleValue').value);
    }

    onQuestionTypeChange(e) {
        e.persist();
        this.setState(prevState => ({
            questionType: e.target.value
        }));
        console.log(this.state.questionType);
    }

    render() {
        let mcPoll = window.MC_POLL_TYPE;
        let textPoll = window.TEXT_POLL_TYPE;
        let intPoll = window.INT_POLL_TYPE;
        let addPossibleAnswerHTML = null;
        let answerInput = null;
        let answerHTMLList = [];
        if(this.state.questionType === mcPoll){
            this.state.possibleAnswers.forEach((value)=>{
                answerHTMLList.push(<option key={value} value={value}>{value}</option>)
            });
            console.log(answerHTMLList);
            answerInput = (<select name="answerSelect" className="form-control" id="inputAnswer">
                            {answerHTMLList}
                        </select>);
            addPossibleAnswerHTML = (<div className="form-group">
                <label htmlFor="inputAddPossibleValue" className="col-sm-3 control-label"> Add possible answer</label>
                <div className="col-sm-6">
                    <input required="true" type="text" className="form-control" id="inputPossibleValue" placeholder="Question"/>
                </div>
                <div className="col-sm-2">
                    <button type="submit" className="btn btn-default" onClick={this.addPossibleAnswer}>Add answer
                    </button>
                </div>
        </div>);
        } else if(this.state.questionType === textPoll){
            answerInput = (<input required="true" type="text" className="form-control" id="inputAnswer" placeholder="Answer"/>);
        } else if(this.state.questionType === intPoll){
            answerInput = (<input required="true" type="number" className="form-control" id="inputAnswer" placeholder="Answer"/>);
        }

        return(<div className="form-box">
                <h1> Create Poll</h1>
                <form className="form-horizontal">
                <div className="form-group">
                    <label htmlFor="inputQuestion" className="col-sm-3 control-label"> Question</label>
                    <div className="col-sm-8">
                        <input required="true" type="text" className="form-control" id="inputQuestion" placeholder="Question"/>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="inputQuestionSelect" className="col-sm-3 control-label"> Type of Question</label>
                    <div className="col-sm-8">
                        <select name="questionSelect" className="form-control" id="inputQuestionSelect"
                                onChange={this.onQuestionTypeChange}>
                            <option value={mcPoll}>Multiple Choice</option>
                            <option value={textPoll}>Text</option>
                            <option value={intPoll}>Integer</option>
                        </select>
                    </div>
                </div>
                    {addPossibleAnswerHTML}
                <div className="form-group">
                    <label htmlFor="inputAnswerType" className="col-sm-3 control-label"> Answer </label>
                    <div className="col-sm-8">
                        {answerInput}
                    </div>
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-default submit-button" onClick={this.createPoll}>CREATE POLL
                    </button>
                </div>
            </form>
        </div>);
    }
}

ReactDOM.render(
    <CreatePoll/>
    , document.getElementById('root'));
