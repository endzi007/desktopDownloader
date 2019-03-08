import React from 'react';
import { connect } from 'react-redux';
import Video from './singleVideo';
import { types as videoTypes } from '../../../main/videos/videoDuck';
import { Card, Typography } from '@material-ui/core';
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
    }
    handleDelete(url){
        this.props.dispatch({type: videoTypes.REMOVE, payload: url})
    }

    render(){
        let noVideos = "Drag and Drop YouTube video";
        let arrOfVideos = [];
        const { videos } = this.props;
        if(videos.length !== 0 ){
            videos.forEach((video, i) => {
                arrOfVideos.push(<Video parsing={false} key={`${video.url}_${i}`} {...video} handleDelete={this.handleDelete}/>);
            });
        }
        if(this.props.appState.parsingData.bool){
            arrOfVideos.push(
                <Card style={{
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
            height: videos.length === 0? window.innerHeight-96+"px": "auto",
            display: videos.length === 0? "flex": "block",
            padding: 15
        };

        let renderDiv = arrOfVideos.length === 0? noVideos : arrOfVideos;
    
        return (
        <div style={styles}>{renderDiv}</div>);
    }
};

export default connect(mapStateToProps)(VideoList);