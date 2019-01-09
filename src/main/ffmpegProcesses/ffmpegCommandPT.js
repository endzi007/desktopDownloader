import appConfig from '../appConfig';
import fs from 'fs';
import { spawn } from 'child_process';

ffmpeg.setFfmpegPath(appConfig.ffmpegPath);

export default ()=>{
    return new Promise((resolve, reject)=>{
        let child = spawn(appConfig.ffmpegPath, ["-i", ])
    }) 
}