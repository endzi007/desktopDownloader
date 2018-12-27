import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import appConfig from '../appConfig';
import downloadAndConvert from '../ffmpegProcesses';
import { ADD_VIDEO_TO_PLAYLIST, DOWNLOAD_PROGRESS_COUNTER, START_VIDEO_DOWNLOAD } from '../actions';

ffmpeg.setFfmpegPath(appConfig.ffmpegPath);


export default (store)=>(next)=>(action)=>{
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
                    info.formats.forEach((format)=>{
                        if(format.container === "mp4"){ 
                            console.log("audioBitrate", format.audioBitrate);
                            console.log("itag", format.itag);
                            console.log("encoding", format.encoding);
                            console.log("type", format.type);
                            console.log("container", format.container);
                            console.log("========================");
                        }
                    });
                    next(action);

                });
            } else {
                action.type = "CANCELED_ACTION";
            }
            next(action);
            break;
        case START_VIDEO_DOWNLOAD:
            downloadAndConvert(store, action);
            break;            
        default: 
        break;
    }
    next(action);
}