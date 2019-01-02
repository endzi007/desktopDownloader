import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Fab } from '@material-ui/core';
import Build from '@material-ui/icons/Build';
import { connect } from 'react-redux';
import { startVideoDownload } from '../../../main/actions';
import { showConfigPanel } from '../../../main/actions/uiActions';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
const styles = theme => ({
  root:{
    top: "auto",
    bottom: 0,
    textAlign: "center"
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
  return (
      <AppBar position="fixed" className={classes.root}>
          <Fab onClick={()=>{
                props.startVideoDownload(props.videos[0].url);
          }} color="secondary" className={classes.fabButton}>
            <SaveAltIcon />
          </Fab>
        <Toolbar className={classes.flex} variant="dense">
        </Toolbar>
      </AppBar>
  );
}

function mapStateToProps(store){
    return {
      videos: store.videos
    }
}
const  mapDispatchToProps = {
  showConfigPanel,
  startVideoDownload
};
  


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(BottomAppBar));