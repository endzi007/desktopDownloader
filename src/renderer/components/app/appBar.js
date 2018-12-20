import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ControlPoint from '@material-ui/icons/ControlPoint';
import { IconButton } from '@material-ui/core';
import Build from '@material-ui/icons/Build';
import { connect } from 'react-redux';
const styles = theme => ({
  root:{
    padding: 0,
    margin: 0,
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
      <AppBar position="static" style={{"WebkitAppRegion": "drag"}}>
        <Toolbar className={classes.flex} variant="dense">
          <IconButton variant="contained" onClick={()=>{
            props.dispatch({ type: "DOWNLOAD_VIDEO", payload: props.videos[0].url})
          }} className={classes.button}>
            <ControlPoint color="inherit"  />
          </IconButton>
          <IconButton>
          <Build color="inherit" className={classes.buttonIcon} onClick={()=>{
            props.dispatch({type: "SHOW_CONFIG", payload: true, meta: {scope: "local"}})
          }} />
          </IconButton>
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

export default withStyles(styles)(connect(mapStateToProps)(ButtonAppBar));