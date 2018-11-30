import React from 'react';
import { connect } from 'react-redux';

class App extends React.Component{
    constructor(){
        super();
        this.state = {
            mode: "off"
        }
    }

    render(){
        return (
            <div>
                <div>{this.props.test}</div>
                <button onClick={()=>{
                    this.props.dispatch({type: "TEST_ACTION", payload: this.props.test === "on"? "off": "on"});
                }}>{this.props.test === "on"? "off": "on"}</button>
            </div>
        );
    }
}
function mapStateToProps(store){
    return{
        test: store.test
    }
}
export default connect(mapStateToProps)(App);