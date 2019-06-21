import path from 'path';
import { spawn } from 'child_process';

export default (store, index)=>{
    return new Promise((resolve, reject)=>{
        let state = store.getState();
        let stateVideo = state.videos[index];
        let formatsToDownload = getFormatsToDownload(state.options.downloadFormat, stateVideo.downloadLinks).trim();
        console.log(formatsToDownload, stateVideo.range.range[0], stateVideo.range.range[1]);
        
        let video = spawn(path.resolve(__static, "ffmpeg"), 
        ['-ss', stateVideo.range.range[0], '-i', formatsToDownload, "-y", "-stats", '-t', stateVideo.range.range[1]-stateVideo.range.range[0], '-c:a', 'copy', stateVideo.title+"."+state.options.downloadFormat.type]);
        video.stdout.on("data", (data)=>{
            console.log("DATA", data);
        })

        video.stderr.on("data", (err)=>{

            console.log("ERROR", err.replace(/\s/g, ""));
        })

        video.on("close", ()=>{
            console.log("close custom range download");
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
            console.log(reducedFormats, "reduced formats");
            if(formatObj.quality === "low"){
                return reducedFormats[0].url;
            } else if(formatObj.quality === "medium"){
                return reducedFormats[Math.ceil(reducedFormats.length/2)].url;
            } else {
                return reducedFormats[reducedFormats.length].url;
            }
        case "mp4":
            break;
        default:
            break;
    }
}