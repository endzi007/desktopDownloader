import { execFile } from 'child_process';
import path from 'path';
import { types as appStateTypes } from '../appState/appStateDuck';

import fs from 'fs';

export default (action)=>{
    return new Promise((resolve, reject)=>{
        let video = execFile(path.resolve(__static, "youtube-dl.exe"), [action.payload, "--dump-single-json", "--flat-playlist",  "--ignore-errors"]);
        let videos =[];

        video.stdout.on("data", (info)=>{
            try {
                let data = JSON.parse(info);
                console.log(data);
                if(data.extractor === "youtube:playlist"){
                    data.entries.forEach(entry => {
                        videos.push({
                            title: entry.title,
                            thumbnail: "noThumbnail",
                            downloaded: 0,
                            url: entry.url,
                            duration: "",
                            downloadLinks: [],
                            status: "NOT_CHECKED" //this value is used in playlistDialog, in which by clicking checkbox
                            //this value becomes NOT_STARTED and stored in redux store
                        })
                    });
                    action.type = `${action.type}_PROCESSED`;
                    action.payload = {show: true, videos: videos, playlistUrl: data.webpage_url};
                    resolve(action);
                } else {
                    let url = action.payload;
                    action.type = appStateTypes.ERROR_HANDLER;
                    action.payload = {status: true, message: `Unable to parse. Check to see if URL: ${url} is valid YT playlist url`};
                    resolve(action); 
                }

            } catch (error) {
                let url = action.payload;
                action.type = appStateTypes.ERROR_HANDLER;
                action.payload = {status: true, message: `Unable to parse. Check to see if URL: ${url} is valid YT playlist url`};
                resolve(action);
            }
            
        });

        video.stderr.on("data", (err)=>{
            console.log(err, "err")
            if(err.indexOf("URL") !== -1){
                action.type = appStateTypes.ERROR_HANDLER;
                action.payload = {status: true, message: "Unable to parse. Check URL or internet connection"};
                resolve(action);
            }
        });


        video.on("error", (err)=>{
            console.log("some err", err);
        })
    });
}