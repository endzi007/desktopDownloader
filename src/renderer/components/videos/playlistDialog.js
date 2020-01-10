import React, { useState, useMemo, useEffect } from 'react';
import { Button, Dialog, LinearProgress, Typography, DialogActions, DialogContent, DialogTitle, Slide, Checkbox, FormControlLabel } from '@material-ui/core';
import { connect } from 'react-redux';
import { creators as uiActions } from '../../../main/ui/uiDuck';
import { creators as videoActions } from '../../../main/videos/videoDuck';
import { spawn } from 'child_process';
import events from 'events';
import path from 'path';
import PlaylistSingleVideo from './playlistSingleVideo';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const killEvent = new events.EventEmitter();



const  PlaylistDialog = (props)=> {
  const [ videos, setVideos ] = useState([]);
  const [ fetching, setFetching ] = useState(false);
  const [ selectAll, setSelectAll ] = useState({ text: "Select All", checked: false});
  const [ selectedVideosCount, setSelectedVideosCount ] = useState(0);
  useEffect(()=>{
    setVideos([...props.showPlaylistDialog.videos]);
    setFetching(true);
    if(props.showPlaylistDialog.videos.length > 0){
      getAdditionalInfo();
    }
    return ()=>{
      setVideos([]);
      setSelectAll({text: "Select All", checked: false});
      setSelectedVideosCount(0);
    }
  }, [props.showPlaylistDialog.videos]);

  const getAdditionalInfo = ()=> {
        const { videos, playlistUrl } = props.showPlaylistDialog;
        const info =  spawn(path.resolve(__static, "youtube-dl.exe"), ["--ignore-errors", "--dump-json", "--no-warnings",  playlistUrl ]);
        let index = 0;
        let newVideos = videos;
        let dataArr = [];
        info.stdout.on("data", (data)=>{
        let infoData = JSON.parse(data);
        newVideos[index].title = infoData.title;
        newVideos[index].thumbnail = infoData.thumbnail;
        newVideos[index].url = `https://www.youtube.com/watch?v=${infoData.id}`;
        newVideos[index].duration = Number.parseInt(infoData.duration);
        newVideos[index].range.range = [0, Number.parseInt(infoData.duration)]
        newVideos[index].downloadLinks = infoData.formats;
        setVideos([...newVideos]);
        index++;

        })
        killEvent.on("KILL", ()=>{
          info.kill();
        });
        info.stderr.on("data", (err)=>{
          newVideos[index].status = "ERROR";
          setVideos([...newVideos]);
          index++; 
        })
        info.on("close", ()=>{
            console.log("close called")
          
        });
        info.on("exit", ()=>{
            console.log("exit called");
          setFetching(false);
          setVideos((prevVideos)=>{
            let filteredVideos =[];
            if(prevVideos.length > 0){
              for(let vid of prevVideos){
                  if(vid.status !== "ERROR"){
                    filteredVideos.push(vid);
                  }
              }
            }
            return filteredVideos;
          });
        })
  }
  

  const handleClose = ()=> {
    props.showPlaylistDialogFn({show: false, videos: []});
  };

  const handleChange = (index, e)=>{
    let value = e.target.value;
    let newVideos = [...videos];
    if(value === "Select All"){
        setSelectAll({text: "Deselect All", checked: true})
        newVideos.map((video)=>{
          video.status = "NOT_STARTED"
        })
        setVideos([...newVideos]);
    } else if(value === "Deselect All"){
        setSelectAll({text: "Select All", checked: false})
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
    setSelectedVideosCount(()=>{
      return newVideos.reduce((x, current)=> (current.status === "NOT_STARTED"? x+1: x), 0);
      
    });
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

          <DialogContent style={{display: "flex", flexDirection: "row", justifyContent:"space-between"}}>
          <Typography variant="body1">{`Selected: ${selectedVideosCount}`}</Typography>
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
              //handleClose();
              if(fetching){
                killEvent.emit("KILL");
              } else {
                handleClose();
              }
              
            }} color="primary">
              {fetching === true? "Stop Fetching" : "Close"}
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
