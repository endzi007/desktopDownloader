import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
ffmpeg.setFfmpegPath("../../../files/ffmpeg");

var command = ffmpeg();

export default (store)=>(next)=>(action)=>{
    switch(action.type){
        case "ADD_VIDEO":
            let addVideo = new Promise((res, rej)=>{
                ytdl.getInfo(action.payload, (err, info)=>{
                   res(info);
                });
            });
            addVideo.then((info)=>{
                for(let format of info.formats){
                    if(format.itag === "140"){
                        ffmpeg(format.url).toFormat("mp3")
                        .on("progress",(progres)=>{
                            console.log(progres);
                        })
                        .on("end", ()=>{
                            console.log(end)
                        })
                        .save('./hello.mp3');
                    }
                }
            })
            break;
        default: 
        break;
    }
    next(action);
}