import { execFile } from 'child_process';
import path from 'path';
import { types as appStateTypes } from '../appState/appStateDuck';

export default (action)=>{
    return new Promise((resolve, reject)=>{
        let video = execFile(path.resolve(__static, "youtube-dl.exe"), [action.payload, "--dump-json", "--no-playlist"]);
        let videoObj = {
            title: "",
            thumbnail: "",
            downloaded: 0,
            url: "",
            duration: "",
            downloadLinks: [],
            status: "NOT_STARTED"
        }

        video.stdout.on("data", (info)=>{
            console.log("info", info);
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
            if(err.indexOf("URL") !== -1){
                action.type = appStateTypes.ERROR_HANDLER;
                action.payload = {status: true, message: `Unable to parse. URL:${action.payload} seems to be invalid...`};
                resolve(action);
            } else if(err.indexOf("blocked") !== -1){
                action.type = appStateTypes.ERROR_HANDLER;
                action.payload = {status: true, message: "This video is blocked"};
                resolve(action);
            } else if(err.indexOf("copyright") !== -1){
                action.type = appStateTypes.ERROR_HANDLER;
                action.payload = {status: true, message: "This video is no longer available due to a copyright claim"};
                resolve(action);
            }
        });


        video.on("error", (err)=>{
            console.log("some err", err);
        })
    });
}