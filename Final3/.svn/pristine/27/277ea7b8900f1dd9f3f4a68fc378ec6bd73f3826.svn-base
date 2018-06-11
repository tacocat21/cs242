var courseId = "58ff290d179c96135e2d02e2";

/*
 *  React component to create a Messaging list item
 */
class MessageItem extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            imageUri: null
        };
        this.updateImage = this.updateImage.bind(this);
    }

    updateImage(result){
        this.setState(prevState => ({
            imageUri: result['image']
        }));
    }

    componentDidMount(){
        let referenceProp = this.props.imgSrc;
        getImage(referenceProp, this.updateImage);
    }

    render() {
        let imageObj = null;
        if(this.state.imageUri !== null){
            imageObj = new Image();
            imageObj.src = this.state.imageUri.toString();
        }
        console.log(this.state);
        console.log(imageObj);
        return (<li className="list-group-item">
            <div className="row">
                <div className="col-sm-2 message-text">{this.props.author}</div>
                <div className="col-sm-9 message-text">{this.props.message}</div>
                {imageObj}
            </div>
        </li>);
    }
}


/*
 * React component containing message board
 */
class MessageBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: [],
            data_uri: null,
            processing: false
        };
        this.loadMessages = this.loadMessages.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFile = this.handleFile.bind(this);
    }

    loadMessages(result) {
        this.setState(prevState => ({
            pollId: result["poll_id"],
            message: result["messages"]
        }));
    }


    componentDidMount() {
        // Temporary setup for after i've done the other pages
        var outerFunc = this.loadMessages;
        createSession(courseId, function (result) {
            createPoll(courseId, MC_POLL_TYPE, "question", "answer", undefined, function (result) {
                try {
                    outerFunc(result);
                    postMessage(courseId, result['poll_id'], "User Name", TEACHERTYPE, "Message", outerFunc);
                } catch (err) {
                    console.log(err);
                }
            });
        });
    }


    handleSubmit(e) {
        e.preventDefault();
        let message = document.getElementById("messageTextInput").value;
        let userType = sessionStorage.getItem("userType");
        let userName = sessionStorage.getItem("userName");
        if(this.state.data_uri !== null){
            sendImageToServer(this.state.data_uri, this.state.pollId + userName + this.state.message.length.toString() +".png", this.state.filetype, function (result) {
                console.log("result");
            });
        }
        var referenceLoadMessages = this.loadMessages;
        postMessage(courseId, this.state.pollId, userName, userType, message, referenceLoadMessages);
        document.getElementById("messageTextInput").value = "";
        document.querySelector('input[type=file]').value = "";
    }

    handleFile() {
        try {
            const reader = new FileReader();
            const file = document.querySelector('input[type=file]').files[0];

            reader.onload = (upload) => {
                this.setState({
                    data_uri: upload.target.result,
                    filetype: file.type
                });
            };

            reader.readAsDataURL(file);
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        let messages = [];
        let userName = sessionStorage.getItem("userName");
        this.state.message.forEach((messageDict) => {
            let imgSrc = this.state.pollId + userName + messageDict.message_id.toString() + ".png";
            messages.push(<MessageItem key={messageDict.message_id} message={messageDict.message}
                                       author={messageDict.user} authorType={messageDict.user_type}
                                       imgSrc={imgSrc}/>);
        });
        try {
            return (
                <div className="base-box">
                    <h1>Message Board</h1>
                    <ul className="list-group">
                        {messages}
                    </ul>
                    <form onSubmit={this.handleSubmit} encType="multipart/form-data">
                        <input type="file" name="file" onChange={this.handleFile}/>
                        <textarea id="messageTextInput" rows="5" cols="50" className="text-input"/>
                        <input className='btn btn-primary' type="submit" value="Submit Comment"/>
                    </form>
                </div>);
        } catch (err) {
            console.log(err);
        }
    }
}




ReactDOM.render(
    <MessageBoard/>
    , document.getElementById('root'));

