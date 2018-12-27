import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import appConfig from '../appConfig';
import { DOWNLOAD_PROGRESS_COUNTER } from '../actions';
import fs from 'fs';
ffmpeg.setFfmpegPath(appConfig.ffmpegPath);

export default (store, action)=>{
        let state = store.getState();
        let downloaded = 0;
        let typeOfFormat = "";

        let videoInStoreIndex = state.videos.findIndex((vid)=>{
            return vid.url === action.payload;
        });
        let video = ytdl(action.payload, { filter: (format) => format.container === 'mp4', start: downloaded});
        if(state.options.downloadFormat !== "mp3"){
            let ddd = fs.createWriteStream(
                `${state.options.downloadFolder}\\${state.videos[videoInStoreIndex].title}.mp4`
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
            }).save(`${state.options.downloadFolder}\\${state.videos[videoInStoreIndex].title}.mp3`);            
        } 

        video.on('progress', function(byteLength, downloaded, total) {
            let onePercent = total/100;
            let percent = Math.round(downloaded/onePercent);
            store.dispatch({type: DOWNLOAD_PROGRESS_COUNTER, payload: {index: videoInStoreIndex, value: percent}})
        });
}