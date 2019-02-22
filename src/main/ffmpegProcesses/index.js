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
        let qualitySelect = {
            mp3:{
                "low": ["worstaudio/m4a/mp4"],
                "medium": ["m4a/webm/18/mp4"],
                "best": ["bestaudio/m4a/webm/mp4", "--audio-quality", "0"]
            }, 
            mp4: {
                "360": ["134/18/135/mp4"],
                "720": ["22/397/mp4"],
                "1080": ["bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio", "--merge-output-format" , "mp4"]
            }
        }
        const { downloadFormat } = state.options;
        console.log(qualitySelect[downloadFormat.type][downloadFormat.quality]);

        let args;
        if(downloadFormat.type === "mp3"){
            args = ["-x", "--audio-format", "mp3", "-f", ...qualitySelect[downloadFormat.type][downloadFormat.quality]]
        } else {
            args = ["-f", ...qualitySelect[downloadFormat.type][downloadFormat.quality]];
        }
        console.log([...args]);
        let video = execFile(path.resolve(__dirname, "../../static/youtube-dl.exe"), 
        [
            "-v",
            storeVideo.url,
            "--ffmpeg-location",
            path.resolve(__dirname, "../../static/ffmpeg.exe"),
            ...args,
            "-o", 
            `${state.options.downloadFolder}\\${index+1}.%(title)s.%(ext)s`
        ]);
        
        video.stdout.on("data", (data)=>{
            let info = data.toString().replace(/\s\s+/g, " ").split(" ");
            console.log(info);
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