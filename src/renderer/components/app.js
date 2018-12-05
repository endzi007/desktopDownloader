import React from 'react';
import { connect } from 'react-redux';
import { withStyles, MuiThemeProvider } from '@material-ui/core';
import ButtonAppBar from './app/appBar';
import theme from '../helpers/theme.js';
import Dropzone from 'react-dropzone';
import accept from 'attr-accept';

accept({
    name: 'my file.json',
    type: 'application/json'
}, 'application/json,video/*');

class App extends React.Component{
    constructor(){
        super();
        this.state = {
            mode: "off"
        }
        this.onDrop = this.onDrop.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
    }
    onDrop(e){
        if(e.dataTransfer.items){
            for(let x of e.dataTransfer.items){
              x.getAsString((s)=>{
                console.log(s);
              });
            }
        }

    }
    onDragOver(e){
        e.preventDefault();
    }
    onDragEnter(e){
        e.preventDefault();
    }
    render(){
        const { classes } = this.props;
        return (
            <MuiThemeProvider theme={theme}>
                <div>
                    <ButtonAppBar />
                    <div
                    style={{
                        width: "100px",
                        height: "100px",
                        border: "1px dotted black"
                    }} 
                    onDrop={this.onDrop} onDragEnter={this.onDragEnter} onDragOver={this.onDragOver}>
                    </div>
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