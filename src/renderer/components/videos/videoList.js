import React from 'react';
import { connect } from 'react-redux';
import Video from './singleVideo';
import { types as videoTypes } from '../../../main/videos/videoDuck';
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
        let noVideos = "Drag and Drop online video/url, or paste using + sign above";
        let arrOfVideos = [];
        const { videos } = props;
        if(videos.length !== 0 ){
            videos.forEach((video, i) => {
                arrOfVideos.push(<Video iPosition={i} parsing={false} key={`${video.url}_${i}`} {...video} handleDelete={handleDelete.bind(this)} handlePauseResume={handlePauseResume.bind(this)} customRange={props.handleCustomRange}/>);
            });
        }
        if(props.appState.parsingData.bool){
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
                    <Typography variant="body1"> Getting info...</Typography>
                </Card>
            )
        }

        let renderDiv = arrOfVideos.length === 0? noVideos : arrOfVideos;
    
        return <div style={{...styles,
            height: videos.length === 0? "100%": "auto",
            display: videos.length === 0? "flex": "block"
        }}><Typography style={{textAlign: "center"}}variant="title" color="inherit">{renderDiv}</Typography></div>;
    }

const mapDispatchToProps = {
    removeVideoFromPlaylist: videoActions.removeVideoFromPlaylist,
    handleCustomRange: videoActions.handleCustomRange,
    resumeVideoDownload: videoActions.resumeVideoDownload
}
export default connect(mapStateToProps, mapDispatchToProps)(VideoList);