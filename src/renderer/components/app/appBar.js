import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ControlPoint from '@material-ui/icons/ControlPoint';
import { IconButton, Tooltip } from '@material-ui/core';
import Build from '@material-ui/icons/Build';
import ClearAll from '@material-ui/icons/ClearAll'
import Save from '@material-ui/icons/Save'
import Open from '@material-ui/icons/FolderOpen'
import Cached from '@material-ui/icons/Cached';
import { connect } from 'react-redux';
import { creators as videoActions } from '../../../main/videos/videoDuck';
import { creators as uiActions } from '../../../main/ui/uiDuck';
import { creators as optionsActions } from '../../../main/options/optionsDuck';

    


const styles = theme => ({
  root:{
    padding: 0,
    margin: 0
  },
  appBar: {
    backgroundColor: theme.palette.background.default
  },
  flex:{
    display: "flex",
    justifyContent: "space-between",
    flexGrow: 1
  },
  buttonIcon: {
    margin: theme.spacing.unit/4
  },
  button: {
    boxShadow: "none",
    marginLeft: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }
});

function ButtonAppBar(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="fixed" style={{"WebkitAppRegion": "drag"}}>
        <Toolbar className={classes.flex} variant="dense">
          <Tooltip title="Paste link" aria-label="Paste URL from Clipboard" placement="bottom">
            <IconButton variant="contained" onClick={()=>{
              props.addVideoToPlaylist();
            }} className={classes.button}>
              <ControlPoint color="inherit" />
            </IconButton>
          </Tooltip>

          <div>
            <Tooltip title="Save" aria-label="Save" placement="bottom">
                <IconButton onClick={()=>{props.savePlaylist(); }} >
                <Save color="inherit" className={classes.buttonIcon} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Open" aria-label="Open" placement="bottom">
                <IconButton onClick={()=>{ props.loadPlaylist(); }} >
                <Open color="inherit" className={classes.buttonIcon} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Clear All" aria-label="Clear All" placement="bottom">
                <IconButton onClick={()=>{ 
                  props.clearAll(); 
                  props.resetLimit();
                  }}>
                <ClearAll color="inherit" className={classes.buttonIcon} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Open config" aria-label="Open config" placement="bottom">
              <IconButton onClick={()=>{ props.showConfigPanel(true, "local");}}>
              <Build color="inherit" className={classes.buttonIcon} />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

function mapStateToProps(store){
    return {
      videos: store.videos
    }
}
const  mapDispatchToProps = {
  addVideoToPlaylist: videoActions.addVideoToPlaylist,
  showConfigPanel: uiActions.showConfigPanel,
  resetLimit: optionsActions.resetLimit,
  autoNumbering: optionsActions.autoNumbering,
  clearAll: videoActions.clearAll,
  savePlaylist: videoActions.savePlaylist,
  loadPlaylist: videoActions.loadPlaylist,
};
  


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ButtonAppBar));