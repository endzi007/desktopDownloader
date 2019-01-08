import React from 'react';
import { connect } from 'react-redux';
import { withStyles, MuiThemeProvider } from '@material-ui/core';
import ButtonAppBar from './app/appBar';
import theme from '../helpers/theme.js';
import VideoList from './videos/videoList';
import ConfigModal from './app/configModal';
import BottomAppBar from './app/bottomAppBar';
import { addVideoToPlaylist } from '../../main/actions/index';

class App extends React.Component{
    constructor(){
        super();
        this.state = {
            mode: "off",
            outline: "hide"
        }
        this.onDrop = this.onDrop.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
    }
    onDrop(e){
        let droppedItems = e.dataTransfer.items;
        this.setState((state, props)=>{
            return {
                outline: "hide"
            }
        });
        if(droppedItems){
            for(let x of droppedItems){
                if(x.type==="text/plain"){
                    x.getAsString((s)=>{
                        this.props.addVideoToPlaylist(s)
                    });
                }
            }
        }
    
    }
    onDragStart(e){

    }
    onDragOver(e){
        e.preventDefault();
    }
    onDragEnter(e){ 
        this.setState((old, newState)=>{
            return {
                outline: "show"
            }
        });
    }
    onDragLeave(e){
        e.preventDefault();
        this.setState((old, newState)=>{
            return {
                outline: "hide"
            }
        });
    }
    render(){
        const { classes } = this.props;
        return (
            <MuiThemeProvider theme={theme}>
                <div style={{
                    outlineOffset: "-4px", 
                    minHeight: 
                    `${window.innerHeight}px`, 
                    outline: this.state.outline === "show"? `4px dashed ${theme.palette.secondary.main}`: "none"
                }}
                onDrop={this.onDrop} onDragEnter={this.onDragEnter} onDragOver={this.onDragOver} onDragLeave = {this.onDragLeave}>
                    <ButtonAppBar />
                    <VideoList />
                    <ConfigModal />
                    <BottomAppBar />
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

const mapDispatchToProps = {
    addVideoToPlaylist
}
export default  withStyles(null,{withTheme: true})(connect(mapStateToProps, mapDispatchToProps)(App));