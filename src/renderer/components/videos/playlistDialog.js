import React from 'react';
import { Button, Dialog, TextField, Typography, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@material-ui/core';
import { connect } from 'react-redux';
import { creators as uiActions } from '../../../main/ui/uiDuck';
import { execFile } from 'child_process';
import path from 'path';
import PlaylistSingleVideo from './playlistSingleVideo';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

function getInfo (video, getWhat){
  return new Promise ((res, rej)=>{
    let info = execFile(path.resolve(__static, "youtube-dl.exe"), [video.url, "--get-thumbnail", "--get-duration"]);
    let dataToReturn = [];
    info.stdout.on("data", (data)=>{
      if(dataToReturn.length === 1){
        dataToReturn.push (data);
        res(dataToReturn);
      } else {
        dataToReturn.push(data);
      }
    })

    info.stderr.on("data", (err)=>{
      rej(err);
    })

  });
}
class PlaylistDialog extends React.Component {
  constructor(props){
    super(props);
    this.getAdditionalInfo = this.getAdditionalInfo.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleClose() {
    this.props.showPlaylistDialog({show: false, videos: []});
  };
  handleChange(e){
    console.log(e.target.checked);
  }
  async getAdditionalInfo(){
    const { videos } = this.props.uiConfig.showPlaylistDialog;
    for (let video of videos ){
      let thumb = await getInfo(video, "thumb");
      console.log(thumb);

    }
  }

  componentDidMount(){
    if(this.props.uiConfig.showPlaylistDialog.videos.length > 0){
      this.getAdditionalInfo();
    }
  }
  render() {
      let videosToDisplay = [];
      const { videos } = this.props.uiConfig.showPlaylistDialog;
      const thumbPlaceholder = path.resolve(__static, "assets", "noThumbnail.jpg");
      for (let i in videos){
        let video = videos[i];
        videosToDisplay.push(<PlaylistSingleVideo title={video.title} url={video.url} thumbnail={thumbPlaceholder} iPosition = {i} duration="" handleChange={this.handleChange} />)
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
