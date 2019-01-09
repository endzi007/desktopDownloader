import ffmpeg from 'fluent-ffmpeg';
import appConfig from '../appConfig';
import downloadAndConvert from '../ffmpegProcesses';
import ytdlAddToPlaylist from '../ffmpegProcesses/ytdlAddToPlaylist';
import { clipboard } from 'electron';
import { ADD_VIDEO_TO_PLAYLIST, START_VIDEO_DOWNLOAD, DOWNLOAD_NEXT_VIDEO } from '../actions';
import { RESET_LIMIT } from '../actions/optionsActions'; 
import ytdlCommand from '../ffmpegProcesses/ytdlCommandPT';

ffmpeg.setFfmpegPath(appConfig.ffmpegPath);

export default (store)=>(next)=>(action)=>{
    let state = store.getState();
    switch(action.type){
        case ADD_VIDEO_TO_PLAYLIST:
            //check if action is called from DROPZONE or CLIPBOARD
            //if string is empty we should check clipboard for url
            if(action.payload === ""){
                action.payload = clipboard.readText();
            }
            //check if video exists in playlist 
            let index = state.videos.findIndex((element)=>{
                return element.url === action.payload;
            })
            if(index === -1){
                ytdlCommand(action.payload).then(()=>{
                    console.log("finished");
                }).catch((err)=>{
                    console.log(err);
                });
            } else {
                action.type = "CANCELED_ACTION";
            }
            break;
        case START_VIDEO_DOWNLOAD:
            let loopLength = state.videos.length<state.options.parallel.limit? state.videos.length: state.options.parallel.limit;
            for(let i = state.options.parallel.index; i<loopLength; i++){
                downloadAndConvert(store, i).then(()=>{
                    store.dispatch({ type: DOWNLOAD_NEXT_VIDEO });
                });
            }
            break;  
        
        case DOWNLOAD_NEXT_VIDEO:
            if(state.options.parallel.index < state.videos.length){
                downloadAndConvert(store, state.options.parallel.index).then(()=>{
                    store.dispatch({ type: DOWNLOAD_NEXT_VIDEO });
                });
            }
            break;
        default: 
        break;
    }
    next(action);
}