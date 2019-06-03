import React, { useState, useMemo, useEffect } from 'react';
import { Button, Dialog, LinearProgress, Typography, DialogActions, DialogContent, DialogTitle, Slide, Checkbox, FormControlLabel } from '@material-ui/core';
import { connect } from 'react-redux';
import { creators as uiActions } from '../../../main/ui/uiDuck';
import { creators as videoActions } from '../../../main/videos/videoDuck';
import { execFile } from 'child_process';
import events from 'events';
import path from 'path';
import PlaylistSingleVideo from './playlistSingleVideo';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const  PlaylistDialog = (props)=> {
  const [ videos, setVideos ] = useState([]);
  const [ fetching, setFetching ] = useState(false);
  const [ selectAll, setSelectAll ] = useState({ text: "Select all", checked: false});
  let infoObj = {
    info: execFile(path.resolve(__static, "youtube-dl.exe"), [props.showPlaylistDialog.playlistUrl,  "--get-title", "--get-thumbnail",  "--get-duration", "--ignore-errors", "--no-warnings"]),
    getAdditionalInfo: function(){
        const { videos } = props.showPlaylistDialog;
        let index = 0;
        let newVideos = videos;
        let dataArr = [];
        this.info.stdout.on("data", (data)=>{
          let infos = data.split("\n");
          infos.pop();
          dataArr = dataArr.concat(infos);
          if(dataArr.length === 3){
            console.log(dataArr);
            newVideos[index].title = dataArr[0];
            newVideos[index].thumbnail=dataArr[1];
            newVideos[index].duration=dataArr[2];
            setVideos([...newVideos]);
            dataArr = [];
            index++;
          }
        })
    
        this.info.stderr.on("data", (err)=>{
          if(err.indexOf("available") !==-1 || err.indexOf("unavailable")){
            newVideos[index].status = "ERROR";
            index++;
          } else if(err.indexOf("country")){
            console.log(err, "rr");
            newVideos[index].status = "ERROR";
            index++;
          }
        })
        this.info.on("close", ()=>{
          setFetching(false);
          setVideos((prevVideos)=>{
            let filteredVideos =[];
            for(let vid of prevVideos){
                if(vid.status !== "ERROR"){
                  filteredVideos.push(vid);
                }
            }
            return filteredVideos;
          });
        });
    },
    killFn: function(){
      this.info.kill();
    }
  }
  
  useEffect(()=>{
    if(props.showPlaylistDialog.videos !== videos){
      setVideos(props.showPlaylistDialog.videos);
      setFetching(true);
      infoObj.getAdditionalInfo();
      console.log(infoObj, "infoObj");
    }
  }, [props.showPlaylistDialog.videos]);

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

  

    let videosToDisplay = [];
    if(videos.length > 0){
      for (let i in videos){
        let video = videos[i];
        videosToDisplay.push(<PlaylistSingleVideo key={videos[i].url} iPosition ={i} {...video} handleChange={handleChange} />)
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
            <Typography variant="body1">{selectAll.text}</Typography>
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
            <Button onClick={()=>{
              handleClose();
              infoObj.killFn();
            }} color="primary">
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
