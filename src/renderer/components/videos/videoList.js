import React from 'react';
import { connect } from 'react-redux';
import Video from './singleVideo';
function mapStateToProps (state){
    return {
        videos: state.videos
    }
}
export default connect(mapStateToProps)(({videos})=>{
    
    let noVideos = "No videos found!";
    let arrOfVideos = [];
    
    if(videos.length !== 0 ){
        videos.forEach((video, i) => {
            arrOfVideos.push(<Video key={`${video.url}_${i}`} img={video.thumbnail} title={video.title} url={video.url} downloaded={video.downloaded} />);
        });
    }
    console.log(arrOfVideos, "videos on videoslist");
    let renderDiv = videos.length === 0? noVideos : arrOfVideos;
    return (<div style={{padding: "15px"}}>{renderDiv}</div>);
});