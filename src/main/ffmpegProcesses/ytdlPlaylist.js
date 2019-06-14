import { execFile } from 'child_process';
import path from 'path';
import { types as appStateTypes } from '../appState/appStateDuck';

export default (action)=>{
    return new Promise((resolve, reject)=>{
        let video = execFile(path.resolve(__static, "youtube-dl.exe"), [action.payload, "--dump-single-json", "--flat-playlist",  "--no-warnings"]);
        let videos =[];

        video.stdout.on("data", (info)=>{
                let data = JSON.parse(info);
                if(data.extractor === "youtube:playlist"){
                    data.entries.forEach(entry => {
                        videos.push({
                            title: entry.title,
                            thumbnail: "noThumbnail",
                            downloaded: 0,
                            url: entry.url,
                            duration: "",
                            downloadLinks: [],
                            status: "NOT_CHECKED", //this value is used in playlistDialog, in which by clicking checkbox
                            //this value becomes NOT_STARTED and stored in redux store
                            range: {status: false, range: []}
                        })
                    });
                    action.type = `${action.type}_PROCESSED`;
                    action.payload = {show: true, videos: videos, playlistUrl: data.webpage_url};
                    resolve(action);
                } else {
                    let url = action.payload;
                    action.type = appStateTypes.ERROR_HANDLER;
                    action.payload = {status: true, message: `Unable to parse. Check to see if URL: ${url} is valid YT playlist url`};
                    reject(action); 
                }
            
        });

        video.stderr.on("data", (err)=>{
            action.type = appStateTypes.ERROR_HANDLER;
            action.payload = {status: true, message: err};
            reject(action);
        });
    });
}