import { execFile } from 'child_process';
import path from 'path';
import { types as appStateTypes } from '../appState/appStateDuck';
import fs from 'fs';

export default (action)=>{
    return new Promise((resolve, reject)=>{
        let video = execFile(path.resolve(__static, "youtube-dl.exe"), [action.payload, "--dump-single-json", "--ignore-errors"]);
        let videos =[]
        let file = fs.createWriteStream("allInfo.txt");

        video.stdout.on("data", (info)=>{
            file.write(info, ()=>{
                console.log("writing to file");
            }); 
            action.type = `${action.type}_PROCESSED`;
            action.payload = videoObj;
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