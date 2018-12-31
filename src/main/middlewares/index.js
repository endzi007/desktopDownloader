import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import appConfig from '../appConfig';
import downloadAndConvert from '../ffmpegProcesses';
import { ADD_VIDEO_TO_PLAYLIST, DOWNLOAD_PROGRESS_COUNTER, START_VIDEO_DOWNLOAD, DOWNLOAD_NEXT_VIDEO } from '../actions';
import { INCREASE_LIMIT } from '../actions/optionsActions';

ffmpeg.setFfmpegPath(appConfig.ffmpegPath);


export default (store)=>(next)=>(action)=>{
    let state = store.getState();
    switch(action.type){
        case ADD_VIDEO_TO_PLAYLIST:
            //check if is valid url 
            let validateUrl = ytdl.validateURL(action.payload);
            if(validateUrl){
                //let video = ytdl(action.payload, { filter: (format) => format.container === 'mp4'});
                let videoObj = {
                    title: "",
                    thumbnail: "",
                    downloaded: 0,
                    url: "",
                    duration: "",
                    downloadLinks: []
                }
                ytdl.getInfo(action.payload, (err, info)=>{
                    let date = new Date(null);
                    date.setSeconds(info.length_seconds); // specify value for SECONDS here
                    let duration = date.toISOString().substr(11, 8);
                    videoObj.duration = duration;
                    videoObj.title = info.title;
                    videoObj.thumbnail = info.thumbnail_url;
                    videoObj.url = action.payload;
                    action.payload = videoObj;
                    action.type = `${ADD_VIDEO_TO_PLAYLIST}_PROCESSED`,
                    console.log(info);
                    next(action);
                });
            } else {
                action.type = "CANCELED_ACTION";
            }
            next(action);
            break;
        case START_VIDEO_DOWNLOAD:
            for(let i = state.options.parallel.index; i<state.options.parallel.limit; i++){
                downloadAndConvert(store, i).then(()=>{
                    store.dispatch({ type: DOWNLOAD_NEXT_VIDEO });
                });
            }
            break;  
        
        case DOWNLOAD_NEXT_VIDEO:
            if(state.options.parallel.index <= state.videos.length){
                downloadAndConvert(store, i).then(()=>{
                    store.dispatch({ type: DOWNLOAD_NEXT_VIDEO });
                });
            }
            break;
        default: 
        break;
    }
    next(action);
}