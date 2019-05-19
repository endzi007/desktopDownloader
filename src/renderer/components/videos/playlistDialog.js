import React, { useState, useMemo, useEffect } from 'react';
import { Button, Dialog, TextField, Typography, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@material-ui/core';
import { connect } from 'react-redux';
import { creators as uiActions } from '../../../main/ui/uiDuck';
import { execFile } from 'child_process';
import path from 'path';
import PlaylistSingleVideo from './playlistSingleVideo';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const  PlaylistDialog = (props)=> {
  const [ videos, setVideos ] = useState([])
  useEffect(()=>{
    if(props.uiConfig.showPlaylistDialog.videos !== videos){
      setVideos(props.uiConfig.showPlaylistDialog.videos);
      getAdditionalInfo();
    }
  }, []);

  const handleClose = ()=> {
    props.showPlaylistDialog({show: false, videos: []});
  };

  const handleChange = (e)=>{
    console.log(e.target.checked);
  }
  const getAdditionalInfo = ()=>{
    const { videos, playlistUrl } = props.uiConfig.showPlaylistDialog;
    let index = 0;
    let info = execFile(path.resolve(__static, "youtube-dl.exe"), [playlistUrl, "--get-thumbnail", "--get-duration"]);
    info.stdout.on("data", (data)=>{
      let infos = data.split("\n");
      let newVideos = videos;
      newVideos[index].thumbnail=infos[0];
      newVideos[index].duration=infos[1];
      setVideos([...newVideos]);
      index++;
    })
    info.stderr.on("data", (err)=>{
      console.log(err);
    })
    info.on("close", ()=>{
      console.log("closed");
    });
  }

    let videosToDisplay = [];
    if(videos.length > 0){
      for (let i in videos){
        let video = videos[i];
        videosToDisplay.push(<PlaylistSingleVideo iPosition ={i} {...video} handleChange={handleChange} />)
      }
    }
    return (
      <div>
        <Dialog
          open={props.uiConfig.showPlaylistDialog.show}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose.bind(this)}
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
            <Button onClick={handleClose.bind(this)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
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
