import path from 'path';
import { execFile } from 'child_process';
import { unwatchFile } from 'fs';
import { reduce } from 'bluebird-lst';

export default (store, index)=>{
    return new Promise((resolve, reject)=>{
        let state = store.getState();
        const { downloadFormat } = state.options;
        let stateVideo = state.videos[index];
        let formatsToDownload = getFormatsToDownload(downloadFormat, stateVideo.downloadLinks);
        let modifiedTitle = stateVideo.title.replace(/[|*:/"<>,]/g, "-");
        let getPercent = (stateVideo.range.range[1]/stateVideo.duration)*100;
        let sizeToDownload = ((formatsToDownload.filesize / 100) * getPercent)/1024;
        let args;
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
        if(downloadFormat.type === "mp3"){
            args = ['-ss', stateVideo.range.range[0], 
            '-i', formatsToDownload.url, 
            "-y","-stats", 
            '-t', stateVideo.range.range[1], 
            '-c:a', "libmp3lame", 
            "-q:a", qa,  
            modifiedTitle+"."+downloadFormat.type]
        } else {
            args = ['-ss', stateVideo.range.range[0], 
            '-i', formatsToDownload.url, 
            "-y", "-stats", 
            '-t', stateVideo.range.range[1], 
            "-c:v", "copy",
            '-c:a', "copy",
            modifiedTitle+"."+downloadFormat.type]

        }
        console.log(args);

        let video = execFile(path.resolve(__static, "ffmpeg"), [...args]);
        video.stdout.on("data", (data)=>{
            console.log("DATA", data);
        })
        video.stderr.on("data", (err)=>{
            let msg = err.replace(/\s/g, "");
            let downloadedVal = msg.split("=");
            let indexOfValue = null;
            downloadedVal.forEach((piece, i)=>{
                if(piece === "size"){
                    indexOfValue = i;
                }
            });
            let currentDownloadValue = Number.parseInt(downloadedVal[indexOfValue+1].replace(/[a-zA-Z]/g, ""));
                console.log("currend download value", currentDownloadValue);
                console.log("sizeToDownload", sizeToDownload);
                console.log("whole file", formatsToDownload.filesize);
        })

        video.on("close", ()=>{
            //download finished -- start converting 
            resolve();
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