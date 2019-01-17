import ytdl from 'ytdl-core';
import { clipboard } from 'electron';

export default (action)=>{

    return new Promise((resolve, reject)=>{
        //check if is valid url 
        let validateUrl = ytdl.validateURL(action.payload);
        if(true){
            //let video = ytdl(action.payload, { filter: (format) => format.container === 'mp4'});
            let videoObj = {
                title: "",
                thumbnail: "",
                downloaded: 0,
                url: "",
                duration: "",
                downloadLinks: []
            }
            ytdl.getInfo(action.payload, (err, info)=>{
                let date = new Date(null);
                date.setSeconds(info.length_seconds); // specify value for SECONDS here
                let duration = date.toISOString().substr(11, 8);
                videoObj.duration = duration;
                videoObj.title = info.title;
                videoObj.thumbnail = info.thumbnail_url;
                videoObj.url = action.payload;
                action.payload = videoObj;
                action.type = `${action.type}_PROCESSED`,
                resolve(action);
            });
        } else {
            action.type = "CANCELED_ACTION";
            resolve(action);
        }
    });
}