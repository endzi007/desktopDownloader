import ytdl from 'ytdl-core';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import appConfig from '../appConfig';
ffmpeg.setFfmpegPath(appConfig.ffmpegPath);


export default (store)=>(next)=>(action)=>{
    switch(action.type){
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
            }).save(`${info.title}.mp3`);

            video.on('progress', function(byteLength, downloaded, total) {
                let onePercent = total/100;
                let percent = Math.round(downloaded/onePercent);
                console.log(`${percent}%`);
            });
            break;            
        default: 
        break;
    }
    next(action);
}