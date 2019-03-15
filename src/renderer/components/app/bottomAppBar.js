import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Fab, Tooltip, IconButton } from '@material-ui/core';
import { connect } from 'react-redux';
import { creators as videoActions } from '../../../main/videos/videoDuck';
import { creators as uiActions } from '../../../main/ui/uiDuck';
import { creators as optionActions } from '../../../main/options/optionsDuck';
import { creators as appStateActions } from '../../../main/appState/appStateDuck';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import StopIcon from '@material-ui/icons/Stop';
import KeyIcon from '@material-ui/icons/VpnKey';
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
});

function BottomAppBar(props) {
  const { classes } = props;
  let buttonToDisplay;
  if(props.downloading){
    buttonToDisplay = <Fab onClick={()=>{
                            props.resetLimit();
                            props.downloadingStarted(false);
                            ipcRenderer.send("STOP_ALL");
                      }} color="secondary" className={classes.fabButton}>
                        <StopIcon />
                      </Fab>
  } else {
    buttonToDisplay = <Fab onClick={()=>{
                            props.resetLimit();
                            props.downloadingStarted(true);
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
        <Toolbar className={classes.flex} variant="dense">
        <IconButton>
          <KeyIcon />
        </IconButton>
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