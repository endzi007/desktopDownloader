import ffmpeg from 'fluent-ffmpeg';
import appConfig from '../appConfig';
import { INCREASE_LIMIT } from '../actions/optionsActions';
import { DOWNLOAD_PROGRESS_COUNTER } from '../actions';
import path from 'path';
import { execFile } from 'child_process';

export default (store, index)=>{
    return new Promise((resolve, reject)=>{
        store.dispatch({ type: INCREASE_LIMIT})
        let state = store.getState();
        let storeVideo = state.videos[index];
        let videoArgs = [
            "-i", 
            storeVideo.url, 
            "--format=18", 
            "-o", 
            `${state.options.downloadFolder}\\${index+1}.%(title)s.%(ext)s` 
        ];
        let mp3Args = [
            storeVideo.url,
            "--ffmpeg-location",
            appConfig.ffmpegPath,
            "--format",
            "m4a",
            "--audio-quality",
            "0",
            "-x",
            "--audio-format",
            "mp3",
            "-o", 
            `${state.options.downloadFolder}\\${index+1}.%(title)s.%(ext)s`,
        ]
        let chooseMode = state.options.downloadFormat === "mp3"? mp3Args : videoArgs;
        let video = execFile(path.resolve(__dirname, "../../static/youtube-dl.exe"), [...chooseMode]);
        
        video.stdout.on("data", (data)=>{
            let info = data.toString().replace(/\s\s+/g, " ").split(" ");
            //whet info.lengt is 9 means that it sends infos about download percent
            //when info.lengt is 7 it means that download is finished
            if(info.length === 9){
                store.dispatch({ 
                    type: DOWNLOAD_PROGRESS_COUNTER,
                    payload: {
                        value: parseFloat(info[1].slice(0, -1)),
                        index: index
                    }
                })
            }
        });
        video.stderr.on("data", (err)=>{
            console.log(err, "my err");
        })

        video.on("close", ()=>{ 
            store.dispatch({ 
                type: DOWNLOAD_PROGRESS_COUNTER,
                payload: {
                    value: 100,
                    index: index
                }
            })
            resolve()
        })

        video.on("exit", ()=>{
            console.log("exited");
        })
    });
    
}
//const child = spawn(appConfig.ffmpegPath, ["-i", video, `${state.options.downloadFolder}\\${storeVideo.title}.mp3`])
/*             let video = ytdl(storeVideo.url, { filter: (format) => format.container === 'mp4', start: downloaded});
ffmpeg(video)
.format("mp4")
.outputFormat("mp3")
.on("end", ()=>{
    resolve();
}).on("error", (err)=>{
    console.log(err);
    reject("error while converting video");
}).save(`${state.options.downloadFolder}\\${storeVideo.title}.mp3`);      */        