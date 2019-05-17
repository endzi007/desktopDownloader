import React from 'react';
import { Button, Dialog, TextField, Typography, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@material-ui/core';
import { connect } from 'react-redux';
import { creators as uiActions } from '../../../main/ui/uiDuck';
import { execFile } from 'child_process';
import path from 'path';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class PlaylistDialog extends React.Component {
  constructor(props){
    super(props);
    this.getAdditionalInfo = this.getAdditionalInfo.bind(this);
  }
  handleClose() {
    this.props.showPlaylistDialog({show: false, videos: []});
  };

  render() {
      let videosToDisplay = [];
      for (let video of this.props.uiConfig.showPlaylistDialog.videos){
        videosToDisplay.push(<div>{video.title}</div>)
      }
    return (
      <div>
        <Dialog
          open={this.props.uiConfig.showPlaylistDialog.show}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose.bind(this)}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            Select videos
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {videosToDisplay}
            </DialogContentText>
              <Typography variant="body1">Modal</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose.bind(this)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(store){
    return {
        uiConfig: store.uiConfig    
    }
}

const mapDispatchToProps = {
    showPlaylistDialog: uiActions.showPlaylistDialog
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistDialog);
