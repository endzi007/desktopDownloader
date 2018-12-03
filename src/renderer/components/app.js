import React from 'react';
import { connect } from 'react-redux';
import VideoList from './videoList';
import Button from '@material-ui/core/Button';
import { withStyles, MuiThemeProvider } from '@material-ui/core';
import ButtonAppBar from './app/appBar';
import theme from '../helpers/theme.js';


class App extends React.Component{
    constructor(){
        super();
        this.state = {
            mode: "off"
        }
    }

    render(){
        const { classes } = this.props;
        return (
            <MuiThemeProvider theme={theme}>
                <div>
                    <ButtonAppBar />
                </div>
            </MuiThemeProvider>
        );
    }
}
function mapStateToProps(store){
    return{
        test: store.test
    }
}
export default  withStyles(null,{withTheme: true})(connect(mapStateToProps)(App));