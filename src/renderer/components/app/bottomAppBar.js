import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Fab, Tooltip, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { creators as videoActions } from '../../../main/videos/videoDuck';
import { creators as uiActions } from '../../../main/ui/uiDuck';
import { creators as optionActions } from '../../../main/options/optionsDuck';
import { creators as appStateActions } from '../../../main/appState/appStateDuck';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import StopIcon from '@material-ui/icons/Stop';
import { ipcRenderer } from 'electron';
const styles = theme => ({
  root:{
    top: "auto",
    bottom: 0,
    textAlign: "center",
    backgroundColor: theme.palette.background.default
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  },
  flex: {
    justifyContent: "space-arround"
  }
});

function BottomAppBar(props) {

  const [ duration, setDuration ] = useState({duration: 0, number: 0});

  useEffect(()=>{
    let projectDuration = 0;
    let number = 0; 
    for (let video of props.videos){
      projectDuration+= video.range.range[1];
      number++;
    }
    setDuration({duration: projectDuration, number: number });
  },[props.videos])
  let h= Math.floor(duration.duration / 3600);
  let m =  Math.floor(duration.duration % 3600 / 60);
  let s=  Math.floor(duration.duration % 3600 % 60);
  const { classes } = props;
  let buttonToDisplay;
  if(props.downloading !== 0){
    buttonToDisplay = <Fab onClick={()=>{
                            props.resetLimit();
                            //props.downloadingStarted(0);
                            ipcRenderer.send("STOP_ALL");
                      }} color="secondary" className={classes.fabButton}>
                        <StopIcon />
                      </Fab>
  } else {
    buttonToDisplay = <Fab onClick={()=>{
                            props.resetLimit();
                            //props.downloadingStarted(1);
                            props.startVideoDownload(props.videos[0].url);
                      }} color="secondary" className={classes.fabButton}>
                        <SaveAltIcon />
                      </Fab>
  }

  return (
      <AppBar position="fixed" className={classes.root}>
        <Tooltip title= "Download All" aria-label="Download All">
          {buttonToDisplay}
        </Tooltip>
        <Toolbar style={{ justifyContent: "space-evenly"}}className={classes.flex} variant="dense">
          <Typography>{`Duration: ${h===0 ? "": h>9? h+":": "0"+h+":"}${m>9? m: "0"+m}:${s>9?s: "0"+s}`}</Typography>
          <Typography>{`Items in: ${duration.number}`}</Typography>
        </Toolbar>
      </AppBar>
  );
}

function mapStateToProps(store){
    return {
      videos: store.videos,
      downloading: store.appState.downloading
    }
}
const  mapDispatchToProps = {
  showConfigPanel: uiActions.showConfigPanel,
  startVideoDownload: videoActions.startVideoDownload,
  resetLimit: optionActions.resetLimit,
  downloadingStarted: appStateActions.downloading
};
  


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(BottomAppBar));