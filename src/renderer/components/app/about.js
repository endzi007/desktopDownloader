import React, { useState } from 'react';
import { Dialog, Typography, DialogContent, DialogTitle, Slide } from '@material-ui/core';
import { connect } from 'react-redux';
import { creators as uiActions } from '../../../main/ui/uiDuck';
import { version } from '../../../../package.json';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const  ProFeatureDialog = (props) => {
  const [ textBox, setTextBox ] = useState("");
  const [ licenceMessage, setLicenceMessage ] = useState("");
  const handleClose = () => {
    props.showAboutFn(false);
  };
    return (
      <div>
        <Dialog
          open={props.showAbout}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose.bind(this)}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            About DeDex Video downloader
          </DialogTitle>
          <DialogContent>
                <Typography variant="h6">Dedex Video Downloader </Typography>
                <Typography variant="body1">Current Version: {version}
                <span style={{display: props.license.status === true? "block": "none" }}>licenced PRO version</span>
                </Typography>
                <Typography variant="subtitle2">Copyright {new Date().getFullYear()} DeCom doo Montenegro</Typography>
                <Typography variant="subtitle2">All rights reserved</Typography>
          </DialogContent>
        </Dialog>
      </div>
    );
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
