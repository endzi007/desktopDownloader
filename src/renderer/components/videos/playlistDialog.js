import React, { useState, useMemo, useEffect } from 'react';
import { Button, Dialog, LinearProgress, Typography, DialogActions, DialogContent, DialogTitle, Slide, Checkbox, FormControlLabel } from '@material-ui/core';
import { connect } from 'react-redux';
import { creators as uiActions } from '../../../main/ui/uiDuck';
import { creators as videoActions } from '../../../main/videos/videoDuck';
import { execFile } from 'child_process';
import path from 'path';
import PlaylistSingleVideo from './playlistSingleVideo';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const  PlaylistDialog = (props)=> {
  const [ videos, setVideos ] = useState([]);
  const [ fetching, setFetching ] = useState(false);
  const [ selectAll, setSelectAll ] = useState({ text: "Select all", checked: false});

  useEffect(()=>{
    if(props.showPlaylistDialog.videos !== videos){
      setVideos(props.showPlaylistDialog.videos);
      setTimeout(()=>{
        console.log(props.showPlaylistDialog.videos);
      }, 100)
      setFetching(true);
      getAdditionalInfo();
    }
  }, [props.showPlaylistDialog.videos]);
  useEffect(()=>{
    console.log(videos);
  }, [videos]);
  const handleClose = ()=> {
    props.showPlaylistDialogFn({show: false, videos: []});
  };

  const handleChange = (index, e)=>{
    let value = e.target.value;
    let newVideos = [...videos];
    if(value === "Select all"){
        setSelectAll({text: "Deselect all", checked: true})
        newVideos.map((video)=>{
          video.status = "NOT_STARTED"
        })
        setVideos([...newVideos]);
    } else if(value === "Deselect all"){
        setSelectAll({text: "Select all", checked: false})
        newVideos.map((video)=>{
          video.status = "NOT_CHECKED"
        })
        setVideos([...newVideos]);
    } else {
      if(newVideos[index].status === "NOT_CHECKED"){
        newVideos[index].status="NOT_STARTED"
      } else {
        newVideos[index].status="NOT_CHECKED"
      }
      setVideos([...newVideos]);
    }
  }

  const getSingleVideoInfo = (url, index, retries)=>{
    return new Promise((resolve, reject)=>{
      let info = execFile(path.resolve(__static, "youtube-dl.exe"), [`https://www.youtube.com/watch?v=${url}`, "--get-thumbnail", "--get-duration", "--ignore-errors"]);
      info.stdout.on("data", (data)=>{
        let infos = data.split("\n");
        if(infos.length===3){
          let newVideos = videos;
          newVideos[index].thumbnail=infos[0];
          newVideos[index].duration=infos[1];
          setVideos([...newVideos]);
          resolve("OK",{});
        } else {
          if(retries >= 2){
            resolve("PARSING_FAILED")
          } else{
            getSingleVideoInfo(url, index, retries+1);
          }
        }
      });

      info.stderr.on("data", (err)=>{

      })
      
    });

  }
  const getAdditionalInfo = ()=>{
    const { videos, playlistUrl } = props.showPlaylistDialog;
    let index = 0;
    let counter = 0;
    let info = execFile(path.resolve(__static, "youtube-dl.exe"), [playlistUrl, "--get-thumbnail", "--get-duration", "--ignore-errors"]);
    info.stdout.on("data", (data)=>{
      console.log(data);
      let infos = data.split("\n");
      let newVideos = videos;
      if(infos.length === 3){
        newVideos[index].thumbnail=infos[0];
        newVideos[index].duration=infos[1];
        setVideos([...newVideos]);
        index++;
      } else {
        if(counter===0){
          newVideos[index].thumbnail=infos[0];
          counter++;
        } else {
          newVideos[index].duration=infos[0];
          counter = 0;
          index++;
        }
      }

    })
    info.stderr.on("data", (err)=>{
      index++;
    })
    info.on("close", ()=>{
      setFetching(false);
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
    let progress = fetching === true ? <LinearProgress /> : "";
    return (
      <div>
        <Dialog
          open={props.showPlaylistDialog.show}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose.bind(this)}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          disableBackdropClick = {true}
        >
          <DialogTitle id="alert-dialog-slide-title">
            Select videos
          </DialogTitle>

          <DialogContent style={{display: "flex", flexDirection: "row", justifyContent:"flex-end"}}>
            <Typography variant="body1">Select all: </Typography>
            <Checkbox
                checked={selectAll.checked}
                value={selectAll.text}
                onChange={handleChange.bind(null, !selectAll.checked)}
              />
          </DialogContent>
          <DialogContent>
              {videosToDisplay}
          </DialogContent>
            {progress}
          <DialogActions>
          <Button disabled={fetching} onClick={()=>{
            let videosToAdd = [];
            for(let vid of videos){
              if(vid.status === "NOT_STARTED"){
                videosToAdd.push(vid);
              }
            }
            props.addParsedPlaylist(videosToAdd);
            props.showPlaylistDialogFn({show: false, videos: []})
          }} color="primary">
              Add to playlist 
            </Button>
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
      showPlaylistDialog: store.uiConfig.showPlaylistDialog    
    }
}

const mapDispatchToProps = {
    showPlaylistDialogFn: uiActions.showPlaylistDialog,
    addParsedPlaylist: videoActions.addParsedPlaylist
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistDialog);
