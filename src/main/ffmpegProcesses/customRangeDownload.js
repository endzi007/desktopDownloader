import path from 'path';
import { execFile } from 'child_process';

export default (store, index)=>{
    return new Promise((resolve, reject)=>{
        let state = store.getState();
        let stateVideo = state.videos[index];
        let formatsToDownload = getFormatsToDownload(state.options.downloadFormat, stateVideo.downloadLinks);
        let modifiedTitle = stateVideo.title.replace(/[|*:/"<>,]/g, "-");
        
        let video = execFile(path.resolve(__static, "ffmpeg"), 
        ['-ss', stateVideo.range.range[0], '-i', formatsToDownload.url, "-y", '-to', stateVideo.range.range[1], '-c:a', "libmp3lame",  modifiedTitle+"."+state.options.downloadFormat.type]);
        video.stdout.on("data", (data)=>{
            console.log("DATA", data);
        })
        video.stderr.on("data", (err)=>{
            console.log("ERROR", err.replace(/\s/g, " "));
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
                return reducedFormats[0];
            } else if(formatObj.quality === "medium"){
                console.log("medium");
                return reducedFormats[Math.ceil(reducedFormats.length/2)];
            } else {
                console.log("high");
                return reducedFormats[reducedFormats.length-1];
            }
        case "mp4":
            break;
        default:
            break;
    }
}