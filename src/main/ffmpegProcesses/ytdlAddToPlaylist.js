import { execFile } from 'child_process';
import path from 'path';
import { types as appStateTypes } from '../appState/appStateDuck';
import { types as uiTypes } from '../ui/uiDuck';
import store from "../store/store";

export default (action)=>{
    return new Promise((resolve, reject)=>{
        let video = execFile(path.resolve(__static, "youtube-dl.exe"), [action.payload, "--get-title", "--get-thumbnail", "--get-duration", "--no-playlist", "--no-warnings"]);
        let videoObj = {
            title: "",
            thumbnail: "",
            downloaded: 0,
            url: "",
            duration: "",
            downloadLinks: [],
            status: "NOT_STARTED",
            range: {status: false, range: []}
        }
        let dataArr = [];
        let newAction = {};

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
                        newAction.type = uiTypes.SHOW_PRO_FEATURE;
                        newAction.payload = {open: true, message: "To download videos longer than 20 minutes please consider donating to get PRO License"};
                    } else {
                        newAction.type = `${action.type}_PROCESSED`;
                        newAction.payload = videoObj;
                    }
                } else {
                    newAction.type = `${action.type}_PROCESSED`;
                    newAction.payload = videoObj;
                }
                
            }
        });

        video.stderr.on("data", (err)=>{
            console.log("error", err)
            newAction.type = appStateTypes.ERROR_HANDLER;
            newAction.payload = {status: true, message: err};
        });

        video.on("error", (err)=>{
            console.log("some err", err);
        })
        video.on("close", ()=>{
            resolve(newAction);
        })
    });
}