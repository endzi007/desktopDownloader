import { execFile } from 'child_process';
import path from 'path';
import { types as appStateTypes } from '../appState/appStateDuck';
import { types as uiTypes } from '../ui/uiDuck';
import store from "../store/store";

export default (action)=>{
    return new Promise((resolve, reject)=>{
        let video = execFile(path.resolve(__static, "youtube-dl.exe"), [action.payload, "--dump-json", "--no-playlist", "--no-warnings"]);
        let videoObj = {
            title: "",
            thumbnail: "",
            downloaded: 0,
            url: "",
            duration: "",
            downloadLinks: [],
            status: "NOT_STARTED",
            range: {status: false, range: []},
            size: null
        }
        let dataArr = [];
        let newAction = {type: "", payload: ""};

        video.stdout.on("data", (info)=>{
            let infoData = JSON.parse(info);
            let isPro = store.getState().appState.license.status;
            videoObj.title = infoData.title;
            videoObj.thumbnail = infoData.thumbnail;
            videoObj.url = action.payload;
            videoObj.duration = Number.parseInt(infoData.duration);
            videoObj.range.range = [0, Number.parseInt(infoData.duration)]
            videoObj.downloadLinks = infoData.formats;
            newAction.type = `${action.type}_PROCESSED`;
            newAction.payload = videoObj;


        });

        video.stderr.on("data", (err)=>{
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