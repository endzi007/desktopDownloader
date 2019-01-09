import fs from 'fs';
import youtubedl from 'youtube-dl';



export default (url)=>{
    console.log(url, "url");
    return new Promise((res, rej)=>{
        let video = youtubedl(url, ["--format=18"], { cwd: __dirname});
        video.on("info", (info)=>{
            console.log(info)
        });

        video.on("error", (err)=>{
            rej("error", err);
        })
        video.on("end", ()=>{
            res("finished");
        })

    });
}
