import { types as optionsTypes} from '../options/optionsDuck';
import { types as videosTypes} from '../videos/videoDuck';
import { ipcMain } from 'electron';
import path from 'path';
import { execFile } from 'child_process';

export default (store, index)=>{
    return new Promise((resolve, reject)=>{
        let state = store.getState();
        let storeVideo = state.videos[index];
        let qualitySelect = {
            mp3:{
                "low": ["worstaudio/m4a/mp4"],
                "medium": ["m4a/webm/18/mp4"],
                "best": ["bestaudio/m4a/webm/mp4", "--audio-quality", "0"]
            }, 
            mp4: {
                "360": ["18/134/135/mp4"],
                "720": ["22/397/mp4"],
                "1080": ["bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio", "--merge-output-format" , "mp4"]
            }
        }
        const { downloadFormat } = state.options;

        let video = execFile(path.resolve(__static, "youtube-dl.exe"), 
        [
            storeVideo.url,
            "--no-playlist",
            "-f", 
            ...qualitySelect[downloadFormat.type][downloadFormat.quality],
            "-g"
        ]);
        let dataToReturn = "";

        video.stdout.on("data", (data)=>{
            dataToReturn = data;
        })

        video.stderr.on("data", (err)=>{
            reject(err);
        })

        video.on("close", ()=>{
            resolve(dataToReturn);
        })
    });
    
}