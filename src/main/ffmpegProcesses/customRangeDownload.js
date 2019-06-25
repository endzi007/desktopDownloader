import path from 'path';
import { execFile } from 'child_process';

export default (store, index)=>{
    return new Promise((resolve, reject)=>{
        let state = store.getState();
        let stateVideo = state.videos[index];
        let formatsToDownload = getFormatsToDownload(state.options.downloadFormat, stateVideo.downloadLinks);
        let modifiedTitle = stateVideo.title.replace(/[|*:/"<>,]/g, "-");
        let getPercent = ((stateVideo.range.range[1]-stateVideo.range.range[0])/stateVideo.duration)*100;
        console.log("percent", getPercent);
        let sizeToDownload = ((formatsToDownload.filesize / 100) * getPercent)/1024;
        let baseValue = 0;
        let video = execFile(path.resolve(__static, "ffmpeg"), 
        ['-ss', stateVideo.range.range[0], '-i', formatsToDownload.url, "-y", "-loglevel", "quiet", "-stats", '-to', stateVideo.range.range[1], '-c:a', "copy",  modifiedTitle+"."+formatsToDownload.ext]);
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
    switch (formatObj.type) {
        case "mp3":
            let reducedFormats = []; 
            formats.forEach(format => {
                if(format.vcodec === "none"){
                    reducedFormats.push(format);
                } 
            });;
            if(formatObj.quality === "low"){
                return reducedFormats[0];
            } else if(formatObj.quality === "medium"){

                return reducedFormats[Math.ceil(reducedFormats.length/2)];
            } else {

                return reducedFormats[reducedFormats.length-1];
            }
        case "mp4":
            break;
        default:
            break;
    }
}