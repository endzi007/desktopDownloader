import ytdl from 'ytdl-core';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import appConfig from '../appConfig';
ffmpeg.setFfmpegPath(appConfig.ffmpegPath);


export default (store)=>(next)=>(action)=>{
    switch(action.type){
        case "ADD_VIDEO":
            //let writeStream = fs.createWriteStream("enis.mp3");
            //check if is valid url 
            let formatForDownload = store.getState().options.downloadFormat;
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
                    console.log(info.formats);
                    action.type = "ADD_PROCESSED_VIDEO",
                    next(action);

                });
            } else {
                action.type = "CANCELED_ACTION";
            }
            next(action);
            break;
        case "DOWNLOAD_VIDEO":
            
            let downloaded = 0;
            let video = ytdl(action.payload, { filter: (format) => format.container === 'mp4', start: downloaded});

            ffmpeg(video)
            .format("mp4")
            .outputFormat("mp3")
            .on("end", ()=>{
                console.log("end");
            }).on("error", (err)=>{
                console.log(err);
            }).save(`enis.mp3`);

            video.on('progress', function(byteLength, downloaded, total) {
                let onePercent = total/100;
                let percent = Math.round(downloaded/onePercent);
                console.log(`${percent}%`);
                let video = store.getState().videos.findIndex((vid)=>{
                    return vid.url === action.payload;
                });
                store.dispatch({type: "DOWNLOAD_COUNTER", payload: {index: video, value: percent}})
            });
            break;            
        default: 
        break;
    }
    next(action);
}