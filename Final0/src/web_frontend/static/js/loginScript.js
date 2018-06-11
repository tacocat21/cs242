var baseAPIUrl = "localhost:5000/";

// Component toggles between Login and Create Account
class Toggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {page: 'Login'};

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.props.onValueChange(e.target.value);
    }

    render() {
        return (
            <div className="toggle-box">
                <button className="btn btn-default btn-lg btn-custom-lg toggle-button" onClick={this.handleClick}
                        id="login-toggle-button" value="Login">
                    Login
                </button>
                <button className="btn btn-default btn-lg btn-custom-lg toggle-button" onClick={this.handleClick}
                        id="create-toggle-button" value="Create Account">
                    Create Account
                </button>
            </div>
        );
    }
}

// form to create a new account
class CreateAccountForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {year: 'Freshman', status: 'Student', result:''};
        this.createAccount = this.createAccount.bind(this);
        this.onStatusChange = this.onStatusChange.bind(this);
    }

    createAccount(e) {
        e.preventDefault();
        var responseDict = {};
        responseDict['password'] = document.getElementById("inputPasswordCreate").value;
        responseDict['name'] = document.getElementById("inputNameCreate").value;
        responseDict['email'] = document.getElementById("inputEmailCreate").value;
        responseDict['school_id'] = document.getElementById("inputNetIDCreate").value;
        for(var key in responseDict){
            if(responseDict[key] === null || responseDict[key]===""){
                alert("Empty field!");
                return false;
            }
        }
        if(responseDict['password'] !== document.getElementById("inputConfirmPasswordCreate").value){
            alert("Passwords do not match!");
            return false;
        }
        // Check if email is valid
        if(responseDict['email'].indexOf('@') === -1 || responseDict['email']===""){
            alert("Invalid email field");
            return false;
        }
        console.log(responseDict);
        if(this.state.status === 'Student'){
            responseDict['year'] = document.getElementById("inputYearCreate").value;
            axios.post("/api/student", responseDict).then(function (response) {
                console.log(response);
                alert('Success!');
            }).catch(function (err) {
                alert('Unable to login');
                console.log(err);
            });
        }else{
            axios.post("/api/teacher", responseDict).then(function (response) {
                alert('Success!');
                console.log(response);
            }).catch(function (err) {
                alert('Unable to login');
                console.log(err);
            });
        }
    }

    onStatusChange(e) {
        e.persist();
        this.setState(prevState => ({
            status: e.target.value
        }));
        // console.log(this.state.status);
    }

    render() {
        console.log(this.state.status);
        let year = null;
        if (this.state.status === 'Student') {
            year = (<div className="form-group">
                    <label className="col-sm-3 control-label">Year</label>
                    <div className="col-sm-8">
                        <select name="yearSelect" className="form-control" id="inputYearCreate">
                            <option value="Freshman">Freshman</option>
                            <option value="Sophomore">Sophomore</option>
                            <option value="Junior">Junior</option>
                            <option value="Senior">Senior</option>
                            <option value="Senior++">Senior++</option>
                        </select>
                    </div>
                </div>
            );
        }
        return (
            <form className="form-horizontal">
                <div className="form-group">
                    <label htmlFor="inputNameCreate" className="col-sm-3 control-label">Name</label>
                    <div className="col-sm-8">
                        <input required="true" type="text" className="form-control" id="inputNameCreate" placeholder="Name"/>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="inputNetIDCreate" className="col-sm-3 control-label">NetID</label>
                    <div className="col-sm-8">
                        <input required type="text" className="form-control" id="inputNetIDCreate" placeholder="NetID"/>
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-3 control-label">Status</label>
                    <div className="col-sm-8">
                        <select name="statusSelect" className="form-control" id="inputStatusCreate"
                                onChange={this.onStatusChange}>
                            <option value="Student">Student</option>
                            <option value="Teacher">Teacher</option>
                        </select>
                    </div>
                </div>
                {year}
                <div className="form-group">
                    <label htmlFor="inputEmailCreate" className="col-sm-3 control-label">Email</label>
                    <div className="col-sm-8">
                        <input required type="email" className="form-control" id="inputEmailCreate" placeholder="Email"/>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="inputPasswordCreate" className="col-sm-3 control-label">Password</label>
                    <div className="col-sm-8">
                        <input required type="password" className="form-control" id="inputPasswordCreate"
                               placeholder="Password"/>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="inputConfirmPasswordCreate" className="col-sm-3 control-label">Confirm
                        Password</label>
                    <div className="col-sm-8">
                        <input required type="password" className="form-control" id="inputConfirmPasswordCreate"
                               placeholder="Confirm Password"/>
                    </div>
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-default submit-button" onClick={this.createAccount}>CREATE
                        ACCOUNT
                    </button>
                </div>
            </form>
        );
    }
}

class LoginForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.login = this.login.bind(this);
    }

    login(e) {
        e.preventDefault();
        var responseDict = {};
        responseDict['email'] = document.getElementById("inputEmailLogin").value;
        responseDict['password'] = document.getElementById("inputPasswordLogin").value;
        if(responseDict['email'] === "" || responseDict['password'] === ""){
            alert('Empty field!');
            return false;
        }

        console.log(responseDict);
        axios.post("/api/login", responseDict).then(function (response) {
                console.log(response);
                alert('Success!');
            }).catch(function (err) {
                alert('Unable to login');
                console.log(err);
            });
    }

    render() {
        return (
            <form className="form-horizontal">
                <div className="form-group">
                    <label htmlFor="inputEmailLogin" className="col-sm-3 control-label">Email</label>
                    <div className="col-sm-8">
                        <input type="email" className="form-control" id="inputEmailLogin" placeholder="Email"/>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="inputPasswordLogin" className="col-sm-3 control-label">Password</label>
                    <div className="col-sm-8">
                        <input type="password" className="form-control" id="inputPasswordLogin" placeholder="Password"/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-12">
                        <button type="submit" className="btn btn-default submit-button" onClick={this.login}>LOGIN</button>
                    </div>
                </div>
            </form>
        );
    }
}

/*
 * React component containing Login and Create Account boxes
 */
class AuthorizationBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {page: 'Login'};
        this.setPageState = this.setPageState.bind(this);
    }

    setPageState(e) {
        console.log(e);
        this.setState(prevState => ({
            page: e
        }));
    }

    render() {
        let formPage = null;
        if (this.state.page === "Login") {
            formPage = <LoginForm/>;
        } else {
            formPage = <CreateAccountForm/>;
        }
        return (
            <div className="form-box">
                <h1>iClicker++</h1>
                <Toggle onValueChange={this.setPageState}/>
                {formPage}
            </div>);
    }
}

console.log('rendered');
ReactDOM.render(
    <AuthorizationBox/>
    , document.getElementById('root'));
