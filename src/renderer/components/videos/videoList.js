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
        let noVideos = "No videos found!";
        let arrOfVideos = [];
        const { videos } = this.props;
        if(videos.length !== 0 ){
            videos.forEach((video, i) => {
                arrOfVideos.push(<Video key={`${video.url}_${i}`} {...video} handleDelete={this.handleDelete}/>);
            });
        }
        let renderDiv = videos.length === 0? noVideos : arrOfVideos;
    
        return (<div style={{padding: "15px"}}>{renderDiv}</div>);
    }
};

export default connect(mapStateToProps)(VideoList);