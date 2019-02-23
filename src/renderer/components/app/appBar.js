import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ControlPoint from '@material-ui/icons/ControlPoint';
import { IconButton, Tooltip } from '@material-ui/core';
import Build from '@material-ui/icons/Build';
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
      <AppBar className={classes.appBar} position="static" style={{"WebkitAppRegion": "drag"}}>
        <Toolbar className={classes.flex} variant="dense">
          <Tooltip title="Paste link" aria-label="Paste URL from Clipboard" placement="bottom">
            <IconButton variant="contained" onClick={()=>{
              props.addVideoToPlaylist();
            }} className={classes.button}>
              <ControlPoint color="inherit" />
            </IconButton>
          </Tooltip>
          <IconButton>
          <Cached color="inherit" className={classes.buttonIcon} onClick={()=>{
            props.resetLimit();
          }} />
          </IconButton>
          <Tooltip title="Open config" aria-label="Open config" placement="bottom">
            <IconButton>
            <Build color="inherit" className={classes.buttonIcon} onClick={()=>{
              props.showConfigPanel(true, "local");
            }} />
            </IconButton>
          </Tooltip>
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
  resetLimit: optionsActions.resetLimit
};
  


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ButtonAppBar));