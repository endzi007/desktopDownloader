/* eslint-disable react/prop-types */
import React, { useRef, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import Video from './singleVideo';
import { creators as videoActions } from '../../../main/videos/videoDuck';
import { Card, Typography } from '@material-ui/core';
import { ipcRenderer } from 'electron';
function mapStateToProps (state){
    return {
        videos: state.videos,
        appState: state.appState
    }
}

let styles = {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    color: "darkgray",
    fontSize: "2em",
    paddingLeft: 15, paddingRight: 15, paddingTop: 0, paddingBottom: 0
};

const VideoList = (props) => {
    let draggedVid = useRef(0);
    let draggedTo = useRef(0);
    const setFromAndTo = useCallback((val, from)=>{
        if(from === 1){
            draggedVid = val;
        } else if(from === 2) {
            draggedTo = val;
        } else {
            console.log("call swap function", draggedVid, draggedTo);

        }
    },[]);
    const handleDelete = (url)=>{
        props.removeVideoFromPlaylist(url);
    }
    const handlePauseResume = (pause, i)=>{
        if(pause){
            ipcRenderer.send("PAUSE_VIDEO", i);
        } else {
            props.resumeVideoDownload(i)
        }
    }
        let noVideos = <Typography variant="h6" align="center" color="inherit">Drag and Drop online video/url or paste using + sign above</Typography>
        let arrOfVideos = [];
        const { videos } = props;
        if(videos.length !== 0 ){
            videos.forEach((video, i) => {
                arrOfVideos.push(<Video 
                    setDragAndDropMode={props.setDragAndDropMode} 
                    iPosition={i} 
                    parsing={false} 
                    key={`${video.url}_${i}`} 
                    {...video} 
                    handleDelete={handleDelete.bind(this)} 
                    handlePauseResume={handlePauseResume.bind(this)} 
                    customRange={props.handleCustomRange}
                    setFromAndTo={setFromAndTo}
                    />
                );
            });
        }
        if(props.appState.parsingData.count > 0){
            arrOfVideos.push(
                <Card 
                    key="gettingInfoCard"
                    style={{
                    display: "flex",
                    marginBottom: "5px",
                    flexGrow: "1",
                    maxHeight: "60px",
                    position: "relative"
                }}>
        <Typography variant="body1" align="right" noWrap>Getting info {props.appState.parsingData.count} left</Typography>
                </Card>
            )
        }

        let renderDiv = arrOfVideos.length === 0? noVideos : arrOfVideos;
    
        return <div style={{...styles,
            height: videos.length === 0? "100%": "auto",
            display: videos.length === 0? "flex": "block"
        }}><div ref={props.reference}>{renderDiv}</div></div>;
    }

const mapDispatchToProps = {
    removeVideoFromPlaylist: videoActions.removeVideoFromPlaylist,
    handleCustomRange: videoActions.handleCustomRange,
    resumeVideoDownload: videoActions.resumeVideoDownload
}
export default connect(mapStateToProps, mapDispatchToProps)(VideoList);