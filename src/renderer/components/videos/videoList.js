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

class VideoList extends React.Component{
    constructor(props){
        super(props);
        this.handleDelete = this.handleDelete.bind(this)
        this.handlePauseResume = this.handlePauseResume.bind(this);
    }
    handleDelete(url){
        this.props.removeVideoFromPlaylist(url);
    }
    handlePauseResume(pause, i){
        if(pause){
            ipcRenderer.send("PAUSE_VIDEO", i);
        } else {
            this.props.dispatch({type: videoTypes.RESUME_VIDEO_DOWNLOAD, payload: i})
        }
    }

    handleCustomRange(range, index){
        //dispatch custom range for selected video
    }

    render(){
        let noVideos = "Drag and Drop YouTube video";
        let arrOfVideos = [];
        const { videos } = this.props;
        if(videos.length !== 0 ){
            videos.forEach((video, i) => {
                arrOfVideos.push(<Video iPosition={i} parsing={false} key={`${video.url}_${i}`} {...video} handleDelete={this.handleDelete} handlePauseResume={this.handlePauseResume} customRange={this.props.handleCustomRange}/>);
            });
        }
        if(this.props.appState.parsingData.bool){
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
        let styles = {
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            color: "darkgray",
            fontSize: "2em",
            height: videos.length === 0? "100%": "auto",
            display: videos.length === 0? "flex": "block",
            paddingLeft: 15, paddingRight: 15, paddingTop: 0, paddingBottom: 0
        };

        let renderDiv = arrOfVideos.length === 0? noVideos : arrOfVideos;
    
        return (
        <div style={styles}>{renderDiv}</div>);
    }
};

const mapDispatchToProps = {
    removeVideoFromPlaylist: videoActions.removeVideoFromPlaylist,
    handleCustomRange: videoActions.handleCustomRange
}
export default connect(mapStateToProps, mapDispatchToProps)(VideoList);