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
        console.log(this.props.enis)
        return (
            <div>{this.props.enis}</div>
        );
    }
}
function mapStateToProps(store){
    return{
        enis: store.enis
    }
}
export default connect(mapStateToProps)(App);