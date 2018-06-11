var React = require("react");

console.log("got base class");
class Base extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(<div className="base-box">
            <h1>{this.props.display}</h1>
        </div>);
    }
}

