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

class PlaylistDialog extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      videos: []
    }
    this.getAdditionalInfo = this.getAdditionalInfo.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateStateVideo = this.updateStateVideo.bind(this);
  }
  handleClose() {
    this.props.showPlaylistDialog({show: false, videos: []});
  };
  handleChange(e){
    console.log(e.target.checked);
  }
  getAdditionalInfo(){
    const { videos, playlistUrl } = this.props.uiConfig.showPlaylistDialog;
    let index = 0;
    let info = execFile(path.resolve(__static, "youtube-dl.exe"), [playlistUrl, "--get-thumbnail", "--get-duration"]);
    info.stdout.on("data", (data)=>{
      if(index===10){
        info.kill();
      }
      this.updateStateVideo(index, data.split("\n"));
      index++;
    })
    info.stderr.on("data", (err)=>{
      console.log(err);
      index++;
      info.kill();
    })
    info.on("close", ()=>{
      console.log("closed");
    });
  }
  updateStateVideo(i, data){
    let vid = this.state.videos[i]
    vid.thumbnail = data[0];
    vid.duration = data[1];
    this.setState({
      videos: this.state.videos.splice(i, 1, vid)
    })
    
  }

  componentWillUpdate(nextProps){
    if(nextProps.uiConfig.showPlaylistDialog.videos !== this.state.videos){
      this.setState({
        videos: nextProps.uiConfig.showPlaylistDialog.videos
      })
      setTimeout(()=>{
        this.getAdditionalInfo();
      }, 0)
    }
  }
  render() {
      let videosToDisplay = [];
      const { videos } = this.state;
      for (let i in videos){
        let video = videos[i];
        videosToDisplay.push(<PlaylistSingleVideo iPosition ={i} {...video} handleChange={this.handleChange} />)
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
              {videosToDisplay}
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
