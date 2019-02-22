import { execFile } from 'child_process';
import path from 'path';
import { ERROR_HANDLER } from '../actions/errorActions';
export default (action)=>{
    return new Promise((resolve, reject)=>{
        let video = execFile(path.resolve(__dirname, "../../static/youtube-dl.exe"), [action.payload, "--dump-json"]);
        let videoObj = {
            title: "",
            thumbnail: "",
            downloaded: 0,
            url: "",
            duration: "",
            downloadLinks: []
        }

        video.stdout.on("data", (info)=>{
            let infoData = JSON.parse(info);
            videoObj.title = infoData.title;
            videoObj.thumbnail = infoData.thumbnail;
            videoObj.url = action.payload;
            let date = new Date(null);
            date.setSeconds(infoData.duration); // specify value for SECONDS here
            let duration = date.toISOString().substr(11, 8);
            videoObj.duration = duration;
            action.type = `${action.type}_PROCESSED`;
            action.payload = videoObj;
            resolve(action);
        });

        video.stderr.on("data", (err)=>{
            console.log("err", err);
            if(err.indexOf("URL")!==-1){
                action.type = ERROR_HANDLER;
                action.payload = "Unsuported or unvalid URL";
            } else if(err.indexOf("Unable to download")!==-1){
                action.type = ERROR_HANDLER;
                action.payload = "Unable to download. Check internet connection.";
            }
            resolve(action);
        });

        video.on("close", ()=>{
            console.log("close");
        });
        video.on("data", (data)=>{
            console.log("data", data);
        });
        video.on("error", (err)=>{
            console.log("some err", err);
        })
    });
}