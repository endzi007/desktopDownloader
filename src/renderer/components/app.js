import React, { useRef, useState, useEffect } from 'react';
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

const  App  = (props) => {
    const [ mode, setMode ] = useState();
    const [ outline, setOutline ] = useState("hide");
    const [ updateNotification, setUpdateNotification ] = useState(false);
    const [ hoverCounter, setHoverCounter ] = useState(false);
    const { classes } = props;
    let reference = useRef();
    
    const onDrop = (e)=>{
        let droppedItems = e.dataTransfer.items;
        //setOutline
        console.log("called on drop");
        setOutline("hide");
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

    const onDragStart = (e)=> {

    }
    const onDragOver = (e)=>{
        e.preventDefault();
    }
    const onDragEnterHandle = (e)=>{ 
        console.log("onDragEnter");
        setHoverCounter(true);
    }
    const onDragLeaveHandle =(e)=>{
        console.log("onDragLeave");
        setHoverCounter(false);
    }
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

/*     useEffect(()=>{
        reference.current.addEventListener("dragenter", (e)=>{
            setHoverCounter(true);
        })
        reference.current.addEventListener("dragleave", (e)=>{
            setHoverCounter(false);
        })
    },[]); */
    useEffect(()=>{
        if(hoverCounter){
            setOutline("show");
        } else {
            setOutline("hide");
        }
    },[hoverCounter]);
    const handleCloseUpdate = (bool)=>{
        ipcRenderer.send("QUIT_AND_INSTALL");
        setUpdateNotification(bool);
    }

        return (
            <MuiThemeProvider theme={theme}>
                <div 
                    ref={reference}
                    style={{
                    outlineOffset: "-4px", 
                    height: 
                    `${window.innerHeight-100}px`, 
                    outline: outline === "show"? `4px dashed ${theme.palette.secondary.main}`: "none",
                    marginTop: "55px",
                    overflowY: "scroll"
                }}
                onDragEnter={onDragEnterHandle}
                onDragLeave={onDragLeaveHandle}
                onDrop={onDrop} 
               >
                    <ButtonAppBar />
                    <VideoList reference={reference} />
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
export default  withStyles(null,{withTheme: true})(connect(mapStateToProps, mapDispatchToProps)(App));