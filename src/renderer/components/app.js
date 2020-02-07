import React, { useRef, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { withStyles, MuiThemeProvider } from '@material-ui/core';
import ButtonAppBar from './app/appBar';
import theme from '../helpers/theme.js';
import VideoList from './videos/videoList';
import ConfigModal from './app/configModal';
import BottomAppBar from './app/bottomAppBar';
import ProFeatureDialog from "./app/proFeatureDialog";
import UpdateNotification from './app/updateNotification';
import PlaylistDialog from './videos/playlistDialog';
import About from './app/about';
import { creators as videoActions } from '../../main/videos/videoDuck';
import { creators as appStateActions } from '../../main/appState/appStateDuck';
import { ipcRenderer } from 'electron';
import licenseCheck from '../helpers/licenseCheck';

import ErrorNotification from './app/errorNotification';


const dropDivStyle = {
    outlineOffset: "-4px", 
    height: "100%",
    width: "100%",
    position: "absolute",
    zIndex: 0,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5em"
}
const  App  = (props) => {
    const [ dragAndDropMode, setDragAndDropMode ] = useState(false);
    const [ outline, setOutline ] = useState("none");
    const [ updateNotification, setUpdateNotification ] = useState(false);
    const [ hoverCounter, setHoverCounter ] = useState(false);
    const { classes } = props;
    const videoListReference = useRef();
    const setDragDropMode = useCallback((mode)=>{
        setDragAndDropMode(mode);
    }, [dragAndDropMode]);

    useEffect(()=>{
        ipcRenderer.on("update-available", (e, info)=>{
            setUpdateNotification(true)
        })
        licenseCheck().then((res)=>{
            if(res === "RESET"){
                props.changeLicense(true);
                props.licenseFailureCounter(res);
            } else {
                props.licenseFailureCounter("INC");
            }
        }).catch((e)=>{
            props.errorHandler({status: true, message: e});
        });

    },[]);

    const onDrop = (e)=>{
        let droppedItems = e.dataTransfer.items;
        setOutline("none");
        videoListReference.current.style.visibility ="visible";
        if(droppedItems){
            for(let x of droppedItems){
                if(x.type==="text/plain"){
                    x.getAsString((s)=>{
                        props.addVideoToPlaylist(s);
                    });
                }
            }
        }
    
    }
    const onDragOver = (e)=>{
        e.preventDefault();
    }
    const onDragEnterHandle = (e)=>{
        if(!dragAndDropMode){
            setOutline("2px dotted green");
            videoListReference.current.style.visibility = "hidden";
        }

    }
    const onDragLeaveHandle =(e)=>{
        setOutline("none");
        videoListReference.current.style.visibility = "visible";
    }

    const handleCloseUpdate = (bool)=>{
        ipcRenderer.send("QUIT_AND_INSTALL");
        setUpdateNotification(bool);
    }

        return (
            <MuiThemeProvider theme={theme}>
                <div 
                    style={{
                    height: 
                    `${window.innerHeight-100}px`, 
                    marginTop: "55px",
                    overflowY: "scroll",
                    position: "relative"
                }}
               >
                   <div
                    style={{
                        ...dropDivStyle, 
                        outline: outline,
                        backgroundColor: outline !=="none"? "gray": "",
                        backgroundImage: outline !=="none"?"repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.5) 35px, rgba(255,255,255,.5) 70px)":"none"
                    }}
                    onDragEnter={onDragEnterHandle}
                    onDragLeave={onDragLeaveHandle}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                   >
                       {outline !== "none"? "DROP HERE": ""}
                   </div>
                    <ButtonAppBar />
                    <VideoList reference={videoListReference} setDragAndDropMode={setDragDropMode} />
                    <ConfigModal />
                    <BottomAppBar />
                    <ProFeatureDialog />
                    <UpdateNotification open={updateNotification} handleClose={handleCloseUpdate}/>
                    <About />
                    <ErrorNotification error={props.error} closeErrorNotification={props.errorHandler}/>
                    <PlaylistDialog />
                </div>
            </MuiThemeProvider>
        );
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
export default  connect(mapStateToProps, mapDispatchToProps)(withStyles(null,{withTheme: true})(App));