import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ControlPoint from '@material-ui/icons/ControlPoint';
import { IconButton } from '@material-ui/core';
import Build from '@material-ui/icons/Build';
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
          <IconButton variant="contained" className={classes.button}>
            <ControlPoint color="inherit"  />
          </IconButton>
          <IconButton>
          <Build color="inherit" className={classes.buttonIcon} />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}


export default withStyles(styles)(ButtonAppBar);