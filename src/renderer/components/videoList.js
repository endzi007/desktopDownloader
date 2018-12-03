import React from 'react';
import { connect } from 'react-redux';

function mapStateToProps (state){
    return {
        state: state
    }
}
export default connect(mapStateToProps)(({state})=>{
    console.log(state);

    return (<div>enis</div>);
});