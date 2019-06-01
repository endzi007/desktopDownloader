import { execFile } from 'child_process';
import path from 'path';
import { types as appStateTypes } from '../appState/appStateDuck';
import store from "../store/store";

export default (action)=>{
    return new Promise((resolve, reject)=>{
        let video = execFile(path.resolve(__static, "youtube-dl.exe"), [action.payload, "--get-title", "--get-thumbnail", "--get-duration", "--no-playlist"]);
        let videoObj = {
            title: "",
            thumbnail: "",
            downloaded: 0,
            url: "",
            duration: "",
            downloadLinks: [],
            status: "NOT_STARTED"
        }
        let dataArr = [];

        video.stdout.on("data", (info)=>{
            let infoArr = info.split("\n");
            infoArr.pop();
            dataArr = dataArr.concat(infoArr);
            if(dataArr.length===3){
                let durationInSec = 0;
                let isPro = store.getState().appState.license.status;
                videoObj.title = dataArr[0];
                videoObj.thumbnail = dataArr[1];
                videoObj.url = action.payload;
                videoObj.duration = dataArr[2];

                if(isPro === false){
                    let durationArr = dataArr[2].split(":").reverse();
                    for(let x in durationArr){
                        durationInSec += Number.parseInt(durationArr[x])* Math.pow(60, x);
                    }
                    if(durationInSec > 1200){
                        console.log("larger than");
                    }
                }
                console.log(durationInSec);
                action.type = `${action.type}_PROCESSED`;
                action.payload = videoObj;
                resolve(action);
            }
            console.log(dataArr);
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