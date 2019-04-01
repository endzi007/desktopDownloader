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
import { machineId } from 'node-machine-id';
import { creators as videoActions } from '../../main/videos/videoDuck';
import { creators as appStateActions } from '../../main/appState/appStateDuck';
import { ipcRenderer } from 'electron';
import fetch from 'node-fetch';

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
        ipcRenderer.on("UPDATE_AVAILABLE", (e, info)=>{
            console.log(info, "update info");
            this.setState({updateNotification: true})
        })
        let storageItem = JSON.parse(localStorage.getItem("license"));
        if(storageItem !== null){
            let key = storageItem.license_key;
            let url = `https://desktopdownloader.000webhostapp.com/?secret_key=5c7cd0c3585ac5.07643313&slm_action=slm_check&license_key=${key}`
            fetch(url).then(response=> response.json()).then(licenseResponse =>{
                if(licenseResponse.status === "error"){
                    //dispatch licence failed 
                    //increase licence failed by 1
                    this.props.licenseFailureCounter("INC");
                } else {
                    machineId().then((id)=>{
                        for(let domain of licenseResponse.registered_domains){
                            if(domain.registered_domain === id){
                                //dispatch licenced
                                //reset failed counter to 0
                                this.props.changeLicense(true);
                                this.props.licenseFailureCounter("RESET");
                                break;       
                            } else {
                                //dispatch licence failed
                                //increase failed counter by 1
                                this.props.licenseFailureCounter("INC");
                            }
                        }
                    })
                }
            })
        
        }

    }
    handleCloseUpdate(bool){
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
                </div>
            </MuiThemeProvider>
        );
    }
}
function mapStateToProps(store){
    return{
        ui: store.uiConfig 
    }
}

const mapDispatchToProps = {
    addVideoToPlaylist: videoActions.addVideoToPlaylist,
    changeLicense: appStateActions.changeLicense,
    licenseFailureCounter: appStateActions.licenseFailureCounter
}
export default  withStyles(null,{withTheme: true})(connect(mapStateToProps, mapDispatchToProps)(App));