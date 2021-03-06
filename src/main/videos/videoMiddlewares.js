/* eslint-disable no-fallthrough */
/* eslint-disable no-case-declarations */
import downloadAndConvert from '../ffmpegProcesses';
import ytdlAddToPlaylist from '../ffmpegProcesses/ytdlAddToPlaylist';
import ytdlPlaylist from '../ffmpegProcesses/ytdlPlaylist';
import { clipboard, ipcMain, dialog } from 'electron';
import { types } from './videoDuck';
import { creators as appStateActions } from '../appState/appStateDuck';
import { creators as uiActions } from '../ui/uiDuck';
import fs from 'fs';
export default (store)=>(next)=>(action)=>{
    let state = store.getState();
    switch(action.type){
        case types.ADD:
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
                store.dispatch(appStateActions.parsingData(true));
                ytdlAddToPlaylist(action).then((newAction)=>{
                    store.dispatch(appStateActions.parsingData(false));
                    next(newAction);
                }).catch((newAction)=>{
                    store.dispatch(appStateActions.parsingData(false));
                    next(newAction);
                });
            } else {
                action.type = "CANCELED_ACTION";
            }
            break;
        case types.START_DOWNLOAD:
            let loopLength = state.videos.length < state.options.parallel.limit ? state.videos.length: state.options.parallel.limit; 
            for(let i = state.options.parallel.index; i<loopLength; i++){
                downloadAndConvert(store, i).then(()=>{
                    store.dispatch({ type: types.DOWNLOAD_NEXT });
                });
            }
            break;  
        
        case types.DOWNLOAD_NEXT:
        if(state.options.parallel.index < state.videos.length){
                downloadAndConvert(store, state.options.parallel.index).then(()=>{
                    store.dispatch({ type: types.DOWNLOAD_NEXT });
                });
            }
            break;
        case types.RESUME_VIDEO_DOWNLOAD: 
            downloadAndConvert(store, action.payload, true).then();
            break;
        case types.SAVE_PLAYLIST: 
            dialog.showSaveDialog({filters:[{ name: "JSON file", extensions: ["ddx"]}]}, (filename)=>{
                let modifiedVideos = [];
                state.videos.forEach(video => {
                    video.status = "NOT_STARTED";
                    video.downloaded = 0;
                    modifiedVideos.push(video);
                });

                fs.writeFile(filename, JSON.stringify(modifiedVideos), (err)=>{
                    if(err){
                        store.dispatch(appStateActions.errorHandler({status: true, message: "Could't save file" + err}))
                    } 
                })
            });
            break;

        case types.LOAD_PLAYLIST: 
            dialog.showOpenDialog(null, {filters:[{name: "JSON File", extensions: ["ddx"]}]}, (fn)=>{
                let data = fs.readFileSync(fn[0]);
                store.dispatch({type: `${types.LOAD_PLAYLIST}_PROCESSED`, payload: JSON.parse(data)})
            });
            break;
        case types.YT_PLAYLIST_DOWNLOAD:
            action.payload = clipboard.readText();
            store.dispatch(appStateActions.parsingData(true));
            ytdlPlaylist(action).then((newAction)=>{
                store.dispatch(appStateActions.parsingData(false));
                store.dispatch(uiActions.showPlaylistDialog(newAction.payload));
            }).catch((errAction)=>{
                store.dispatch(appStateActions.parsingData(false));
                next(errAction);
            })
        default: 
            break;
    }
    next(action);
}
