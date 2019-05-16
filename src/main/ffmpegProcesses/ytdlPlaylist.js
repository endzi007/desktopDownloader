import { execFile } from 'child_process';
import path from 'path';
import { types as appStateTypes } from '../appState/appStateDuck';
import fs from 'fs';

export default (action)=>{
    return new Promise((resolve, reject)=>{
        let video = execFile(path.resolve(__static, "youtube-dl.exe"), [action.payload, "--dump-single-json", "--ignore-errors"]);
        let videos =[];

        video.stdout.on("data", (info)=>{
            try {
                let data = JSON.parse(info);
                data.entries.forEach(entry => {
                    let date = new Date(null);
                    date.setSeconds(entry.duration); // specify value for SECONDS here
                    let duration = date.toISOString().substr(11, 8);
                    videos.push({title: entry.title, thumbnail: entry.thumbnail, duration: duration, url: entry.webpage_url})
                });
            } catch (error) {
                console.log(error);
            }
            action.type = `${action.type}_PROCESSED`;
            action.payload = videos;
            resolve(action);
        });

        video.stderr.on("data", (err)=>{
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