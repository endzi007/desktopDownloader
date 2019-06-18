import path from 'path';
import { execFile } from 'child_process';

export default (url, videoObj, extension, location)=>{
    console.log(location, "location");
    let modifiedTitle = location[0].trim() +"\\"+ videoObj.title.trim();
    console.log(modifiedTitle, "modified title");
    let modifiedUrl = url.trim();
    return new Promise((resolve, reject)=>{
        let video = execFile(path.resolve(__static, "ffmpeg"), 
        ['-ss', videoObj.range.range[0], '-i', modifiedUrl, "-y", "-loglevel", "quiet", "-stats", '-t', videoObj.range.range[1], '-c:v', 'copy', '-c:a', 'copy', modifiedTitle+"."+extension]);
        video.stdout.on("data", (data)=>{
            console.log("DATA", data);
        })

        video.stderr.on("data", (err)=>{

            console.log("ERROR", err.replace(/\s/g, ""));
        })

        video.on("close", ()=>{
            resolve();
        })
    });
    
}