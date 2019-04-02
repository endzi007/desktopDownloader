import React from 'react';
import { Button, Dialog, TextField, Typography, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@material-ui/core';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import { creators as uiActions } from '../../../main/ui/uiDuck';
import { creators as appStateActions } from '../../../main/appState/appStateDuck';
import fetch from 'node-fetch';
import { machineId } from 'node-machine-id';
import { version } from '../../../../package.json';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ProFeatureDialog extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      textbox: "",
      licenceMessage: ""
    }
  }
  handleClose() {
    this.props.showAboutFn(false);
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.props.showAbout}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose.bind(this)}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            About DeDex Video downloader
          </DialogTitle>
          <DialogContent>
                <Typography variant="h6">Dedex Video Downloader </Typography>
                <Typography variant="body1">Current Version: {version}
                <span style={{display: this.props.license.status === true? "block": "none" }}>licenced PRO version</span>
                </Typography>
                <Typography variant="subtitle2">Copyright {new Date().getFullYear()} DeCom doo Montenegro</Typography>
                <Typography variant="subtitle2">All rights reserved</Typography>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(store){
    return {
        showAbout: store.uiConfig.showAbout,
        license: store.appState.license
    }
}

const mapDispatchToProps = {
    showAboutFn: uiActions.showAbout
}

export default connect(mapStateToProps, mapDispatchToProps)(ProFeatureDialog);
