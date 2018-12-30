import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import appConfig from '../appConfig';
import { DOWNLOAD_PROGRESS_COUNTER } from '../actions';
import fs from 'fs';
ffmpeg.setFfmpegPath(appConfig.ffmpegPath);

export default (store, index)=>{
        let state = store.getState();
        let storeVideo = state.videos[index];
        let downloaded = 0;
        let typeOfFormat = "";

        let video = ytdl(storeVideo.url, { filter: (format) => format.container === 'mp4', start: downloaded});
        if(state.options.downloadFormat !== "mp3"){
            let ddd = fs.createWriteStream(
                `${state.options.downloadFolder}\\${storeVideo.title}.mp4`
            );
            video.on("data", (chunk)=>{
                ddd.write(chunk, ()=>{});
            })
            video.on("end", ()=>{
                ddd.end();
            })
        } else {
            ffmpeg(video)
            .format("mp4")
            .outputFormat("mp3")
            .on("end", ()=>{
                console.log("finished");
            }).on("error", (err)=>{
                console.log(err);
            }).save(`${state.options.downloadFolder}\\${storeVideo.title}.mp3`);            
        } 
        let downloadedContent = 0;
        video.on('progress', function(byteLength, downloaded, total) {
                downloadedContent++;
                if(downloadedContent === 10){
                    store.dispatch({type: DOWNLOAD_PROGRESS_COUNTER, payload: {index: index, value: (downloaded/total)*100}});
                    downloadedContent = 0;
                } else if (downloaded === total){
                    store.dispatch({type: DOWNLOAD_PROGRESS_COUNTER, payload: {index: index, value: (downloaded/total)*100}});
                }
        });
}