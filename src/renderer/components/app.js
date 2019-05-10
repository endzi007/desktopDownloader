import React from 'react';
import { connect } from 'react-redux';
import { withStyles, MuiThemeProvider } from '@material-ui/core';
import ButtonAppBar from './app/appBar';
import theme from '../helpers/theme.js';
import VideoList from './videos/videoList';
import ConfigModal from './app/configModal';
import BottomAppBar from './app/bottomAppBar';
import ProFeatureDialog from "./app/proFeatureDialog";
import UpdateNotification from './app/updateNotification';
import About from './app/about';
import { creators as videoActions } from '../../main/videos/videoDuck';
import { creators as appStateActions } from '../../main/appState/appStateDuck';
import { ipcRenderer } from 'electron';
import licenseCheck from '../helpers/licenseCheck';

import ErrorNotification from './app/errorNotification';

class App extends React.Component{
    constructor(){
        super();
        this.state = {
            mode: "off",
            outline: "hide",
            updateNotification: false
        }
        this.onDrop = this.onDrop.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.handleCloseUpdate = this.handleCloseUpdate.bind(this);
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
        e.stopPropagation();
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
    componentDidMount(){
        ipcRenderer.on("update-available", (e, info)=>{
            this.setState({updateNotification: true})
        })
        licenseCheck().then((res)=>{
            console.log(res);
            if(res === "RESET"){
                this.props.changeLicense(true);
                this.props.licenseFailureCounter(res);
            } else {
                this.props.licenseFailureCounter("INC");
            }
        }).catch((e)=>{
            this.props.errorHandler({status: true, message: e});
        });
    }
    handleCloseUpdate(bool){
        ipcRenderer.send("QUIT_AND_INSTALL");
        this.setState({updateNotification: bool})
    }
    render(){
        const { classes } = this.props;
        return (
            <MuiThemeProvider theme={theme}>
                <div style={{
                    outlineOffset: "-4px", 
                    height: 
                    `${window.innerHeight-100}px`, 
                    outline: this.state.outline === "show"? `4px dashed ${theme.palette.secondary.main}`: "none",
                    marginTop: "55px",
                    overflowY: "scroll"

                }}
                onDrop={this.onDrop} onDragEnter={this.onDragEnter} onDragOver={this.onDragOver} onDragLeave = {this.onDragLeave}>
                    <ButtonAppBar />
                    <VideoList />
                    <ConfigModal />
                    <BottomAppBar />
                    <ProFeatureDialog />
                    <UpdateNotification open={this.state.updateNotification} handleClose={this.handleCloseUpdate}/>
                    <About />
                    <ErrorNotification error={this.props.error} closeErrorNotification={this.props.errorHandler}/>
                </div>
            </MuiThemeProvider>
        );
    }
}
function mapStateToProps(store){
    return{
        ui: store.uiConfig,
        error: store.appState.error
    }
}

const mapDispatchToProps = {
    addVideoToPlaylist: videoActions.addVideoToPlaylist,
    changeLicense: appStateActions.changeLicense,
    licenseFailureCounter: appStateActions.licenseFailureCounter,
    errorHandler: appStateActions.errorHandler
}
export default  withStyles(null,{withTheme: true})(connect(mapStateToProps, mapDispatchToProps)(App));