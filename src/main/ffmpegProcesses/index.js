import { types as optionsTypes} from '../options/optionsDuck';
import { types as videosTypes} from '../videos/videoDuck';
import { ipcMain } from 'electron';
import path from 'path';
import { execFile } from 'child_process';
import customRangeDownload from './customRangeDownload';
import { types as appStateTypes} from '../appState/appStateDuck';

export default (store, index, resume)=>{
    return new Promise((resolve, reject)=>{
        if(!resume){
            store.dispatch({ type: optionsTypes.INCREASE_LIMIT});
        } 
        store.dispatch({ type: videosTypes.CHANGE_VIDEO_STATUS, payload: { index: index, status: "DOWNLOADING" }})
        store.dispatch({ type: appStateTypes.DOWNLOADING, payload: "INC"});
        let state = store.getState();
        let storeVideo = state.videos[index];
        const { downloadFormat } = state.options;

        if(storeVideo.range.status === true){
            customRangeDownload(store, index).then(()=>{
                store.dispatch({ type: appStateTypes.DOWNLOADING, payload: "DEC"});
                resolve();
            }).catch((err)=>{
                console.log(err);
            });
        } else {
            let qualitySelect = {
                mp3:{
                    "low": ["worstaudio/m4a/mp4"],
                    "medium": ["m4a/webm/18/mp4"],
                    "best": ["bestaudio/m4a/webm/mp4"]
                }, 
                mp4: {
                    "360": ["18/134/135/mp4"],
                    "720": ["22/397/mp4"],
                    "1080": ["bestvideo[ext=mp4]+bestaudio[ext=m4a]"]
                }
            }
    
    
            let args;
            if(downloadFormat.type === "mp3"){
                args = ["-x", "--audio-format", "mp3", "-f", ...qualitySelect[downloadFormat.type][downloadFormat.quality]]
            } else {
                args = ["-f", ...qualitySelect[downloadFormat.type][downloadFormat.quality]];
            }
            const { autoNumbering } = state.options;
    
            //handling if value of numbering box is === "" than use zero instead of it
            let autoNumVal = autoNumbering.value === ""? 0: autoNumbering.value;
    
            let autoNumValue = Number.parseInt(index)+Number.parseInt(autoNumVal);
            let outputTemplate = autoNumbering.numbering === true? `${autoNumValue}.%(title)s.%(ext)s`: `%(title)s.%(ext)s`;
            let video = execFile(path.resolve(__static, "youtube-dl.exe"), 
            [
                "-v",
                storeVideo.url,
                "--no-playlist",
                "-w",
                "--no-overwrites",
                "--ffmpeg-location",
                path.resolve(__static, "ffmpeg.exe"),
                ...args,
                "-o", 
                `${state.options.downloadFolder}\\${outputTemplate}`
            ]);
            
            video.stdout.on("data", (data)=>{
                let info = data.toString().replace(/\s\s+/g, " ").split(" ");
                //whet info.lengt is 9 means that it sends infos about download percent
                //when info.lengt is 7 it means that download is finished
                if(info.length === 9){
                    store.dispatch({ 
                        type: videosTypes.COUNTER,
                        payload: {
                            value: parseFloat(info[1].slice(0, -1)),
                            index: index
                        }
                    })
                }
                if(info[1].slice(0, -1)=== "100.0"){
                    store.dispatch({ 
                        type: videosTypes.COUNTER,
                        payload: {
                            value: 100,
                            index: index
                        }
                    })
                    store.dispatch({ type: videosTypes.CHANGE_VIDEO_STATUS, payload: { index: index, status: "CONVERTING" }})
                }
                
    
            });
            video.stderr.on("data", (err)=>{
                console.log(err, "my err");
            })
    
            video.on("close", ()=>{
                store.dispatch({ type: appStateTypes.DOWNLOADING, payload: "DEC"});
                resolve()
            })
    
            video.on("exit", ()=>{
                if(storeVideo.status !== "PAUSED"){
                    store.dispatch({ type: videosTypes.CHANGE_VIDEO_STATUS, payload: { index: index, status: "DONE" }})
                }
            })
    
            ipcMain.on("PAUSE_VIDEO", (event, i)=>{
                if(i === index){
                    store.dispatch({ type: videosTypes.CHANGE_VIDEO_STATUS, payload: { index: index, status: "PAUSED" }})
                    video.kill();
                }
            })
            ipcMain.on("STOP_VIDEO", (event, i)=>{
                if(i === index){
                    resolve();
                    video.kill();
                }
            })
    
            ipcMain.on("STOP_ALL", (event)=>{
                video.kill();
                reject();
            })

        }



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