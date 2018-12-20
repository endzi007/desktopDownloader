import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, Dialog, ListItemText, ListItem, List, Divider, AppBar, Toolbar, IconButton, Typography, Slide } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';


const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ConfigModal extends React.Component {
    constructor(props){
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }

  handleClose () {
    this.props.dispatch({type: "SHOW_CONFIG", payload: false, meta: {scope: "local"}})
  };

  render() {
      console.log(this.props, "props on configModal");
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          fullScreen
          open={this.props.uiConfig.showConfig}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.flex}>
                Config
              </Typography>
              <Button color="inherit" onClick={this.handleClose}>
                save
              </Button>
            </Toolbar>
          </AppBar>
          <List>
            <ListItem button onClick={()=>{
                this.props.dispatch({type: "SHOW_OPEN_DIALOG", payload: true})
              }}>
              <ListItemText  primary="Phone ringtone" secondary="Titania" />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText primary="Default notification ringtone" secondary="Tethys" />
            </ListItem>
          </List>
        </Dialog>
      </div>
    );
  }
}

ConfigModal.propTypes = {
  classes: PropTypes.object.isRequired,
  uiConfig: PropTypes.object.isRequired
};

function mapStateToProps(state){
    return {
        uiConfig: state.uiConfig
    }
}
export default withStyles(styles)(connect(mapStateToProps)(ConfigModal));