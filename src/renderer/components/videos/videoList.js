import React from 'react';
import { connect } from 'react-redux';
import Video from './singleVideo';
import { REMOVE_VIDEO_FROM_PLAYLIST } from '../../../main/actions';
function mapStateToProps (state){
    return {
        videos: state.videos
    }
}

class VideoList extends React.Component{
    constructor(props){
        super(props);
        this.handleDelete = this.handleDelete.bind(this)
    }
    handleDelete(url){
        this.props.dispatch({type: REMOVE_VIDEO_FROM_PLAYLIST, payload: url})
    }

    render(){
        let noVideos = "Drag and Drop YouTube video";
        let arrOfVideos = [];
        const { videos } = this.props;
        if(videos.length !== 0 ){
            videos.forEach((video, i) => {
                arrOfVideos.push(<Video key={`${video.url}_${i}`} {...video} handleDelete={this.handleDelete}/>);
            });
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

        let renderDiv = videos.length === 0? noVideos : arrOfVideos;
    
        return (
        <div style={styles}>{renderDiv}</div>);
    }
};

export default connect(mapStateToProps)(VideoList);