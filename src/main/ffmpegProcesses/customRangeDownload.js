import path from 'path';
import { execFile } from 'child_process';
import { unlink } from 'fs';
import { types as videosTypes } from '../videos/videoDuck';
import { ipcMain } from 'electron';

export default (store, index)=>{
    return new Promise((resolve, reject)=>{
        let state = store.getState();
        const { downloadFormat, downloadFolder } = state.options;
        let stateVideo = state.videos[index];
        let formatsToDownload = getFormatsToDownload(downloadFormat, stateVideo.downloadLinks);
        let modifiedTitle = stateVideo.title.replace(/[|*://"<>\\,]/g, "-");
        let getPercent = (stateVideo.range.range[1]/stateVideo.duration)*100;
        let sizeToDownload = Number.parseInt(((formatsToDownload.filesize / 100) * getPercent)/1024);
        let qa;
        if(downloadFormat.type === "mp3"){
            if(downloadFormat.quality === "low"){
                qa = 9;
            } else if(downloadFormat.quality === "medium"){
                qa = 5
            } else {
                qa = 0;
            }
        }
        let video = execFile(path.resolve(__static, "ffmpeg"), ['-ss', stateVideo.range.range[0], '-i', formatsToDownload.url, "-y", "-stats", '-t', stateVideo.range.range[1], "-c:v", "copy", '-c:a', "copy", downloadFolder+"\\"+modifiedTitle+".mp4"]);
        video.stdout.on("data", (data)=>{
            console.log("DATA", data);
        })
        video.stderr.on("data", (err)=>{
            let msg = err.replace(/\s/g, "");
            let startIndex = msg.indexOf("size=");
            let endIndex = msg.indexOf("kBtime");
            let downloadedVal = Number.parseInt(msg.substr(startIndex+5, endIndex-startIndex-5));
            let downloadedPercent = (downloadedVal/sizeToDownload)*100;
            console.log(downloadedPercent);
            if(downloadedPercent < 100){
                store.dispatch({ 
                    type: videosTypes.COUNTER,
                    payload: {
                        value: downloadedPercent,
                        index: index
                    }
                }) 
            }
        })

        video.on("close", ()=>{
            store.dispatch({ 
                type: videosTypes.COUNTER,
                payload: {
                    value: 100,
                    index: index
                }
            })
            if(downloadFormat.type === "mp3" && stateVideo.status !== "PAUSED"){
                store.dispatch({ type: videosTypes.CHANGE_VIDEO_STATUS, payload: { index: index, status: "CONVERTING" }})
                let convertToMp3 = execFile(path.resolve(__static, "ffmpeg"), ['-i', downloadFolder+"\\"+modifiedTitle+".mp4", '-c', "libmp3lame", "-y", "-q:a", qa, downloadFolder+"\\"+modifiedTitle+".mp3"]);
                convertToMp3.stderr.on("data", (err)=>{
                    console.log(err, "ffmpeg conversion");
                })  
                convertToMp3.on("close", ()=>{
                    unlink(downloadFolder+"\\"+modifiedTitle+".mp4", ()=>{
                        
                    });
                    resolve();
                })

                convertToMp3.on("exit", ()=>{
                    store.dispatch({ type: videosTypes.CHANGE_VIDEO_STATUS, payload: { index: index, status: "DONE" }})
                })
            } else {
                resolve();
            }
        })

        video.on("exit", ()=>{
            if(stateVideo.status !== "PAUSED"){
                store.dispatch({ type: videosTypes.CHANGE_VIDEO_STATUS, payload: { index: index, status: "DONE" }})
            }
        })

        ipcMain.on("PAUSE_VIDEO", (event, i)=>{
            if(i === index){
                store.dispatch({ type: videosTypes.CHANGE_VIDEO_STATUS, payload: { index: index, status: "NOT_STARTED" }})
                video.kill();
            }
        })
        ipcMain.on("STOP_VIDEO", (event, i)=>{
            if(i === index){
                resolve();
                video.kill();
            }
        })

        ipcMain.on("STOP_ALL", (event)=>{
            video.kill();
            reject();
        })


    });
    
}

function getFormatsToDownload (formatObj, formats){
    let reducedFormats = []; 
            formats.forEach(format => {
                if(format.format_id === "18"){
                    if(formatObj.type === "mp3"){
                        reducedFormats.unshift(format);
                    } else {
                        if(formatObj.quality === "360"){
                            reducedFormats.unshift(format);
                        } else {
                            reducedFormats.push(format);
                        }
                    }
                }
                else if(format.format_id === "22"){
                    if(formatObj.type === "mp3") {
                        reducedFormats.push(format);
                    } else {
                        if(formatObj.quality === "720"){
                            reducedFormats.unshift(format);
                        } else {
                            reducedFormats.push(format);
                        }
                    }
                }
            });
               
            return reducedFormats[0];
}