import React from 'react';
import { connect } from 'react-redux';
import { withStyles, MuiThemeProvider } from '@material-ui/core';
import ButtonAppBar from './app/appBar';
import theme from '../helpers/theme.js';
import Dropzone from './app/dropzone';
import VideoList from './videos/videoList';

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
                    <Dropzone />
                    <VideoList />
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