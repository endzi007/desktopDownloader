import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import appConfig from '../appConfig';
import { DOWNLOAD_PROGRESS_COUNTER } from '../actions';
import { INCREASE_LIMIT } from '../actions/optionsActions';
import fs from 'fs';
import { spawn } from 'child_process';

ffmpeg.setFfmpegPath(appConfig.ffmpegPath);

export default (store, index)=>{
    return new Promise((resolve, reject)=>{
        store.dispatch({ type: INCREASE_LIMIT})
        let state = store.getState();
        let storeVideo = state.videos[index];
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
                resolve();
            })
        } else {
            //const child = spawn(appConfig.ffmpegPath, ["-i", video, `${state.options.downloadFolder}\\${storeVideo.title}.mp3`])
            
            ffmpeg(video)
            .format("mp4")
            .outputFormat("mp3")
            .on("end", ()=>{
                resolve();
            }).on("error", (err)=>{
                console.log(err);
                reject("error while converting video");
            }).save(`${state.options.downloadFolder}\\${storeVideo.title}.mp3`);             
        } 
        let downloadedContent = 0;
        video.on('progress', function(byteLength, downloaded, total) {
                downloadedContent++;
                if(downloadedContent === 10){
                    store.dispatch({
                        type: DOWNLOAD_PROGRESS_COUNTER, 
                        payload: {
                            index: index, 
                            value: {
                                percent: (downloaded/total)*100, 
                                total: total, 
                                downloaded: downloaded
                            }
                        }
                    });
                    downloadedContent = 0;
                } else if (downloaded === total){
                    store.dispatch({
                        type: DOWNLOAD_PROGRESS_COUNTER, 
                        payload: {
                            index: index, 
                            value: {
                                percent: (downloaded/total)*100, 
                                total: total, 
                                downloaded: downloaded
                            }
                        }
                    });
                }
        });
    });
       
}